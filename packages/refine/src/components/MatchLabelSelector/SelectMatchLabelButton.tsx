import { Popover, Typo, Button, Divider, Form, Select } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import { Deployment, StatefulSet } from 'kubernetes-types/apps/v1';
import { DaemonSet } from 'kubernetes-types/apps/v1';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyValuePair } from 'src/components/KeyValueTableForm';
import { ResourceSelect } from 'src/components/ResourceSelect';

const PopoverOverlayStyle = css`
  .ant-popover-inner {
    border-radius: 8px;
  }
  .ant-popover-inner-content {
    padding: 0;
  }
  .ant-popover-arrow {
    display: none;
  }
`;
const PopoverContentStyle = css`
  width: 463px;
`;
const PopoverTitleStyle = css`
  margin-bottom: 8px;
`;
const PopoverContentBodyStyle = css`
  padding: 12px;
`;
const PopoverContentFooterStyle = css`
  padding: 8px 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
const FormWrapperStyle = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormItem = Form.Item;

interface ResourceMatchLabelSelectorProps {
  namespace: string;
  resource: string;
  resourceBasePath: string;
  kind: string;
  value: string;
  onChange: (value: string, selector: KeyValuePair[]) => void;
}

function ResourceMatchLabelSelector({
  namespace,
  resource,
  resourceBasePath,
  kind,
  value,
  onChange,
}: ResourceMatchLabelSelectorProps) {
  const { t } = useTranslation();

  return (
    <ResourceSelect
      namespace={namespace}
      resource={resource}
      resourceBasePath={resourceBasePath}
      kind={kind}
      value={value}
      placeholder={t('dovetail.select_workload')}
      onChange={(newValue, object) => {
        const resourceItem = (object as { object: Deployment | StatefulSet | DaemonSet })
          .object;
        const newSelector = Object.entries(
          resourceItem?.spec?.selector?.matchLabels || {}
        ).map(([key, value]) => ({
          key,
          value,
        }));

        onChange?.(newValue as string, newSelector);
      }}
    />
  );
}

export interface SelectMatchLabelButtonProps {
  namespace: string;
  disabled?: boolean;
  onChange?: (selector: KeyValuePair[]) => void;
}

export function SelectMatchLabelButton(props: SelectMatchLabelButtonProps) {
  const { namespace, onChange, disabled } = props;
  const { t } = useTranslation();
  const [workload, setWorkload] = useState<string>('deployments');
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [selector, setSelector] = useState<KeyValuePair[]>([]);
  const [popoverVisible, setPopoverVisible] = useState(false);

  const kindMap = {
    deployment: 'Deployment',
    statefulset: 'StatefulSet',
    daemonset: 'DaemonSet',
  };

  useEffect(() => {
    setSelectedResource('');
  }, [namespace]);

  return (
    <>
      <Popover
        trigger="click"
        visible={popoverVisible}
        onVisibleChange={newPopoverVisible => {
          if (disabled) return;

          setPopoverVisible(newPopoverVisible);
        }}
        overlayClassName={PopoverOverlayStyle}
        content={
          <div className={PopoverContentStyle}>
            <div className={PopoverContentBodyStyle}>
              <div className={cx(Typo.Heading.h2_bold_title, PopoverTitleStyle)}>
                {t('dovetail.specify_workload')}
              </div>
              <div className={FormWrapperStyle}>
                <FormItem
                  label={t('dovetail.type')}
                  labelCol={{ flex: '0 0 134px' }}
                  colon={false}
                >
                  <Select
                    input={{
                      value: workload,
                      onChange: newWorkload => {
                        setWorkload(newWorkload as string);
                        setSelectedResource('');
                      },
                    }}
                    options={[
                      { label: 'Deployment', value: 'deployments' },
                      { label: 'StatefulSet', value: 'statefulsets' },
                      { label: 'DaemonSet', value: 'daemonsets' },
                    ]}
                  />
                </FormItem>
                <FormItem
                  label={t('dovetail.workload')}
                  labelCol={{ flex: '0 0 134px' }}
                  colon={false}
                >
                  <ResourceMatchLabelSelector
                    namespace={namespace}
                    resource={workload}
                    resourceBasePath="/apis/apps/v1"
                    kind={kindMap[workload as keyof typeof kindMap]}
                    value={selectedResource}
                    onChange={(newValue, newSelector) => {
                      setSelector(newSelector);
                      setSelectedResource(newValue);
                    }}
                  />
                </FormItem>
              </div>
            </div>
            <Divider style={{ margin: '0' }} />
            <div className={PopoverContentFooterStyle}>
              <Button onClick={() => setPopoverVisible(false)} type="quiet" size="small">
                {t('dovetail.cancel')}
              </Button>
              <Button
                type="primary"
                size="small"
                disabled={!selectedResource}
                onClick={() => {
                  onChange?.(selector);
                  setPopoverVisible(false);
                }}
              >
                {t('dovetail.add')}
              </Button>
            </div>
          </div>
        }
      >
        <Button type="link" size="small" disabled={disabled}>
          {t('dovetail.specify_workload')}
        </Button>
      </Popover>
    </>
  );
}
