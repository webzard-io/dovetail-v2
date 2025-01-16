import { Alert, Typo, Link, Icon } from '@cloudtower/eagle';
import { Loading24GradientBlueIcon } from '@cloudtower/icons-react';
import { css, cx } from '@linaria/core';
import { CanvasAddon } from '@xterm/addon-canvas';
import { FitAddon } from '@xterm/addon-fit';
import { SearchAddon } from '@xterm/addon-search';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { WebglAddon } from '@xterm/addon-webgl';
import { Terminal } from '@xterm/xterm';
import { ITerminalOptions } from '@xterm/xterm';
import copyToClipboard from 'copy-to-clipboard';
import { debounce } from 'lodash-es';
import React, { useRef, useMemo, useState, useEffect, useCallback, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import ShellToolbar, { ShellToolbarProps } from './ShellToolbar';
import '@xterm/xterm/css/xterm.css';

const ContainerStyle = css`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const ShellStyle = css`
  flex: 1;
  min-height: 0;
  padding: 8px;
  background: #00122E;
`;
const LoadingStyle = css`
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  color: #2C385299;
  background: #F2F5FA;
`;
const ErrorAlertStyle = css`
  display: flex;
  justify-content: space-between;
`;
const ToolbarStyle = css`
  margin: 4px 8px;
`;

export enum SocketStatus {
  Opening = 'Opening',
  Open = 'Open',
  Disconnected = 'Disconnected'
}

export type ShellProps = React.PropsWithChildren<{
  url: string;
  protocols?: string;
  timeout?: number;
  className?: string;
  logFileName?: string;
  isHideToolbar?: boolean;
  toolbarLeftSlot?: React.ReactNode;
  operations?: ShellToolbarProps['operations'];
  shellOptions?: Record<string, unknown>;
  loadingElement?: React.ReactNode;
  encode: (input: string) => string | ArrayBufferLike | Blob | ArrayBufferView;
  decode?: (output: string | ArrayBufferLike | Blob | ArrayBufferView) => string | ArrayBuffer;
  fit?: (layout: { rows: number; cols: number }) => void;
  onReconnect?: () => void;
  onSocketInit?: (socket: WebSocket) => void;
  onTermInit?: (term: Terminal) => void;
  onClear?: () => void;
  onSocketMessage?: (e: MessageEvent, socket: WebSocket, term: Terminal | null) => void;
  onSocketOpen?: (socket: WebSocket) => void;
  onSocketClose?: (socket: WebSocket, term: Terminal | null) => void;
  onSocketStatusChange?: (socketStatus: SocketStatus) => void;
}>

export interface ShellHandler {
  clear: () => void;
  send: (data: string | ArrayBufferLike | Blob | ArrayBufferView, callback?: () => void) => void;
  connect: () => void;
  fit: () => void;
  getAllTerminalContents: () => string[];
  setSocketStatus: React.Dispatch<React.SetStateAction<SocketStatus>>;
  searchNext: (search: string) => void;
  searchPrevious: (search: string) => void;
  setOptions: (options: Record<string, unknown>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: unknown) => void;
  writeln: (data: string) => void;
}

export const Shell = React.forwardRef<ShellHandler, ShellProps>(function Shell(props: ShellProps, ref) {
  const {
    className,
    url,
    protocols,
    timeout = 10000,
    logFileName,
    operations,
    isHideToolbar,
    toolbarLeftSlot,
    shellOptions,
    loadingElement,
    encode,
    decode,
    onSocketStatusChange,
    onTermInit,
    onSocketInit,
    children,
  } = props;
  const terminalRef = useRef<HTMLDivElement>(null);
  const termInstanceRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const searchAddonRef = useRef<SearchAddon | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const backlogRef = useRef<{
    message: (string | ArrayBufferLike | Blob | ArrayBufferView),
    callback?: () => void
  }[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [socketStatus, setSocketStatus] = useState<SocketStatus>(SocketStatus.Opening);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [searchMatchedTotal, setSearchMatchedTotal] = useState(0);
  const { t } = useTranslation();

  const searchOptions = useMemo(() => ({
    decorations: {
      activeMatchColorOverviewRuler: '#FEA008',
      matchOverviewRuler: '#E07F00',
      activeMatchBackground: '#FEA008',
      matchBackground: '#E07F00'
    }
  }), []);

  const reset = useCallback(() => {
    termInstanceRef.current?.clear();
    termInstanceRef.current?.reset();
  }, []);
  const send = useCallback((message: string | ArrayBufferLike | Blob | ArrayBufferView, callback?: () => void) => {
    if (socketRef.current && socketRef.current.readyState === socketRef.current.OPEN) {
      socketRef.current.send(message);
      callback?.();
    } else {
      /** if the socket is not ready, the message will saved in the backlog and be sent after the socket ready */
      backlogRef.current.push({
        message,
        callback,
      });
    }
  }, []);
  const fit = useCallback(() => {
    if (!fitAddonRef.current) return;

    fitAddonRef.current.fit();

    const { rows, cols } = fitAddonRef.current.proposeDimensions() || {};

    if (rows && cols) {
      props.fit?.({
        rows,
        cols
      });
    }
  }, [encode, send, props.fit]);
  const debouncedFit = useMemo(() => debounce(fit, 200), [fit]);
  const flush = useCallback(() => {
    const backlog = backlogRef.current.slice();

    backlogRef.current = [];

    for (const data of backlog) {
      send(data.message, data.callback);
    }
  }, [send]);
  const connect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    if (url) {
      setLoading(true);
      setError(false);

      const socket = new WebSocket(url, protocols);
      const timer = setTimeout(() => {
        setLoading(false);
        socket.close();
      }, timeout);

      function onSocketError() {
        setLoading(false);
        setError(true);
      }
      function onSocketOpen() {
        props.onSocketOpen?.(socket);
        clearTimeout(timer);
        setSocketStatus(SocketStatus.Open);
        fit();
        flush();
        setError(false);
        setLoading(false);
      }
      function onSocketClose() {
        setLoading(false);
        setError(true);

        if (props.onSocketClose) {
          props.onSocketClose(socket, termInstanceRef.current);
        } else {
          setSocketStatus(SocketStatus.Disconnected);
        }
      }
      function onSocketMessage(e: MessageEvent) {
        if (props.onSocketMessage) {
          props.onSocketMessage(e, socket, termInstanceRef.current);
        } else {
          const msg = decode?.(e.data) || e.data;

          termInstanceRef.current?.write(msg);
        }
      }

      setSocketStatus(SocketStatus.Opening);

      onSocketInit?.(socket);
      socket.addEventListener('open', onSocketOpen);
      socket.addEventListener('message', onSocketMessage);
      socket.addEventListener('close', onSocketClose);
      socket.addEventListener('error', onSocketError);
      socketRef.current = socket;

      return function disconnect() {
        if (socket) {
          socket.close();
          socket.removeEventListener('open', onSocketOpen);
          socket.removeEventListener('message', onSocketMessage);
          socket.removeEventListener('close', onSocketClose);
          socket.removeEventListener('error', onSocketError);
          socketRef.current = null;
        }
      };
    }
  }, [url, protocols, decode, props.onSocketClose, props.onSocketMessage, props.onSocketOpen, reset, flush, fit, onSocketInit, timeout]);
  const setupTerminal = useCallback(() => {
    if (terminalRef.current) {
      if (termInstanceRef.current) {
        termInstanceRef.current.reset();
        termInstanceRef.current.dispose();
      }

      const term = new Terminal({
        cursorBlink: true,
        cols: 150,
        allowProposedApi: true,
        fontSize: 12,
        theme: {
          background: '#00122E',
        },
        ...shellOptions,
      });
      let renderAddon = null;

      try {
        renderAddon = new WebglAddon();
      } catch {
        renderAddon = new CanvasAddon();
      }

      // init and setup addons
      onTermInit?.(term);
      term.loadAddon(fitAddonRef.current = new FitAddon());
      term.loadAddon(searchAddonRef.current = new SearchAddon());
      term.loadAddon(new WebLinksAddon());
      term.loadAddon(renderAddon);
      term.open(terminalRef.current);
      fit();
      flush();

      function onKeyDown(event: KeyboardEvent) {
        if (event.ctrlKey && event.shiftKey && event.key === 'C') {
          event.preventDefault();
          copyToClipboard(term.getSelection());
        }
      }
      function onResize() {
        fit();
      }

      document.addEventListener('keydown', onKeyDown);
      window.addEventListener('resize', onResize);
      searchAddonRef.current.onDidChangeResults(({ resultCount }) => {
        setSearchMatchedTotal(resultCount);
      });
      term.onData((input) => {
        // send hte terminal input to websocket
        send(encode(input));
      });
      termInstanceRef.current = term;

      return function destroy() {
        document.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('resize', onResize);
        termInstanceRef.current = null;
        fitAddonRef.current = null;
        searchAddonRef.current = null;
        term.clear();
        term.dispose();
      };
    }
  }, [send, encode, onTermInit, fit, flush, shellOptions]);
  const searchNext = useCallback((search: string) => {
    searchAddonRef.current?.findNext(search || '', searchOptions);
  }, [searchOptions]);
  const searchPrevious = useCallback((search: string) => {
    searchAddonRef.current?.findPrevious(search || '', searchOptions);
  }, [searchOptions]);
  const getAllTerminalContents = useCallback(() => {
    if (!termInstanceRef.current) return [];

    const buffer = termInstanceRef.current.buffer.active;
    const lines = [];

    for (let i = 0; i < buffer.length; i++) {
      const line = buffer.getLine(i);
      if (line) {
        lines.push(line.translateToString(true));
      }
    }

    return lines;
  }, []);
  const clear = useCallback(() => {
    termInstanceRef.current?.clear();
  }, []);
  const downloadContent = useCallback(() => {
    const content = (getAllTerminalContents() || []).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${logFileName || 'term'}.log`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }, [getAllTerminalContents, logFileName]);
  const setOptions = useCallback((options) => {
    Object.entries(options).forEach(([key, value]) => {
      if (termInstanceRef.current) {
        termInstanceRef.current.options[key as keyof ITerminalOptions] = value;
      }
    });
    fit();
  }, [fit]);
  const writeln = useCallback((data: string) => {
    termInstanceRef.current?.writeln(data);
  }, []);
  const onClear = useCallback(() => {
    clear();
    props.onClear?.();
  }, [clear, props.onClear]);

  useEffect(() => {
    const destroy = setupTerminal();

    return () => {
      destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const disconnect = connect();

    return () => {
      disconnect?.();
    };
    // reconnect when the url or protocols is changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, protocols]);
  useEffect(() => {
    onSocketStatusChange?.(socketStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketStatus]);
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      debouncedFit();
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [debouncedFit]);

  useImperativeHandle(ref, () => ({
    clear,
    setSocketStatus,
    fit,
    send,
    connect,
    searchNext,
    searchPrevious,
    getAllTerminalContents,
    setOptions,
    setLoading,
    setError,
    writeln,
  }), [send, searchNext, searchPrevious, getAllTerminalContents, fit, clear, connect, setOptions, writeln]);

  return (
    <div ref={containerRef} className={ContainerStyle}>
      {!!error ? <Alert
        style={{ margin: 8, marginBottom: 4 }}
        message={(
          <span className={ErrorAlertStyle}>
            {t('dovetail.disconnected')}
            <Link onClick={() => {
              if (props.onReconnect) {
                props.onReconnect();
              } else {
                connect();
              }
            }}>{t('dovetail.reconnect')}</Link>
          </span>
        )}
        type="error"
      /> : null}
      {isHideToolbar ? null : (
        <ShellToolbar
          className={ToolbarStyle}
          leftSlot={toolbarLeftSlot}
          searchMatchedTotal={searchMatchedTotal}
          operations={operations}
          onSearchNext={searchNext}
          onSearchPre={searchPrevious}
          onClear={onClear}
          onDownloadLog={downloadContent}
          onSetFontSize={(fontSize) => {
            setOptions({
              fontSize
            });
          }}
        />
      )}
      {
        loading ? loadingElement || (
          <div className={LoadingStyle}>
            <Icon src={Loading24GradientBlueIcon} iconWidth={24} iconHeight={24} isRotate />
            <span className={Typo.Display.d2_bold_title}>{t('dovetail.connecting')}</span>
          </div>
        ) : null
      }
      <div
        className={cx(ShellStyle, className)}
        style={{
          display: loading ? 'none' : 'block',
        }}
      >
        <div
          ref={terminalRef}
          style={{ height: '100%' }}
        >{children}</div>
      </div>
    </div>
  );
});
