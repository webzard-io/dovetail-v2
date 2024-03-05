import { Icon, useUIKit, pushModal } from '@cloudtower/eagle';
import { EditPen16PrimaryIcon } from '@cloudtower/icons-react';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { EditFieldModal } from 'src/components/EditField';
import { WorkloadReplicasForm } from 'src/components/WorkloadReplicas';
import { DeploymentModel } from '../../models';
import { DropdownSize } from '../K8sDropdown';
import { WorkloadDropdown } from '../WorkloadDropdown';


type Props<Model extends DeploymentModel> = {
  record: Model;
  size?: DropdownSize;
  hideEdit?: boolean;
};

export function DeploymentDropdown<Model extends DeploymentModel>(props: React.PropsWithChildren<Props<Model>>) {
  const { record, size, hideEdit, children } = props;
  const kit = useUIKit();
  const { t } = useTranslation();
  const formRef = useRef(null);

  return (
    <WorkloadDropdown record={record} size={size} hideEdit={hideEdit}>
      <kit.menu.Item
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

          pushModal({
            component: EditFieldModal,
            props: modalProps
          });
        }}
      >
        <Icon src={EditPen16PrimaryIcon}>{t('dovetail.edit_replicas')}</Icon>
      </kit.menu.Item>
      {children}
    </WorkloadDropdown>
  );
}
