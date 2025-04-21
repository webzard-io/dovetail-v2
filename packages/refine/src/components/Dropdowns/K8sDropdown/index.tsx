import { Icon, Divider, Dropdown, Menu, Modal, Button } from '@cloudtower/eagle';
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
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessControlAuth } from 'src/constants/auth';
import ConfigsContext from 'src/contexts/configs';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { useDownloadYAML } from 'src/hooks/useDownloadYAML';
import { useFailedModal } from 'src/hooks/useFailedModal';
import { useOpenForm } from 'src/hooks/useOpenForm';
import { FormType } from 'src/types';
import { getCommonErrors } from 'src/utils/error';
import { useGlobalStore } from '../../../hooks';
import { ResourceModel } from '../../../models';
export type DropdownSize = 'normal' | 'large';

interface K8sDropdownProps {
  record: ResourceModel;
  size?: DropdownSize;
}

export function K8sDropdown(props: React.PropsWithChildren<K8sDropdownProps>) {
  const { record, size = 'normal' } = props;
  const globalStore = useGlobalStore();
  const useResourceResult = useResource();
  const resource = useResourceResult.resource;
  const configs = useContext(ConfigsContext);
  const config = configs[resource?.name || ''];
  const { t, i18n } = useTranslation();
  const { modalProps: failedModalProps, visible: failedModalVisible, openFailedModal } = useFailedModal(resource?.name || '');
  const { modalProps: deleteModalProps, visible: deleteModalVisible, openDeleteConfirmModal, setVisible: setDeleteModalVisible } = useDeleteModal(
    resource?.name || '',
    {
      deleteTip: config.deleteTip,
      onError: async (error) => {
        console.log(error);
        setDeleteModalVisible(false);
        openFailedModal(record.id, getCommonErrors(await error.response.json(), i18n));
      }
    }
  );
  const download = useDownloadYAML();
  const openForm = useOpenForm({ id: record.id });
  const isInShowPage = useResourceResult.action === 'show';
  const { data: canEditData } = useCan({
    resource: resource?.name,
    action: AccessControlAuth.Edit,
  });
  const { data: canDeleteData } = useCan({
    resource: resource?.name,
    action: AccessControlAuth.Delete,
  });
  const formType = config.formConfig?.formType || FormType.FORM;

  return (
    <>
      <Dropdown
        overlay={
          <Menu>
            {isInShowPage || canEditData?.can === false || config.hideEdit ? null : (
              <Menu.Item onClick={openForm}>
                <Icon src={EditPen16PrimaryIcon}>{formType === FormType.FORM ? t('dovetail.edit') : t('dovetail.edit_yaml')}</Icon>
              </Menu.Item>
            )}
            <Menu.Item
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
            </Menu.Item>
            {props.children}
            {canDeleteData?.can !== false ? <Divider style={{ margin: 0 }} /> : null}
            {canDeleteData?.can !== false ? (
              <Menu.Item
                danger={true}
                onClick={() => {
                  openDeleteConfirmModal(record.id);
                }}
              >
                <Icon src={TrashBinDelete16Icon}>{t('dovetail.delete')}</Icon>
              </Menu.Item>
            ) : null}
          </Menu>
        }
        trigger={['click']}
      >
        <Button
          type="quiet"
          size={size === 'large' ? 'middle' : 'small'}
          prefixIcon={
            size === 'large' ? (
              <Icon
                src={MoreEllipsis324BoldSecondaryIcon}
                hoverSrc={MoreEllipsis324BoldBlueIcon}
                iconWidth={24}
                iconHeight={24}
              />
            ) : (
              <Icon src={MoreEllipsis316BoldBlueIcon} />
            )
          }
        ></Button>
      </Dropdown>
      {deleteModalVisible ? <Modal {...deleteModalProps} /> : null}
      {failedModalVisible ? <Modal {...failedModalProps} /> : null}
    </>
  );
}

export default K8sDropdown;
