import { useUIKit } from '@cloudtower/eagle';
import { LogViewer } from '@patternfly/react-log-viewer';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PodModel } from '../../model';
import { useDataProvider } from '@refinedev/core';
import { useTranslation } from 'react-i18next';
import { css } from '@linaria/core';

import '@patternfly/react-core/dist/styles/base-no-reset.css';
import {
  Resume24Icon,
  SuspendedPause24GradientOrangeIcon,
} from '@cloudtower/icons-react';

const ToolbarStyle = css`
  margin-bottom: 8px;
  align-items: center;
  display: flex;

  > * {
    margin-right: 8px !important;
  }

  .ant-select {
    width: 256px !important;
  }
`;

export const PodLog: React.FC<{ pod: PodModel }> = ({ pod }) => {
  const kit = useUIKit();
  const [selectedContainer, setSelectedContainer] = useState(
    pod.spec?.containers[0]?.name || ''
  );
  const [follow, setFollow] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentItemCount, setCurrentItemCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const [wrap, setWrap] = useState(false);
  const [linesBehind, setLinesBehind] = useState(0);
  const logViewerRef = useRef<{ scrollToBottom: () => void }>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const dataProvider = useDataProvider();
  const apiUrl = dataProvider()['getApiUrl']();

  const { t } = useTranslation();

  useEffect(() => {
    if (!paused && logs.length > 0) {
      setCurrentItemCount(logs.length);
      if (logViewerRef && logViewerRef.current) {
        logViewerRef.current.scrollToBottom();
      }
    } else if (logs.length !== currentItemCount) {
      setLinesBehind(logs.length - currentItemCount);
    } else {
      setLinesBehind(0);
    }
  }, [paused, logs, currentItemCount]);

  const onScroll = (params: {
    scrollOffsetToBottom: number;
    scrollUpdateWasRequested: boolean;
  }) => {
    const { scrollOffsetToBottom, scrollUpdateWasRequested } = params;
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

    let url = `${apiUrl}/api/v1/namespaces/${pod.metadata?.namespace}/pods/${pod.metadata?.name}/log?container=${selectedContainer}&tailLines=100&timestamps=true`;
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
  }, [follow, pod.metadata?.namespace, pod.metadata?.name, selectedContainer]);

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
      <div className={ToolbarStyle}>
        <kit.select
          input={{
            onChange: newValue => {
              stopFetchingLogs();
              setSelectedContainer(newValue as string);
              setLogs([]);
              setPaused(false);
              setLinesBehind(0);
            },
            value: selectedContainer,
          }}
        >
          <kit.option value="" disabled>
            {t('select_container')}
          </kit.option>
          {(pod.spec?.containers || []).map(container => (
            <kit.option key={container.name} value={container.name}>
              {container.name}
            </kit.option>
          ))}
        </kit.select>

        <kit.checkbox checked={wrap} onChange={e => setWrap(e.target.checked)}>
          {t('wrap')}
        </kit.checkbox>

        <kit.button
          onClick={() => setPaused(prev => !prev)}
          prefixIcon={paused ? <Resume24Icon /> : <SuspendedPause24GradientOrangeIcon />}
        >
          {paused ? t('resume_log') : t('suspend')}
        </kit.button>
      </div>

      <LogViewer
        innerRef={logViewerRef}
        hasLineNumbers={true}
        height={300}
        data={logs}
        theme="light"
        isTextWrapped={wrap}
        footer={
          paused && (
            <kit.button
              type="primary"
              style={{
                borderRadius: 0,
              }}
              onClick={() => setPaused(false)}
            >
              {t('resume_log')}
              {linesBehind === 0 ? null : t('log_new_lines', { count: linesBehind })}
            </kit.button>
          )
        }
        onScroll={onScroll}
      />
    </div>
  );
};
