import { Icon, useUIKit, pushModal } from '@cloudtower/eagle';
import { EditPen16PrimaryIcon } from '@cloudtower/icons-react';
import { useResource } from '@refinedev/core';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { EditFieldModal } from 'src/components/EditField';
import { WorkloadReplicasForm } from 'src/components/WorkloadReplicas';
import { WorkloadModel } from '../../models';
import { DropdownSize } from '../K8sDropdown';
import { WorkloadDropdown } from '../WorkloadDropdown';


type Props<Model extends WorkloadModel> = {
  record: Model;
  size?: DropdownSize;
};

export function ReplicasDropdown<Model extends WorkloadModel>(props: React.PropsWithChildren<Props<Model>>) {
  const { record, size, children } = props;
  const kit = useUIKit();
  const { t } = useTranslation();
  const formRef = useRef(null);
  const { action } = useResource();
  const isInShowPage = action === 'show';

  return (
    <WorkloadDropdown record={record} size={size}>
      {
        isInShowPage ? null : (
          <kit.menu.Item
            onClick={() => {
              const modalProps = {
                formRef,
                title: t('dovetail.edit_replicas'),
                successMsg: t('dovetail.save_replicas_success_toast', {
                  kind: record.kind,
                  name: record.id,
                  interpolation: {
                    escapeValue: false
                  }
                }),
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

              pushModal({
                component: EditFieldModal,
                props: modalProps
              });
            }}
          >
            <Icon src={EditPen16PrimaryIcon}>{t('dovetail.edit_replicas')}</Icon>
          </kit.menu.Item>
        )
      }
      {children}
    </WorkloadDropdown>
  );
}
