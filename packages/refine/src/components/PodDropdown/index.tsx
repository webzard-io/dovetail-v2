import { Icon, Menu, usePushModal } from '@cloudtower/eagle';
import { OpenTerminal16GradientBlueIcon } from '@cloudtower/icons-react';
import { useResource, useCan } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PodShellModal } from 'src/components/PodShellModal';
import { AccessControlAuth } from 'src/constants/auth';
import { PodModel } from '../../models';
import K8sDropdown, { DropdownSize } from '../K8sDropdown';

type Props<Model extends PodModel> = {
  record: Model;
  size?: DropdownSize;
};

export function PodDropdown<Model extends PodModel>(props: React.PropsWithChildren<Props<Model>>) {
  const { record, size, children } = props;
  const { resource } = useResource();
  const { t } = useTranslation();
  const pushModal = usePushModal();
  const { data: canEditData } = useCan({
    resource: resource?.name,
    action: AccessControlAuth.Edit
  });

  return (
    <K8sDropdown record={record} size={size}>
      {
        canEditData?.can !== false ? (
          <Menu.Item
            onClick={() => {
              pushModal<'PodShellModal'>({
                component: PodShellModal,
                props: {
                  pod: record
                }
              });
            }}
          >
            <Icon src={OpenTerminal16GradientBlueIcon}>{t('dovetail.exec_pod')}</Icon>
          </Menu.Item>

        ) : null
      }
      {children}
    </K8sDropdown>
  );
}
