import { Select, AntdOption } from '@cloudtower/eagle';
import { type Terminal } from '@xterm/xterm';
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useImperativeHandle,
} from 'react';
import { Shell, ShellHandler } from 'src/components/Shell';
import { SocketStatus } from 'src/components/Shell/common';
import { PodModel } from 'src/models/pod-model';
import { addParams, base64Encode, base64Decode } from 'src/utils/shell';

export enum OS {
  Linux = 'linux',
  Windows = 'windows',
}

export interface PodShellProps {
  pod: PodModel;
  basePath: string;
  onSocketStatusChange?: (socketStatus: SocketStatus) => void;
}

export interface PodShellHandler {
  getAllTerminalContents: () => string[];
}

enum Channel {
  STDIN = '0',
  STDOUT = '1',
  STDERR = '2',
  ERR = '3',
  RESIZE = '4',
}

const BACKUP_SHELLS = [OS.Windows, OS.Linux];

const COMMANDS = {
  [OS.Linux]: [
    '/bin/sh',
    '-c',
    'TERM=xterm-256color; export TERM; [ -x /bin/bash ] && ([ -x /usr/bin/script ] && /usr/bin/script -q -c "/bin/bash" /dev/null || exec /bin/bash) || exec /bin/sh',
  ],
  [OS.Windows]: ['cmd'],
};

export const PodShell = React.forwardRef<PodShellHandler, PodShellProps>(
  function PodShell(props: PodShellProps, ref) {
    const { pod, basePath, onSocketStatusChange } = props;
    const id = pod.id;
    const [namespace, name] = useMemo(() => id.split('/'), [id]);
    const shellRef = useRef<ShellHandler | null>(null);
    const errorMsgRef = useRef('');

    const [osIndex, setOsIndex] = useState<number>(0);
    const [container, setContainer] = useState('');

    const containers = useMemo(() => {
      return (pod?._rawYaml.status?.containerStatuses || [])
        .concat(pod?._rawYaml.status?.initContainerStatuses || [])
        .map(containerStatus => containerStatus.name);
    }, [pod]);
    const url = useMemo(() => {
      const os = BACKUP_SHELLS[osIndex];
      const protocol = location.protocol.includes('https') ? 'wss' : 'ws';
      const url =
        container && os
          ? addParams(
              `${protocol}://${location.host}${basePath}/api/v1/namespaces/${namespace}/pods/${name}/exec`,
              {
                container,
                stdout: 'true',
                stdin: 'true',
                stderr: 'true',
                tty: 'true',
                command: COMMANDS[os || OS.Linux],
              }
            )
          : '';

      return url;
    }, [container, name, namespace, osIndex, basePath]);

    const onSocketClose = useCallback(
      (socket: WebSocket, term: Terminal | null) => {
        if (errorMsgRef.current) {
          if (osIndex + 1 < BACKUP_SHELLS.length) {
            // try other shells
            setOsIndex(osIndex + 1);
          } else {
            // ansi color: https://codehs.com/tutorial/ryan/add-color-with-ansi-in-javascript
            term?.writeln(`\u001b[38;2;255;82;82m${errorMsgRef.current}`);
            shellRef.current?.setSocketStatus(SocketStatus.Disconnected);
            errorMsgRef.current = '';
          }
        } else {
          shellRef.current?.setSocketStatus(SocketStatus.Disconnected);
        }
      },
      [osIndex]
    );
    const onSocketMessage = useCallback(
      (e: MessageEvent, socket: WebSocket, term: Terminal | null) => {
        const type = e.data.substr(0, 1);
        const msg = base64Decode(e.data.substr(1));

        if (`${type}` === Channel.STDOUT) {
          term?.write(msg);
        } else {
          if (`${type}` === Channel.ERR) {
            errorMsgRef.current = msg;
          }
        }
      },
      []
    );
    const fit = useCallback(({ rows, cols }: { rows: number; cols: number }) => {
      const message = `${Channel.RESIZE}${base64Encode(
        JSON.stringify({
          Width: Math.floor(cols),
          Height: Math.floor(rows),
        })
      )}`;

      shellRef.current?.send(message);
    }, []);
    const encode = useCallback(input => `${Channel.STDIN}${base64Encode(input)}`, []);

    useEffect(() => {
      if (!container && containers.length) {
        setContainer(containers[0]);
      }
    }, [containers, container]);

    useImperativeHandle(
      ref,
      () => ({
        getAllTerminalContents: () => {
          return shellRef.current?.getAllTerminalContents() || [];
        },
      }),
      []
    );

    return (
      <Shell
        ref={shellRef}
        url={url}
        protocols="base64.channel.k8s.io"
        encode={encode}
        fit={fit}
        toolbarLeftSlot={
          <Select
            input={{
              value: container,
              onChange(value) {
                setContainer(value as string);
              },
            }}
            style={{
              width: '256px',
            }}
            size="small"
          >
            {containers.map(containerName => (
              <AntdOption key={containerName} value={containerName} label={containerName}>
                {containerName}
              </AntdOption>
            ))}
          </Select>
        }
        onSocketMessage={onSocketMessage}
        onSocketClose={onSocketClose}
        onSocketStatusChange={onSocketStatusChange}
      />
    );
  }
);
