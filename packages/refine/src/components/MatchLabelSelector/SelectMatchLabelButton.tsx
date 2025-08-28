import {
  Popover,
  Radio,
  RadioGroup,
  Typo,
  Button,
  Divider,
  Form,
} from '@cloudtower/eagle';
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
`;
const PopoverContentStyle = css`
  width: 640px;
`;
const PopoverTitleStyle = css`
  margin-bottom: 24px;
`;
const PopoverContentBodyStyle = css`
  padding: 20px;
`;
const PopoverContentFooterStyle = css`
  padding: 8px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
const SelectStyle = css`
  &.ant-select.ant-select-single {
    width: 357px;
    margin-top: 4px;
    margin-left: 26px;
  }
`;

const RadioGroupStyle = css`
  &.ant-radio-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 5px;
  }
`;
const RadioStyle = css`
  &.ant-radio-wrapper {
    &:not(:first-child) {
      margin-top: 8px;
    }
  }
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
  return (
    <ResourceSelect
      className={SelectStyle}
      namespace={namespace}
      resource={resource}
      resourceBasePath={resourceBasePath}
      kind={kind}
      value={value}
      onChange={(newValue, object) => {
        const resourceItem = (object as { object: Deployment | StatefulSet | DaemonSet }).object;
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
  onChange?: (selector: KeyValuePair[]) => void;
}

export function SelectMatchLabelButton(props: SelectMatchLabelButtonProps) {
  const { namespace, onChange } = props;
  const { t } = useTranslation();
  const [workload, setWorkload] = useState<string>('deployment');
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [selector, setSelector] = useState<KeyValuePair[]>([]);
  const [popoverVisible, setPopoverVisible] = useState(false);

  useEffect(() => {
    setSelectedResource('');
  }, [namespace]);

  return (
    <>
      <Popover
        trigger="click"
        visible={popoverVisible}
        onVisibleChange={setPopoverVisible}
        overlayClassName={PopoverOverlayStyle}
        content={
          <div className={PopoverContentStyle}>
            <div className={PopoverContentBodyStyle}>
              <div className={cx(Typo.Display.d3_bold_title, PopoverTitleStyle)}>
                {t('dovetail.specify_workload')}
              </div>
              <FormItem
                label={t('dovetail.workload')}
                labelCol={{ flex: '0 0 216px' }}
                colon={false}
              >
                <RadioGroup
                  className={RadioGroupStyle}
                  value={workload}
                  onChange={e => {
                    setWorkload(e.target.value);
                    setSelectedResource('');
                  }}
                >
                  <Radio value="deployment" className={RadioStyle}>
                    Deployment
                  </Radio>
                  {workload === 'deployment' ? (
                    <ResourceMatchLabelSelector
                      namespace={namespace}
                      resource="deployments"
                      resourceBasePath="/apis/apps/v1"
                      kind="Deployment"
                      value={selectedResource}
                      onChange={(newValue, newSelector) => {
                        setSelector(newSelector);
                        setSelectedResource(newValue);
                      }}
                    />
                  ) : null}
                  <Radio value="statefulset" className={RadioStyle}>
                    StatefulSet
                  </Radio>
                  {workload === 'statefulset' ? (
                    <ResourceMatchLabelSelector
                      namespace={namespace}
                      resource="statefulsets"
                      resourceBasePath="/apis/apps/v1"
                      kind="StatefulSet"
                      value={selectedResource}
                      onChange={(newValue, newSelector) => {
                        setSelector(newSelector);
                        setSelectedResource(newValue);
                      }}
                    />
                  ) : null}
                  <Radio value="daemonset" className={RadioStyle}>
                    DaemonSet
                  </Radio>
                  {workload === 'daemonset' ? (
                    <ResourceMatchLabelSelector
                      namespace={namespace}
                      resource="daemonsets"
                      resourceBasePath="/apis/apps/v1"
                      kind="DaemonSet"
                      value={selectedResource}
                      onChange={(newValue, newSelector) => {
                        setSelector(newSelector);
                        setSelectedResource(newValue);
                      }}
                    />
                  ) : null}
                </RadioGroup>
              </FormItem>
            </div>
            <Divider style={{ margin: '0' }} />
            <div className={PopoverContentFooterStyle}>
              <Button onClick={() => setPopoverVisible(false)} type="quiet">
                {t('dovetail.cancel')}
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  onChange?.(selector);
                  setPopoverVisible(false);
                }}
              >
                {t('dovetail.confirm')}
              </Button>
            </div>
          </div>
        }
      >
        <Button type="quiet" size="small">
          {t('dovetail.specify_workload')}
        </Button>
      </Popover>
    </>
  );
}
