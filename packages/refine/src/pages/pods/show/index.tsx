import { useUIKit } from '@cloudtower/eagle';
import { LogViewer } from '@patternfly/react-log-viewer';
import { IResourceComponentsProps } from '@refinedev/core';
import { Pod } from 'kubernetes-types/core/v1';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageShow } from '../../../components/PageShow';
import { PodContainersTable } from '../../../components/PodContainersTable';
import { ConditionsField } from '../../../components/ShowContent/fields';
import { PodModel } from '../../../model';
import { WithId } from '../../../types';
import '@patternfly/react-core/dist/styles/base-no-reset.css';

const PodLogs: React.FC<{ pod: PodModel }> = ({ pod }) => {
  const kit = useUIKit();
  const [selectedContainer, setSelectedContainer] = useState(
    pod.spec?.containers[0]?.name || ''
  );
  const [follow, setFollow] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentItemCount, setCurrentItemCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const [linesBehind, setLinesBehind] = useState(0);
  const logViewerRef = useRef<{ scrollToBottom: () => void }>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!paused && logs.length > 0) {
      setCurrentItemCount(logs.length);
      if (logViewerRef && logViewerRef.current) {
        console.log('scrollToBottom');
        logViewerRef.current.scrollToBottom();
      }
    } else if (logs.length !== currentItemCount) {
      setLinesBehind(logs.length - currentItemCount);
    } else {
      setLinesBehind(0);
    }
  }, [paused, logs, currentItemCount]);

  // console.log({ linesBehind, currentItemCount, len: logs.length, paused, logs });
  const onScroll = ({
    scrollOffsetToBottom,
    scrollUpdateWasRequested,
  }: {
    scrollOffsetToBottom: number;
    scrollUpdateWasRequested: boolean;
  }) => {
    console.log('on', {
      scrollOffsetToBottom,
      scrollUpdateWasRequested,
    });
    if (!scrollUpdateWasRequested) {
      if (scrollOffsetToBottom > 0) {
        setPaused(true);
      } else {
        setPaused(false);
      }
    }
  };

  const fetchLogs = useCallback(() => {
    if (!selectedContainer) {
      return;
    }

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    let url = `/api/k8s/api/v1/namespaces/${pod.metadata?.namespace}/pods/${pod.metadata?.name}/log?container=${selectedContainer}&tailLines=100&timestamps=true`;
    if (follow) {
      url += '&follow=true';
    }

    fetch(url, { signal }).then(response => {
      const reader = response.body?.getReader();
      if (!reader) {
        return;
      }
      const decoder = new TextDecoder();

      let buffer = '';
      const processChunk = ({ done, value }: { done: boolean; value?: Uint8Array }) => {
        if (done) {
          return;
        }

        const chunk = decoder.decode(value);
        const lastIndex = chunk.lastIndexOf('\n');
        if (lastIndex === -1) {
          buffer += chunk;
        }
        const total = buffer + chunk.slice(0, lastIndex);
        buffer = chunk.slice(lastIndex + 1);
        console.log({ buffer, total });

        const formattedLogs = total
          .split('\n')
          .filter(Boolean)
          .map(line => {
            const [timestamps, ...content] = line.split(' ');
            const t = new Date(timestamps).toLocaleString();
            if (t === 'Invalid Date') {
              return line;
            }
            return `${t} ${content.join(' ')}`;
          })
          .join('\n');
        // Update the logs state with the new chunk of data
        setLogs(prevLogs => prevLogs.concat(formattedLogs.split('\n')));

        // Continue reading the next chunk
        reader.read().then(processChunk);
      };

      // Start reading the first chunk
      reader.read().then(processChunk);
    });
  }, [follow, pod, selectedContainer]);

  const stopFetchingLogs = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    return () => {
      stopFetchingLogs();
    };
  }, [fetchLogs, stopFetchingLogs]);

  return (
    <div>
      <select
        onChange={e => {
          stopFetchingLogs();
          setSelectedContainer(e.target.value);
          setLogs([]);
          setPaused(false);
          setLinesBehind(0);
        }}
        value={selectedContainer}
      >
        <option value="">Select Container</option>
        {(pod.spec?.containers || []).map(container => (
          <option key={container.name} value={container.name}>
            {container.name}
          </option>
        ))}
      </select>

      <label>
        <input
          type="checkbox"
          checked={paused}
          onChange={e => setPaused(e.target.checked)}
        />
        Pause
      </label>

      {/* <button onClick={fetchLogs}>Fetch Logs</button> */}

      <LogViewer
        innerRef={logViewerRef}
        hasLineNumbers={true}
        height={300}
        data={logs}
        theme="light"
        isTextWrapped={false}
        footer={
          paused && (
            <kit.button
              type="primary"
              style={{
                borderRadius: 0,
              }}
              onClick={() => setPaused(false)}
            >
              resume {linesBehind === 0 ? null : `and show ${linesBehind} new lines`}
            </kit.button>
          )
        }
        onScroll={onScroll}
      />
    </div>
  );
};

export const PodShow: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();

  return (
    <PageShow<WithId<Pod>, PodModel>
      fieldGroups={[
        [],
        [
          {
            key: 'podIp',
            title: 'Pod IP',
            path: ['status', 'podIP'],
          },
          {
            key: 'Workload',
            title: i18n.t('workload'),
            path: ['metadata', 'ownerReferences', '0', 'name'],
          },
          {
            key: 'Node',
            title: i18n.t('node_name'),
            path: ['spec', 'nodeName'],
          },
          {
            key: 'readyDisplay',
            title: 'Ready',
            path: ['readyDisplay'],
          },
        ],
        [
          {
            key: 'container',
            title: i18n.t('container'),
            path: [],
            render: (_, record) => {
              return (
                <PodContainersTable
                  containerStatuses={record.status?.containerStatuses || []}
                  initContainerStatuses={record.status?.initContainerStatuses || []}
                />
              );
            },
          },
          ConditionsField(i18n),
          {
            key: 'log',
            title: 'Log',
            path: [],
            render: (_, record) => {
              return <PodLogs pod={record} />;
            },
          },
        ],
      ]}
      formatter={d => new PodModel(d)}
    />
  );
};
