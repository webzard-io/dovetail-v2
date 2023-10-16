import { Icon, useUIKit } from '@cloudtower/eagle';
import { DynamicResourceSchedule16BlueIcon } from '@cloudtower/icons-react';
import { useResource, useUpdate } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { WorkloadModel } from '../../model';
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
          const v = data.redeploy();
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
