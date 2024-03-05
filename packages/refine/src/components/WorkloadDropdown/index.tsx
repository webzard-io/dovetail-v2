import { Icon, useUIKit } from '@cloudtower/eagle';
import { Retry16GradientBlueIcon } from '@cloudtower/icons-react';
import { useResource, useUpdate } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { WorkloadModel } from '../../models';
import { pruneBeforeEdit } from '../../utils/k8s';
import K8sDropdown, { DropdownSize } from '../K8sDropdown';

type Props<Model extends WorkloadModel> = {
  record: Model;
  size?: DropdownSize;
  hideEdit?: boolean;
};

export function WorkloadDropdown<Model extends WorkloadModel>(props: Props<Model>) {
  const { record, size, hideEdit } = props;
  const kit = useUIKit();
  const { resource } = useResource();
  const { mutate } = useUpdate();
  const { t } = useTranslation();

  return (
    <K8sDropdown record={record} size={size} hideEdit={hideEdit}>
      <kit.menu.Item
        onClick={() => {
          const v = record.redeploy();
          const id = v.id;
          pruneBeforeEdit(v);
          mutate({
            id,
            resource: resource?.name || '',
            values: v,
          });
        }}
      >
        <Icon src={Retry16GradientBlueIcon}>{t('dovetail.redeploy')}</Icon>
      </kit.menu.Item>
    </K8sDropdown>
  );
}
