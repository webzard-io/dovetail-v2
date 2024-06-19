import { Plugin } from 'vite';
import WebSocket, { ClientOptions } from 'ws';

const stdin = (characters) => {
  return Buffer.from(`\x00${characters}`, 'utf8');
};

interface PodExecPluginOptions {
  proxyPath: string;
  target?: {
    host?: string;
  }
  wsOptions?: ClientOptions;
  isTransform?: boolean;
}

export const podExecProxyPlugin: (options: PodExecPluginOptions) => Plugin = (options) => {
  const { proxyPath, wsOptions, target, isTransform } = options;
  const wssServer = new WebSocket.Server({
    noServer: true,
  });

  return {
    name: 'pod-exec-proxy',
    configureServer(server) {
      server.httpServer.on('upgrade', (req, socket, head) => {
        const isProxyPath = req.url.startsWith(proxyPath);
        const targetUrl = `wss://${target?.host || ''}${req.url?.replace(new RegExp(`^(${proxyPath})`), '')}`;

        if (isProxyPath) {
          try {
            const podSocket = new WebSocket(targetUrl, 'base64.channel.k8s.io', wsOptions);

            wssServer.handleUpgrade(req, socket, head, (ws) => {
              wssServer.emit('connection', ws, podSocket);
            });

          } catch (err) {
            console.log(err);
          }
        }
      });

      wssServer.on('connection', (ws, podSocket: WebSocket) => {
        podSocket.on('error', (e) => {
          console.log(e);
          ws.close();
        });

        ws.on('close', () => {
          const closeShell = () => {
            const state = podSocket.readyState;

            if (state === WebSocket.CONNECTING) {
              return setTimeout(closeShell, 1000);
            }
            if (state === WebSocket.CLOSING || state === WebSocket.CLOSED) {
              return;
            }
            // Exists current shell to prevent zombie processes
            console.log('exit');
            podSocket.send(stdin('exit\n'));
            podSocket.close();
          };

          closeShell();
          console.log('[!] client connection closed');
        });

        podSocket.on('open', () => {
          podSocket.on('message', (data) => {
            ws.send(data.toString());
          });
          ws.on('message', (message) => {
            podSocket.send(isTransform ? stdin(message) : message);
          });
        });

        podSocket.on('close', () => {
          ws.close();
        });
      });
    }
  };
};
