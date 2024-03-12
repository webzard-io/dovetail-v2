/* eslint-disable @typescript-eslint/no-empty-function */
import { useUIKit, Typo } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import { useResource, useUpdate } from '@refinedev/core';
import { get } from 'lodash-es';
import React, { useState, useMemo, useCallback, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { EditField } from 'src/components/EditField';
import { WorkloadModel, JobModel } from '../../models';
import { pruneBeforeEdit } from '../../utils/k8s';

const WorkloadReplicasWrapperStyle = css`
  border-radius: 8px;
  border: 1px solid rgba(211, 218, 235, 0.60);
  padding: 16px;
  display: inline-flex;
`;
const DonutChartWrapperStyle = css`
  width: 70px;
  height: 70px;
  margin-right: 16px;
`;
const DonutChartStyle = css`
  width: 100%;
`;
const DonutChartCenterStyle = css`
  position: absolute;
  left: 35px;
  top: 35px;
  transform: translate(-50%, -50%);
`;
const ReadyValueStyle = css`
  color: #00122E;
`;
const ReplicasValueStyle = css`
  color: rgba(44, 56, 82, 0.60);
`;
const ContentWrapperStyle = css`
  margin: auto 0;
  position: relative;
`;
const LabelStyle = css`
  margin-right: 40px;
`;

interface WorkloadReplicasFormProps {
  defaultValue: number;
  record: WorkloadModel;
  label: string;
}

interface WorkloadReplicasFormHandler {
  submit: () => Promise<unknown> | undefined;
}

export const WorkloadReplicasForm = React.forwardRef<WorkloadReplicasFormHandler, WorkloadReplicasFormProps>(function WorkloadReplicasForm(props, ref) {
  const { defaultValue, record, label } = props;
  const kit = useUIKit();
  const { resource } = useResource();
  const { mutateAsync } = useUpdate();

  const [replicas, setReplicas] = useState(defaultValue);

  const submit = useCallback(() => {
    const v = record.scale(replicas);
    const id = record.id;

    pruneBeforeEdit(v);

    return mutateAsync({
      id,
      resource: resource?.name || '',
      values: v,
      successNotification: false,
      errorNotification: false,
    });
  }, [record, replicas, resource?.name, mutateAsync]);

  useImperativeHandle(ref, () => ({
    submit,
  }), [submit]);

  return (
    <kit.form.Item
      label={<span style={{ width: '134px' }}>{label}</span>}
      colon={false}
    >
      <kit.fields.Integer
        style={{ width: '142px' }}
        input={{
          name: 'replicas',
          value: replicas,
          onChange: (value) => {
            setReplicas(Number(value));
          },
          onBlur: () => { },
          onFocus: () => { },
        }}
        min={0}
        meta={{}}
        controls
      />
    </kit.form.Item>
  );
});

export interface WorkloadReplicasProps {
  record: WorkloadModel | JobModel;
  editable?: boolean;
}

export function WorkloadReplicas({ record, editable }: WorkloadReplicasProps) {
  const kit = useUIKit();
  const { t } = useTranslation();
  const formRef = useRef<WorkloadReplicasFormHandler | null>(null);

  const readyReplicas = (('succeeded' in record && record.succeeded) || ('readyReplicas' in record && record.readyReplicas)) || 0;
  const replicas = (('completions' in record && record.completions) || ('replicas' in record && record.replicas)) || 0;

  const canScale = record.kind === 'Deployment' || record.kind === 'StatefulSet';

  const donutData = useMemo(() => {
    const data = [{
      name: 'ready',
      value: readyReplicas,
      color: 'rgba(33, 190, 106, 1)'
    }];
    const remain = replicas - readyReplicas;

    if (remain > 0) {
      data.push({
        name: 'remain',
        value: remain,
        color: 'rgba(162, 240, 213, 1)'
      });
    }

    return data;
  }, [replicas, readyReplicas]);

  return (
    <span className={WorkloadReplicasWrapperStyle}>
      <div className={DonutChartWrapperStyle}>
        <kit.DonutChart
          className={DonutChartStyle}
          data={donutData}
          width={70}
          height={70}
          innerRadius={26}
          outerRadius={32}
          centerRender={(
            <div className={DonutChartCenterStyle}>
              <span className={cx(ReadyValueStyle, Typo.Display.d2_bold_title)}>{readyReplicas}</span>
              <span className={cx(ReplicasValueStyle, Typo.Label.l1_bold_title)}>/{replicas}</span>
            </div>
          )}
          widthPadding={false}
          showLegend={false}
        >
        </kit.DonutChart>
      </div>
      <div className={ContentWrapperStyle}>
        <div>
          <span className={LabelStyle}>{t('dovetail.pod_ready_num')}</span>
          <span>{readyReplicas}</span>
        </div>
        <div>
          <span className={LabelStyle}>{t('dovetail.pod_replicas_num')}</span>
          <span>{replicas}</span>
          <span>
            {
              editable && canScale && (
                <EditField
                  modalProps={{
                    formRef,
                    title: t('dovetail.edit_replicas'),
                    successMsg: t('dovetail.save_replicas_success_toast', {
                      kind: record.kind,
                      name: record.id,
                      interpolation: {
                        escapeValue: false
                      }
                    }),
                    renderContent() {
                      return (
                        <WorkloadReplicasForm
                          ref={formRef}
                          defaultValue={replicas}
                          record={record as WorkloadModel}
                          label={t('dovetail.pod_replicas_num')}
                        />
                      );
                    }
                  }}
                />
              )
            }
          </span>
        </div>
      </div>
    </span >
  );
}
