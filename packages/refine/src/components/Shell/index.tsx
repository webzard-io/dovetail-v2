import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import copyToClipboard from 'copy-to-clipboard';
import React, { useRef, useState, useEffect, useCallback, useImperativeHandle } from 'react';
import '@xterm/xterm/css/xterm.css';

export enum SocketStatus {
  Opening = 'Opening',
  Open = 'Open',
  Disconnected = 'Disconnected'
}

export interface ShellProps {
  url: string;
  protocols?: string;
  encode: (input: string) => string | ArrayBufferLike | Blob | ArrayBufferView;
  decode?: (output: string | ArrayBufferLike | Blob | ArrayBufferView) => string | ArrayBuffer;
  onSocketMessage?: (e: MessageEvent, socket: WebSocket, term: Terminal | null) => void;
  onSocketOpen?: (socket: WebSocket) => void;
  onSocketClose?: (socket: WebSocket, term: Terminal | null) => void;
  onSocketStatusChange?: (socketStatus: SocketStatus) => void;
}

export interface ShellHandler {
  clear: () => void;
  setSocketStatus: React.Dispatch<React.SetStateAction<SocketStatus>>;
}

export const Shell = React.forwardRef<ShellHandler, ShellProps>(function Shell(props: ShellProps, ref) {
  const { url, protocols, encode, decode, onSocketStatusChange } = props;
  const terminalRef = useRef<HTMLDivElement>(null);
  const termInstanceRef = useRef<Terminal | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [socketStatus, setSocketStatus] = useState<SocketStatus>(SocketStatus.Opening);

  const reset = useCallback(() => {
    termInstanceRef.current?.clear();
    termInstanceRef.current?.reset();
  }, []);
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
        setSocketStatus(SocketStatus.Open);
        props.onSocketOpen?.(socket);
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
  }, [url, protocols, decode, props.onSocketClose, props.onSocketMessage, props.onSocketOpen, reset]);
  const send = useCallback((message: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (socketRef.current && socketRef.current.readyState === socketRef.current.OPEN) {
      socketRef.current.send(message);
    }
  }, []);
  const setupTerminal = useCallback(() => {
    if (terminalRef.current) {
      if (termInstanceRef.current) {
        termInstanceRef.current.reset();
        termInstanceRef.current.dispose();
      }

      const term = new Terminal({
        cursorBlink: true,
        cols: 150,
      });
      const fitAddon = new FitAddon();

      term.loadAddon(fitAddon);
      term.open(terminalRef.current);
      fitAddon.fit();

      function onKeyDown(event: KeyboardEvent) {
        if (event.ctrlKey && event.shiftKey && event.key === 'C') {
          event.preventDefault();
          copyToClipboard(term.getSelection());
        }
      }
      function onResize() {
        fitAddon.fit();
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
        term.clear();
        term.dispose();
      };
    }
  }, [send, encode]);

  useEffect(() => {
    const destroy = setupTerminal();

    return () => {
      destroy?.();
    };
  }, []);
  useEffect(() => {
    const disconnect = connect();

    return () => {
      disconnect?.();
    };
  }, [url, protocols]);
  useEffect(() => {
    onSocketStatusChange?.(socketStatus);
  }, [socketStatus]);

  useImperativeHandle(ref, () => ({
    clear() {
      termInstanceRef.current?.clear();
    },
    setSocketStatus,
  }), []);

  return (
    <div ref={terminalRef}></div>
  );
});
