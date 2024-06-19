import { SegmentControl, Select, AntdOption, Checkbox, Button } from '@cloudtower/eagle';
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
  const [selectedContainer, setSelectedContainer] = useState(
    pod.spec?.containers[0]?.name || ''
  );
  const [logs, setLogs] = useState<string[]>([]);
  const [logType, setLogType] = useState<'realtime' | 'previous'>('realtime');
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

    // scrollOffsetToBottom will be -1 when LogViewer re-renders
    if (scrollOffsetToBottom === -1) {
      setTimeout(() => {
        logViewerRef.current?.scrollToBottom();
      }, 16);
    }

    if (!scrollUpdateWasRequested) {
      if (scrollOffsetToBottom > 0) {
        setPaused(true);
      } else {
        setPaused(false);
      }
    }
  };

  const fetchLogsByUrl = useCallback(async (url) => {
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    fetch(url, { signal }).then(async (response) => {
      if (response.status !== 200) {
        setLogs([]);
        return;
      }
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
  }, []);

  const fetchLogs = useCallback(async () => {
    if (!selectedContainer) {
      return;
    }

    const url = `${apiUrl}/api/v1/namespaces/${pod.metadata?.namespace}/pods/${pod.metadata?.name}/log?container=${selectedContainer}&timestamps=true`;

    if (logType === 'realtime') {
      // await fetchLogsByUrl(url);
      fetchLogsByUrl(`${url}&follow=true`);
    } else if (logType === 'previous') {
      fetchLogsByUrl(`${url}&previous=true`);
    }
  }, [pod.metadata?.namespace, pod.metadata?.name, selectedContainer, logType, apiUrl, fetchLogsByUrl]);

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
          <SegmentControl
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
          <Select
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
            <AntdOption value="" disabled>
              {t('dovetail.select_container')}
            </AntdOption>
            {(pod.spec?.containers || []).map(container => (
              <AntdOption key={container.name} value={container.name}>
                {container.name}
              </AntdOption>
            ))}
          </Select>
        </span>
        <span className={ToolbarAreaStyle}>
          <Checkbox checked={wrap} onChange={e => setWrap(e.target.checked)}>
            {t('dovetail.auto_wrap')}
          </Checkbox>

          <Button
            onClick={() => setPaused(prev => !prev)}
            prefixIcon={paused ? <RecoverContinue16GradientBlueIcon /> : <SuspendedPause16GradientBlueIcon />}
            size="middle"
          >
            {paused ? t('dovetail.resume') : t('dovetail.suspend')}
          </Button>
        </span>

      </div>
      <div className={ContentStyle}>
        {
          logType === 'previous' && !logs.length ? (
            <ErrorContent
              style={{ height: '100%' }}
              errorText={t('dovetail.no_resource', { kind: t('dovetail.previous_log') })}
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
