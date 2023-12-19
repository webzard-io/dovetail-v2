import { Icon, useUIKit } from '@cloudtower/eagle';
import { DynamicResourceSchedule16BlueIcon } from '@cloudtower/icons-react';
import { useResource, useUpdate } from '@refinedev/core';
import { WorkloadModel } from 'k8s-api-provider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { pruneBeforeEdit } from '../../utils/k8s';
import K8sDropdown from '../K8sDropdown';

type Props<Model extends WorkloadModel> = {
  data: Model;
};

export function WorkloadDropdown<Model extends WorkloadModel>(props: Props<Model>) {
  const { data } = props;
  const kit = useUIKit();
  const { resource } = useResource();
  const { mutate } = useUpdate();
  const { t } = useTranslation();

  return (
    <K8sDropdown data={data}>
      <kit.menu.Item
        onClick={() => {
          // TODO: fix return of redeploy
          const v = data.redeploy() as WorkloadModel;
          const id = v.id;
          pruneBeforeEdit(v);
          mutate({
            id,
            resource: resource?.name || '',
            values: v,
          });
        }}
      >
        <Icon src={DynamicResourceSchedule16BlueIcon}>{t('dovetail.redeploy')}</Icon>
      </kit.menu.Item>
    </K8sDropdown>
  );
}
