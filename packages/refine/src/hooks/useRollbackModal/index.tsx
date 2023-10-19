import { ModalProps, useUIKit } from '@cloudtower/eagle';
import { BaseKey, useList, useOne, useUpdate } from '@refinedev/core';
import yaml from 'js-yaml';
import { ReplicaSet } from 'kubernetes-types/apps/v1';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Time from 'src/components/Time';
import MonacoYamlDiffEditor from 'src/components/YamlEditor/MonacoYamlDiffEditor';
import { WorkloadModel, WorkloadTypes } from 'src/model';
import { WithId } from 'src/types';
import { getCommonErrors } from 'src/utils/error';
import useEagleForm from '../useEagleForm';

const RollbackForm: React.FC<{ resource: string; id: BaseKey }> = ({ resource, id }) => {
  const { form, formProps, errorResponseBody, mutationResult } = useEagleForm();
  const kit = useUIKit();
  const { t, i18n } = useTranslation();
  const responseErrors = errorResponseBody
    ? getCommonErrors(errorResponseBody, i18n)
    : [];

  const { data } = useOne({
    resource,
    id,
  });
  const workload = data?.data && new WorkloadModel(data.data as WithId<WorkloadTypes>);
  const { data: replicaSetsData } = useList({
    resource: 'replicasets',
    meta: {
      resourceBasePath: '/apis/apps/v1',
      kind: 'ReplicaSets',
    },
  });
  const revisions = ((replicaSetsData?.data || []) as ReplicaSet[])
    .filter(r => {
      const { kind, apiVersion, metadata } = workload || {};
      const { ownerReferences = [], namespace } = r.metadata || {};
      return ownerReferences.some(
        ref =>
          ref.apiVersion === apiVersion &&
          ref.kind === kind &&
          namespace === metadata?.namespace &&
          ref.name === metadata?.name
      );
    })
    .sort(
      (a, b) =>
        new Date(b.metadata?.creationTimestamp || '').getTime() -
        new Date(a.metadata?.creationTimestamp || '').getTime()
    );
  const [_revisionId, setRevisionId] = useState('');
  console.log(replicaSetsData?.data, revisions);
  const revisionId = _revisionId || revisions[0]?.metadata?.name;

  return (
    <kit.form {...formProps} layout="horizontal" form={form}>
      <kit.form.Item>
        <kit.select
          style={{ marginBottom: 16 }}
          input={{
            value: revisionId,
            onChange: newValue => setRevisionId(newValue as string),
          }}
        >
          {revisions.map((revision, index) => (
            <kit.option
              disabled={index === 0}
              key={String(index)}
              value={revision.metadata?.name || ''}
            >
              版本 {revisions.length - index}
              {index === 0 ? '（当前版本）' : ''}，创建于{' '}
              <Time date={new Date(revision.metadata?.creationTimestamp || '')} />
            </kit.option>
          ))}
        </kit.select>
      </kit.form.Item>
      {revisionId !== revisions[0]?.metadata?.name && (
        <kit.form.Item>
          <MonacoYamlDiffEditor
            id={id as string}
            origin={yaml.dump(revisions[0])}
            modified={yaml.dump(revisions.find(r => r.metadata?.name === revisionId))}
          />
        </kit.form.Item>
      )}
      <kit.form.Item>
        {mutationResult.error && (
          <kit.alert
            message={
              errorResponseBody ? (
                <ul>
                  {responseErrors.map((error, index) => (
                    <li key={error}>
                      {responseErrors.length > 1 ? index + 1 + '. ' : ''}
                      {error}
                    </li>
                  ))}
                </ul>
              ) : (
                mutationResult.error.message
              )
            }
            type="error"
            style={{ marginTop: 16 }}
          />
        )}
      </kit.form.Item>
    </kit.form>
  );
};

export const useRollbackModal = (resource: string) => {
  const { mutate } = useUpdate();
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState<BaseKey>('');
  const { t } = useTranslation();

  const modalProps: ModalProps = {
    title: t('dovetail.rollback'),
    okText: t('dovetail.rollback'),
    okButtonProps: {},
    cancelText: t('cancel'),
    children: <RollbackForm resource={resource} id={id} />,
    onOk() {
      mutate({
        resource,
        id,
        values: {},
      });
      setVisible(false);
    },
    onCancel() {
      setVisible(false);
    },
    width: 800,
  };

  function openModal(id: BaseKey) {
    setId(id);
    setVisible(true);
  }
  return { modalProps, visible, openModal };
};
