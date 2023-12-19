import { Icon, useUIKit } from '@cloudtower/eagle';
import {
  SuspendedPause16GradientGrayIcon,
  VmResume16Icon,
} from '@cloudtower/icons-react';
import { useResource, useUpdate } from '@refinedev/core';
import { CronJobModel } from 'k8s-api-provider';
import { CronJob } from 'kubernetes-types/batch/v1';
import { useTranslation } from 'react-i18next';
import { pruneBeforeEdit } from '../../utils/k8s';
import K8sDropdown from '../K8sDropdown';

type Props<Model extends CronJobModel> = {
  data: Model;
};

export function CronJobDropdown<Model extends CronJobModel>(props: Props<Model>) {
  const { data } = props;
  const { spec } = data as CronJob;
  const kit = useUIKit();
  const { resource } = useResource();
  const { mutate } = useUpdate();
  const { t } = useTranslation();

  const suspended = Boolean(spec?.suspend);

  return (
    <K8sDropdown data={data}>
      <kit.menu.Item
        onClick={() => {
          const v = suspended ? data.resume() : data.suspend();
          const id = data.id;
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
