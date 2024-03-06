import { Icon, useUIKit } from '@cloudtower/eagle';
import {
  Pause16GradientBlueIcon,
  RecoverContinue16GradientBlueIcon,
} from '@cloudtower/icons-react';
import { useResource, useUpdate } from '@refinedev/core';
import { CronJob } from 'kubernetes-types/batch/v1';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CronJobModel } from '../../models';
import { pruneBeforeEdit } from '../../utils/k8s';
import K8sDropdown, { DropdownSize } from '../K8sDropdown';

type Props<Model extends CronJobModel> = {
  record: Model;
  size?: DropdownSize;
};

export function CronJobDropdown<Model extends CronJobModel>(props: Props<Model>) {
  const { record, size } = props;
  const { spec } = record as CronJob;
  const kit = useUIKit();
  const { resource } = useResource();
  const { mutate } = useUpdate();
  const { t } = useTranslation();

  const suspended = Boolean(spec?.suspend);

  return (
    <K8sDropdown record={record} size={size}>
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
        <Icon src={suspended ? RecoverContinue16GradientBlueIcon : Pause16GradientBlueIcon}>
          {t(suspended ? 'dovetail.resume' : 'dovetail.suspend')}
        </Icon>
      </kit.menu.Item>
    </K8sDropdown>
  );
}
