import { Select, AntdOption, Button, Space } from '@cloudtower/eagle';
import { useOne } from '@refinedev/core';
import { Terminal } from '@xterm/xterm';
import React, { useRef, useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { Shell, SocketStatus, ShellHandler } from 'src/components/Shell';
import GlobalStoreContext from 'src/contexts/global-store';
import '@xterm/xterm/css/xterm.css';
import { PodModel } from 'src/models/pod-model';
import { addParams, base64Encode, base64Decode } from 'src/utils/shell';

export enum OS {
  Linux = 'linux',
  Windows = 'windows',
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
  const shellRef = useRef<ShellHandler | null>(null);
  const errorMsgRef = useRef('');
  const { data } = useOne<PodModel>({
    id,
  });

  const [osIndex, setOsIndex] = useState<number>(0);
  const [container, setContainer] = useState('');

  const pod = useMemo(() => data?.data, [data]);
  const containers = useMemo(() => {
    return (pod?._rawYaml.status?.containerStatuses || [])
      .concat(pod?._rawYaml.status?.initContainerStatuses || [])
      .map(containerStatus => containerStatus.name);
  }, [pod]);
  const url = useMemo(() => {
    const os = BACKUP_SHELLS[osIndex];
    const protocol = location.protocol.includes('https') ? 'wss' : 'ws';
    const url = container && os ? addParams(
      `${protocol}://${location.host}${globalStore?.apiUrl}/api/v1/namespaces/${namespace}/pods/${name}/exec`,
      {
        container,
        stdout: 'true',
        stdin: 'true',
        stderr: 'true',
        tty: 'true',
        command: COMMANDS[os || OS.Linux],
      }
    ) : '';

    return url;
  }, [container, name, namespace, osIndex, globalStore?.apiUrl]);

  const onSocketClose = useCallback((socket: WebSocket, term: Terminal | null) => {
    if (errorMsgRef.current) {
      if (osIndex + 1 < BACKUP_SHELLS.length) {
        setOsIndex(osIndex + 1);
      } else {
        term?.writeln(`\u001b[31m${errorMsgRef.current}`);
        shellRef.current?.setSocketStatus(SocketStatus.Disconnected);
        errorMsgRef.current = '';
      }
    } else {
      shellRef.current?.setSocketStatus(SocketStatus.Disconnected);
      term?.writeln('');
      term?.writeln('\u001b[31m[!] Lost connection');
    }
  }, [osIndex]);
  const onSocketMessage = useCallback((e: MessageEvent, socket: WebSocket, term: Terminal | null) => {
    const type = e.data.substr(0, 1);
    const msg = base64Decode(e.data.substr(1));

    if (`${type}` === '1') {
      term?.write(msg);
    } else {
      if (`${type}` === '3') {
        errorMsgRef.current = msg;
      }
    }
  }, []);

  useEffect(() => {
    if (!container && containers.length) {
      setContainer(containers[0]);
    }
  }, [containers, container]);

  return (
    <>
      <Space direction="horizontal" style={{ marginBottom: '16px' }}>
        <Select
          input={{
            value: container,
            onChange(value) {
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
            shellRef.current?.clear();
          }}
          type="primary"
        >Clear</Button>
      </Space>
      <Shell
        ref={shellRef}
        url={url}
        protocols="base64.channel.k8s.io"
        encode={(input) => `0${base64Encode(input)}`}
        onSocketMessage={onSocketMessage}
        onSocketClose={onSocketClose}
        onSocketStatusChange={onSocketStatusChange}
      />
    </>
  );
}
