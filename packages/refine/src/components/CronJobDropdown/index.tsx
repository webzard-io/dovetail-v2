import { Icon, useUIKit } from '@cloudtower/eagle';
import {
  SuspendedPause16GradientGrayIcon,
  VmResume16Icon,
} from '@cloudtower/icons-react';
import { useResource, useUpdate } from '@refinedev/core';
import { CronJob } from 'kubernetes-types/batch/v1';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormType } from 'src/types';
import { CronJobModel } from '../../models';
import { pruneBeforeEdit } from '../../utils/k8s';
import K8sDropdown from '../K8sDropdown';

type Props<Model extends CronJobModel> = {
  record: Model;
  formType?: FormType;
};

export function CronJobDropdown<Model extends CronJobModel>(props: Props<Model>) {
  const { record, formType } = props;
  const { spec } = record as CronJob;
  const kit = useUIKit();
  const { resource } = useResource();
  const { mutate } = useUpdate();
  const { t } = useTranslation();

  const suspended = Boolean(spec?.suspend);

  return (
    <K8sDropdown record={record} formType={formType}>
      <kit.menu.Item
        onClick={() => {
          const v = suspended ? record.resume() : record.suspend();
          const id = record.id;
          pruneBeforeEdit(v);
          mutate({
            id,
            resource: resource?.name || '',
            values: v,
          });
        }}
      >
        <Icon src={suspended ? VmResume16Icon : SuspendedPause16GradientGrayIcon}>
          {t(suspended ? 'dovetail.resume' : 'dovetail.suspend')}
        </Icon>
      </kit.menu.Item>
    </K8sDropdown>
  );
}
