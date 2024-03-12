import { Icon, useUIKit, message } from '@cloudtower/eagle';
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
  const { mutateAsync } = useUpdate();
  const { t } = useTranslation();

  const suspended = Boolean(spec?.suspend);

  return (
    <K8sDropdown record={record} size={size}>
      <kit.menu.Item
        onClick={async () => {
          const v = suspended ? record.resume() : record.suspend();
          const id = record.id;

          pruneBeforeEdit(v);
          try {
            await mutateAsync({
              id,
              resource: resource?.name || '',
              values: v,
              successNotification: false,
              errorNotification: false
            });

            message.success(t(suspended ? 'dovetail.resume_success_toast' : 'dovetail.pause_success_toast', {
              kind: record.kind,
              name: id,
              interpolation: {
                escapeValue: false,
              }
            }), 4.5);
          } catch {
            message.error(t(suspended ? 'dovetail.resume_failed_toast' : 'dovetail.pause_failed_toast', {
              kind: record.kind,
              name: id,
              interpolation: {
                escapeValue: false,
              }
            }), 4.5);
          }
        }}
      >
        <Icon src={suspended ? RecoverContinue16GradientBlueIcon : Pause16GradientBlueIcon}>
          {t(suspended ? 'dovetail.resume' : 'dovetail.suspend')}
        </Icon>
      </kit.menu.Item>
    </K8sDropdown>
  );
}
