import { Icon, useUIKit } from '@cloudtower/eagle';
import {
  EditPen16PrimaryIcon,
  MoreEllipsis324BoldSecondaryIcon,
  MoreEllipsis316BoldBlueIcon,
  MoreEllipsis324BoldBlueIcon,
  TrashBinDelete16Icon,
  Download16GradientBlueIcon,
} from '@cloudtower/icons-react';
import { useResource, useCan } from '@refinedev/core';
import { omit } from 'lodash-es';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AccessControlAuth } from 'src/constants/auth';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { useDownloadYAML } from 'src/hooks/useDownloadYAML';
import { useOpenForm } from 'src/hooks/useOpenForm';
import { useGlobalStore } from '../../hooks';
import { ResourceModel } from '../../models';

export type DropdownSize = 'normal' | 'large';

interface K8sDropdownProps {
  record: ResourceModel;
  size?: DropdownSize;
}

function K8sDropdown(props: React.PropsWithChildren<K8sDropdownProps>) {
  const { record, size = 'normal' } = props;
  const kit = useUIKit();
  const { globalStore } = useGlobalStore();
  const useResourceResult = useResource();
  const resource = useResourceResult.resource;
  const { modalProps, visible, openDeleteConfirmModal } = useDeleteModal(
    resource?.name || ''
  );
  const download = useDownloadYAML();
  const { t } = useTranslation();
  const openForm = useOpenForm({ id: record.id });
  const isInShowPage = useResourceResult.action === 'show';
  const { data: canEditData } = useCan({
    resource: resource?.name,
    action: AccessControlAuth.Edit
  });
  const { data: canDeleteData } = useCan({
    resource: resource?.name,
    action: AccessControlAuth.Delete
  });

  return (
    <>
      <kit.dropdown
        overlay={
          <kit.menu>
            {
              isInShowPage || canEditData?.can === false ? null : (
                <kit.menuItem
                  onClick={openForm}
                >
                  <Icon src={EditPen16PrimaryIcon}>{t('dovetail.edit_yaml')}</Icon>
                </kit.menuItem>
              )
            }
            <kit.menu.Item
              onClick={() => {
                if (record.id) {
                  download({
                    name: record.metadata?.name || record.kind || '',
                    item: omit(globalStore?.restoreItem(record) || record, 'id'),
                  });
                }
              }}
            >
              <Icon src={Download16GradientBlueIcon}>{t('dovetail.download_yaml')}</Icon>
            </kit.menu.Item>
            {props.children}
            {canDeleteData?.can !== false ? <kit.divider style={{ margin: 0 }} /> : null}
            {
              canDeleteData?.can !== false ? (
                <kit.menuItem
                  danger={true}
                  onClick={() => {
                    openDeleteConfirmModal(record.id);
                  }}
                >
                  <Icon src={TrashBinDelete16Icon}>{t('dovetail.delete')}</Icon>
                </kit.menuItem>
              ) : null
            }
          </kit.menu>
        }
        trigger={['click']}
      >
        <kit.button
          type="quiet"
          size={size === 'large' ? 'middle' : 'small'}
          prefixIcon={size === 'large' ? <Icon
            src={MoreEllipsis324BoldSecondaryIcon}
            hoverSrc={MoreEllipsis324BoldBlueIcon}
            iconWidth={24}
            iconHeight={24}
          /> : <Icon src={MoreEllipsis316BoldBlueIcon} />}
        >
        </kit.button>
      </kit.dropdown>
      {visible ? <kit.modal {...modalProps} /> : null}
    </>
  );
}

export default K8sDropdown;
