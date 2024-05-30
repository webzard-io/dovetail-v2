import { Icon, Menu, usePushModal } from '@cloudtower/eagle';
import { EditPen16PrimaryIcon } from '@cloudtower/icons-react';
import { useResource, useCan } from '@refinedev/core';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { EditFieldModal } from 'src/components/EditField';
import { WorkloadReplicasForm } from 'src/components/WorkloadReplicas';
import { AccessControlAuth } from 'src/constants/auth';
import { WorkloadModel } from '../../models';
import { DropdownSize } from '../K8sDropdown';
import { WorkloadDropdown } from '../WorkloadDropdown';

type Props<Model extends WorkloadModel> = {
  record: Model;
  size?: DropdownSize;
};

export function ReplicasDropdown<Model extends WorkloadModel>(props: React.PropsWithChildren<Props<Model>>) {
  const { record, size, children } = props;
  const { t } = useTranslation();
  const pushModal = usePushModal();
  const formRef = useRef(null);
  const { action, resource } = useResource();
  const isInShowPage = action === 'show';
  const { data: canEditData } = useCan({
    resource: resource?.name,
    action: AccessControlAuth.Edit
  });

  return (
    <WorkloadDropdown record={record} size={size}>
      {
        isInShowPage || canEditData?.can === false ? null : (
          <Menu.Item
            onClick={() => {
              const modalProps = {
                formRef,
                title: t('dovetail.edit_replicas'),
                renderContent() {
                  return (
                    <WorkloadReplicasForm
                      ref={formRef}
                      defaultValue={record.replicas || 0}
                      record={record}
                      label={t('dovetail.pod_replicas_num')}
                    />
                  );
                }
              };

              pushModal<'EditFieldModal'>({
                component: EditFieldModal,
                props: modalProps
              });
            }}
          >
            <Icon src={EditPen16PrimaryIcon}>{t('dovetail.edit_replicas')}</Icon>
          </Menu.Item>
        )
      }
      {children}
    </WorkloadDropdown>
  );
}
