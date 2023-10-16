import { Icon, useUIKit } from '@cloudtower/eagle';
import {
  EditPen16PrimaryIcon,
  MoreEllipsis316BoldBlueIcon,
  TrashBinDelete16Icon,
  Download16GradientBlueIcon,
} from '@cloudtower/icons-react';
import { useResource } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { useDownloadYAML } from 'src/hooks/useDownloadYAML';
import { useEdit } from 'src/hooks/useEdit';
import { ResourceModel } from '../../model';

interface K8sDropdownProps {
  data: ResourceModel;
}

function K8sDropdown(props: React.PropsWithChildren<K8sDropdownProps>) {
  const { data } = props;
  const kit = useUIKit();
  const useResourceResult = useResource();
  const resource = useResourceResult.resource;
  const { edit } = useEdit();
  const { modalProps, visible, openDeleteConfirmModal } = useDeleteModal(
    resource?.name || ''
  );
  const download = useDownloadYAML();
  const { t } = useTranslation();

  return (
    <>
      <kit.dropdown
        overlay={
          <kit.menu>
            <kit.menuItem
              onClick={() => {
                if (data.id) {
                  edit(data.id);
                }
              }}
            >
              <Icon src={EditPen16PrimaryIcon}>{t('edit')}</Icon>
            </kit.menuItem>
            <kit.menuItem
              danger={true}
              onClick={() => {
                openDeleteConfirmModal(data.id);
              }}
            >
              <Icon src={TrashBinDelete16Icon}>{t('delete')}</Icon>
            </kit.menuItem>
            <kit.menu.Item
              onClick={() => {
                if (data.id) {
                  download({
                    name: data.metadata?.name || data.kind || '',
                    item: data,
                  });
                }
              }}
            >
              <Icon src={Download16GradientBlueIcon}>{t('download_yaml')}</Icon>
            </kit.menu.Item>
            {props.children}
          </kit.menu>
        }
      >
        <kit.button type="tertiary" size="small">
          <Icon src={MoreEllipsis316BoldBlueIcon} />
        </kit.button>
      </kit.dropdown>
      {visible ? <kit.modal {...modalProps} /> : null}
    </>
  );
}

export default K8sDropdown;
