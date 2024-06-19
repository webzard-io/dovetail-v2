import { Select, AntdOption, Button, Space } from '@cloudtower/eagle';
import { useOne } from '@refinedev/core';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import copyToClipboard from 'copy-to-clipboard';
import React, { useRef, useState, useEffect, useMemo, useCallback, useContext } from 'react';
import GlobalStoreContext from 'src/contexts/global-store';
import '@xterm/xterm/css/xterm.css';
import { PodModel } from 'src/models/pod-model';
import { addParams, base64Encode, base64Decode } from 'src/utils/shell';

export enum OS {
  Linux = 'linux',
  Windows = 'windows',
}

export enum SocketStatus {
  Opening = 'Opening',
  Open = 'Open',
  Disconnected = 'Disconnected'
}

interface PodShellProps {
  id: string;
  onSocketStatusChange?: (socketStatus: SocketStatus) => void;
}


const BACKUP_SHELLS = [OS.Windows, OS.Linux];

const COMMANDS = {
  [OS.Linux]: [
    '/bin/sh',
    '-c',
    'TERM=xterm-256color; export TERM; [ -x /bin/bash ] && ([ -x /usr/bin/script ] && /usr/bin/script -q -c "/bin/bash" /dev/null || exec /bin/bash) || exec /bin/sh',
  ],
  [OS.Windows]: ['cmd']
};

export function PodShell(props: PodShellProps) {
  const { id, onSocketStatusChange } = props;
  const { globalStore } = useContext(GlobalStoreContext);
  const [namespace, name] = useMemo(() => id.split('/'), [id]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const termInstanceRef = useRef<Terminal | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const { data } = useOne<PodModel>({
    id,
  });

  const [osIndex, setOsIndex] = useState<number>(0);
  const [container, setContainer] = useState('');
  const [socketStatus, setSocketStatus] = useState<SocketStatus>(SocketStatus.Opening);

  const pod = useMemo(() => data?.data, [data]);
  const containers = useMemo(() => {
    return (pod?._rawYaml.status?.containerStatuses || [])
      .concat(pod?._rawYaml.status?.initContainerStatuses || [])
      .map(containerStatus => containerStatus.name);
  }, [pod]);

  const reset = useCallback(() => {
    setOsIndex(0);
    termInstanceRef.current?.clear();
    termInstanceRef.current?.reset();
  }, []);
  const connect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    let errorMsg = '';

    function onSocketOpen() {
      setSocketStatus(SocketStatus.Open);
    }
    function onSocketError() {
    }
    function onSocketClose() {
      if (errorMsg) {
        if (osIndex + 1 < BACKUP_SHELLS.length) {
          setOsIndex(osIndex + 1);
        } else {
          termInstanceRef.current?.writeln(`\u001b[31m${errorMsg}`);
          setSocketStatus(SocketStatus.Disconnected);
        }
      } else {
        setSocketStatus(SocketStatus.Disconnected);
        termInstanceRef.current?.writeln('');
        termInstanceRef.current?.writeln('\u001b[31m[!] Lost connection');
      }
    }
    function onSocketMessage(e: MessageEvent) {
      const type = e.data.substr(0, 1);
      const msg = base64Decode(e.data.substr(1));

      if (`${type}` === '1') {
        termInstanceRef.current?.write(msg);
      } else {
        if (`${type}` === '3') {
          errorMsg = msg;
        }
      }
    }


    let socket: WebSocket | null = null;
    const os = BACKUP_SHELLS[osIndex];

    if (os && container) {
      setSocketStatus(SocketStatus.Opening);

      const protocol = location.protocol.includes('https') ? 'wss' : 'ws';
      const url = addParams(
        `${protocol}://${location.host}${globalStore?.apiUrl}/api/v1/namespaces/${namespace}/pods/${name}/exec`,
        {
          container,
          stdout: 'true',
          stdin: 'true',
          stderr: 'true',
          tty: 'true',
          command: COMMANDS[os || OS.Linux],
        }
      );

      socket = new WebSocket(url, 'base64.channel.k8s.io');
      socket.addEventListener('open', onSocketOpen);
      socket.addEventListener('close', onSocketClose);
      socket.addEventListener('error', onSocketError);
      socket.addEventListener('message', onSocketMessage);
      socketRef.current = socket;
    } else {
      setSocketStatus(SocketStatus.Disconnected);
    }


    return function disconnect() {
      if (socket) {
        socket.close();
        socket.removeEventListener('open', onSocketOpen);
        socket.removeEventListener('close', onSocketClose);
        socket.removeEventListener('error', onSocketError);
        socket.removeEventListener('message', onSocketMessage);
        socketRef.current = null;
      }
    };
  }, [container, name, namespace, osIndex, globalStore?.apiUrl]);
  const send = useCallback((message: string | Buffer) => {
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
        send(`0${base64Encode(input)}`);
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
  }, [send]);

  useEffect(() => {
    if (!container && containers.length) {
      setContainer(containers[0]);
    }
  }, [containers, container]);
  useEffect(() => {
    const destroy = setupTerminal();

    return () => {
      destroy?.();
    };
  }, [setupTerminal]);
  useEffect(() => {
    const disconnect = connect();

    return () => {
      disconnect();
    };
  }, [connect]);
  useEffect(() => {
    onSocketStatusChange?.(socketStatus);
  }, [socketStatus]);

  return (
    <>
      <Space direction="horizontal" style={{ marginBottom: '16px' }}>
        <Select
          input={{
            value: container,
            onChange(value) {
              reset();
              setContainer(value as string);
            }
          }}
          style={{
            width: '240px',
          }}
        >
          {
            containers.map((containerName) => (
              <AntdOption key={containerName} value={containerName} label={containerName}>{containerName}</AntdOption>
            ))
          }
        </Select>
        <Button
          onClick={() => {
            termInstanceRef.current?.clear();
          }}
          type="primary"
        >Clear</Button>
      </Space>
      <div ref={terminalRef}></div>
    </>
  );
}
