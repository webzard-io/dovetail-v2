import { useUIKit } from '@cloudtower/eagle';
import {
  SuspendedPause16GradientBlueIcon,
  RecoverContinue16GradientBlueIcon
} from '@cloudtower/icons-react';
import { css } from '@linaria/core';
import { LogViewer } from '@patternfly/react-log-viewer';
import { useDataProvider } from '@refinedev/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent from 'src/components/ErrorContent';

import '@patternfly/react-core/dist/styles/base-no-reset.css';
import { PodModel } from '../../models';

const WrapperStyle = css`
  padding: 0 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const ToolbarStyle = css`
  margin: 8px 0;
  align-items: center;
  display: flex;
  justify-content: space-between;

  > * {
    margin-right: 8px !important;
  }

  .ant-select {
    width: 256px !important;
  }
`;
const ToolbarAreaStyle = css`
  display: flex;
  gap: 12px;
  align-items: center;
`;
const ContentStyle = css`
  flex: 1;
  min-height: 0;
`;

export const PodLog: React.FC<{ pod: PodModel }> = ({ pod }) => {
  const kit = useUIKit();
  const [selectedContainer, setSelectedContainer] = useState(
    pod.spec?.containers[0]?.name || ''
  );
  const [logs, setLogs] = useState<string[]>([]);
  const [logType, setLogType] = useState<'realtime' | 'previous'>();
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

    let url = `${apiUrl}/api/v1/namespaces/${pod.metadata?.namespace}/pods/${pod.metadata?.name}/log?container=${selectedContainer}&timestamps=true`;

    if (logType === 'realtime') {
      url += '&follow=true';
    } else if (logType === 'previous') {
      url += '&previous=true';
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
  }, [pod.metadata?.namespace, pod.metadata?.name, selectedContainer, logType, apiUrl]);

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
    <div className={WrapperStyle}>
      <div className={ToolbarStyle}>
        <span className={ToolbarAreaStyle}>
          <kit.SegmentedControl
            options={[
              {
                label: t('dovetail.realtime_log'),
                value: 'realtime'
              },
              {
                label: t('dovetail.previous_log'),
                value: 'previous'
              },
            ]}
            value={logType}
            onChange={(value) => {
              setLogType(value as 'realtime' | 'previous');
              setLogs([]);
            }}
          />
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
            style={{ width: 200 }}
          >
            <kit.option value="" disabled>
              {t('dovetail.select_container')}
            </kit.option>
            {(pod.spec?.containers || []).map(container => (
              <kit.option key={container.name} value={container.name}>
                {container.name}
              </kit.option>
            ))}
          </kit.select>
        </span>
        <span className={ToolbarAreaStyle}>
          <kit.checkbox checked={wrap} onChange={e => setWrap(e.target.checked)}>
            {t('dovetail.auto_wrap')}
          </kit.checkbox>

          <kit.button
            onClick={() => setPaused(prev => !prev)}
            prefixIcon={paused ? <RecoverContinue16GradientBlueIcon /> : <SuspendedPause16GradientBlueIcon />}
            size="middle"
          >
            {paused ? t('dovetail.resume') : t('dovetail.suspend')}
          </kit.button>
        </span>

      </div>
      <div className={ContentStyle}>
        {
          logType === 'previous' && !logs.length ? (
            <ErrorContent
              style={{ height: '100%' }}
              errorText={t('dovetail.no_resource', { kind: t('dovetail.previous_log') })}
              hiddenRetry
            />
          ) : (
            <LogViewer
              innerRef={logViewerRef}
              height="100%"
              hasLineNumbers={true}
              data={logs}
              theme="light"
              isTextWrapped={wrap}
              onScroll={onScroll}
            />
          )
        }

      </div>
    </div>
  );
};
