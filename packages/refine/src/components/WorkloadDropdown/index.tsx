import { Icon, useUIKit, message } from '@cloudtower/eagle';
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
};

export function WorkloadDropdown<Model extends WorkloadModel>(props: React.PropsWithChildren<Props<Model>>) {
  const { record, size, children } = props;
  const kit = useUIKit();
  const { resource } = useResource();
  const { mutateAsync } = useUpdate();
  const { t } = useTranslation();

  return (
    <K8sDropdown record={record} size={size}>
      <kit.menu.Item
        onClick={async () => {
          const v = record.redeploy();
          const id = v.id;
          pruneBeforeEdit(v);
          try {
            await mutateAsync({
              id,
              resource: resource?.name || '',
              values: v,
              successNotification: false,
              errorNotification: false
            });

            message.success(t('dovetail.redeploy_success_toast', {
              kind: record.kind,
              name: record.id,
              interpolation: {
                escapeValue: false,
              }
            }), 4.5);
          } catch {
            message.error(t('dovetail.redeploy_failed_toast', {
              kind: record.kind,
              name: record.id,
              interpolation: {
                escapeValue: false,
              }
            }), 4.5);
          }
        }}
      >
        <Icon src={Retry16GradientBlueIcon}>{t('dovetail.redeploy')}</Icon>
      </kit.menu.Item>
      {children}
    </K8sDropdown>
  );
}
