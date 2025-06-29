import { Icon, Menu } from '@cloudtower/eagle';
import { Retry16GradientBlueIcon } from '@cloudtower/icons-react';
import { useResource, useUpdate, useCan } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AccessControlAuth } from 'src/constants/auth';
import { WorkloadModel } from '../../../models';
import { pruneBeforeEdit } from '../../../utils/k8s';
import K8sDropdown, { DropdownSize } from '../K8sDropdown';

type Props<Model extends WorkloadModel> = {
  record: Model;
  size?: DropdownSize;
};

export function WorkloadDropdown<Model extends WorkloadModel>(props: React.PropsWithChildren<Props<Model>>) {
  const { record, size, children } = props;
  const { resource } = useResource();
  const { mutateAsync } = useUpdate();
  const { t } = useTranslation();
  const { data: canEditData } = useCan({
    resource: resource?.name,
    action: AccessControlAuth.Edit,
    params: {
      namespace: record.namespace,
    },
  });

  return (
    <K8sDropdown record={record} size={size}>
      {
        canEditData?.can !== false ? (
          <Menu.Item
            onClick={async () => {
              const v = record.redeploy();
              const id = v.id;
              pruneBeforeEdit(v);
              await mutateAsync({
                id,
                resource: resource?.name || '',
                values: v,
                successNotification() {
                  return {
                    message: t('dovetail.redeploy_success_toast', {
                      kind: record.kind,
                      name: record.id,
                      interpolation: {
                        escapeValue: false,
                      }
                    }),
                    type: 'success'
                  };
                },
                errorNotification() {
                  return {
                    message: t('dovetail.redeploy_failed_toast', {
                      kind: record.kind,
                      name: record.id,
                      interpolation: {
                        escapeValue: false,
                      }
                    }),
                    type: 'error'
                  };
                }
              });
            }}
          >
            <Icon src={Retry16GradientBlueIcon}>{t('dovetail.redeploy')}</Icon>
          </Menu.Item>

        ) : null
      }
      {children}
    </K8sDropdown>
  );
}
