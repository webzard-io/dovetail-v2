import { css, cx } from '@linaria/core';
import { CanvasAddon } from '@xterm/addon-canvas';
import { FitAddon } from '@xterm/addon-fit';
import { SearchAddon } from '@xterm/addon-search';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { WebglAddon } from '@xterm/addon-webgl';
import { Terminal } from '@xterm/xterm';
import { ITerminalOptions } from '@xterm/xterm';
import copyToClipboard from 'copy-to-clipboard';
import React, { useRef, useMemo, useState, useEffect, useCallback, useImperativeHandle } from 'react';
import ShellToolbar, { ShellToolbarProps } from './ShellToolbar';
import '@xterm/xterm/css/xterm.css';

const ContainerStyle = css`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const ShellStyle = css`
  flex: 1;
`;

export enum SocketStatus {
  Opening = 'Opening',
  Open = 'Open',
  Disconnected = 'Disconnected'
}

export type ShellProps = React.PropsWithChildren<{
  url: string;
  protocols?: string;
  className?: string;
  operations?: ShellToolbarProps['operations'];
  encode: (input: string) => string | ArrayBufferLike | Blob | ArrayBufferView;
  decode?: (output: string | ArrayBufferLike | Blob | ArrayBufferView) => string | ArrayBuffer;
  fit?: (layout: { rows: number; cols: number }) => void;
  onSocketInit?: (socket: WebSocket) => void;
  onTermInit?: (term: Terminal) => void;
  onSocketMessage?: (e: MessageEvent, socket: WebSocket, term: Terminal | null) => void;
  onSocketOpen?: (socket: WebSocket) => void;
  onSocketClose?: (socket: WebSocket, term: Terminal | null) => void;
  onSocketStatusChange?: (socketStatus: SocketStatus) => void;
}>

export interface ShellHandler {
  clear: () => void;
  send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
  fit: () => void;
  getAllTerminalContents: () => string[];
  setSocketStatus: React.Dispatch<React.SetStateAction<SocketStatus>>;
  searchNext: (search: string) => void;
  searchPrevious: (search: string) => void;
  setOptions: (options: Record<string, unknown>) => void;
}

export const Shell = React.forwardRef<ShellHandler, ShellProps>(function Shell(props: ShellProps, ref) {
  const { className, url, protocols, operations, encode, decode, onSocketStatusChange, onTermInit, onSocketInit, children } = props;
  const terminalRef = useRef<HTMLDivElement>(null);
  const termInstanceRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const searchAddonRef = useRef<SearchAddon | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const backlogRef = useRef<(string | ArrayBufferLike | Blob | ArrayBufferView)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [socketStatus, setSocketStatus] = useState<SocketStatus>(SocketStatus.Opening);

  const searchOptions = useMemo(() => ({
    decorations: {
      activeMatchColorOverviewRuler: '#00ffff',
      matchOverviewRuler: '#0000ff',
      activeMatchBackground: '#ff6600',
      matchBackground: '#ff0'
    }
  }), []);

  const reset = useCallback(() => {
    termInstanceRef.current?.clear();
    termInstanceRef.current?.reset();
  }, []);
  const send = useCallback((message: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (socketRef.current && socketRef.current.readyState === socketRef.current.OPEN) {
      socketRef.current.send(message);
    } else {
      backlogRef.current.push(message);
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
  const flush = useCallback(() => {
    const backlog = backlogRef.current.slice();

    backlogRef.current = [];

    for (const data of backlog) {
      send(data);
    }
  }, [send]);
  const connect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    if (url) {
      const socket = new WebSocket(url, protocols);

      function onSocketError(e: Event) {
        console.log(e);
      }
      function onSocketOpen() {
        props.onSocketOpen?.(socket);
        setSocketStatus(SocketStatus.Open);
        fit();
        flush();
      }
      function onSocketClose() {
        if (props.onSocketClose) {
          props.onSocketClose(socket, termInstanceRef.current);
        } else {
          setSocketStatus(SocketStatus.Disconnected);
          termInstanceRef.current?.writeln('');
          termInstanceRef.current?.writeln('\u001b[31m[!] Lost connection');
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

      reset();
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
  }, [url, protocols, decode, props.onSocketClose, props.onSocketMessage, props.onSocketOpen, reset, flush, fit, onSocketInit]);
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
      });
      let renderAddon = null;

      try {
        renderAddon = new WebglAddon();
      } catch {
        renderAddon = new CanvasAddon();
      }

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
      term.onData((input) => {
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
  }, [send, encode, onTermInit, fit, flush]);
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
    a.download = 'term';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }, [getAllTerminalContents]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, protocols]);
  useEffect(() => {
    onSocketStatusChange?.(socketStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketStatus]);
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      fit();
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [fit]);

  useImperativeHandle(ref, () => ({
    clear,
    setSocketStatus,
    fit,
    send,
    searchNext,
    searchPrevious,
    getAllTerminalContents,
    setOptions(options) {
      Object.entries(options).forEach(([key, value]) => {
        if (termInstanceRef.current) {
          termInstanceRef.current.options[key as keyof ITerminalOptions] = value;
        }
      });
      fit();
    }
  }), [send, searchNext, searchPrevious, getAllTerminalContents, fit, clear]);

  return (
    <div ref={containerRef} className={ContainerStyle}>
      <ShellToolbar
        operations={operations}
        onSearchNext={searchNext}
        onSearchPre={searchPrevious}
        onClear={clear}
        onDownloadLog={downloadContent}
      />
      <div ref={terminalRef} className={cx(ShellStyle, className)}>{children}</div>
    </div>
  );
});
