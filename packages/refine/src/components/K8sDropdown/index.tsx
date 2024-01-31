import { Icon, useUIKit, pushModal } from '@cloudtower/eagle';
import {
  EditPen16PrimaryIcon,
  MoreEllipsis316BoldBlueIcon,
  TrashBinDelete16Icon,
  Download16GradientBlueIcon,
} from '@cloudtower/icons-react';
import { useResource } from '@refinedev/core';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import FormModal from 'src/components/FormModal';
import { ModalContext } from 'src/components/ModalContextProvider';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { useDownloadYAML } from 'src/hooks/useDownloadYAML';
import { useEdit } from 'src/hooks/useEdit';
import { FormType } from 'src/types';
import { useGlobalStore } from '../../hooks';
import { ResourceModel } from '../../models';


interface K8sDropdownProps {
  record: ResourceModel;
  formType?: FormType;
}

function K8sDropdown(props: React.PropsWithChildren<K8sDropdownProps>) {
  const { record, formType } = props;
  const kit = useUIKit();
  const { globalStore } = useGlobalStore();
  const useResourceResult = useResource();
  const resource = useResourceResult.resource;
  const { edit } = useEdit();
  const { modalProps, visible, openDeleteConfirmModal } = useDeleteModal(
    resource?.name || ''
  );
  const download = useDownloadYAML();
  const modal = useContext(ModalContext);
  const { t } = useTranslation();

  return (
    <>
      <kit.dropdown
        overlay={
          <kit.menu>
            <kit.menuItem
              onClick={() => {
                if (record.id && resource?.name) {
                  if (formType === FormType.MODAL) {
                    modal.open({
                      resource: resource.name,
                      id: record.id,
                    });
                    pushModal({
                      // @ts-ignore
                      component: FormModal,
                      props: {
                        resource: resource.name,
                        id: record.id,
                      }
                    });
                  } else {
                    edit(record.id);
                  }
                }
              }}
            >
              <Icon src={EditPen16PrimaryIcon}>{t('dovetail.edit')}</Icon>
            </kit.menuItem>
            <kit.menuItem
              danger={true}
              onClick={() => {
                openDeleteConfirmModal(record.id);
              }}
            >
              <Icon src={TrashBinDelete16Icon}>{t('dovetail.delete')}</Icon>
            </kit.menuItem>
            <kit.menu.Item
              onClick={() => {
                if (record.id) {
                  download({
                    name: record.metadata?.name || record.kind || '',
                    item: globalStore?.restoreItem(record) || record,
                  });
                }
              }}
            >
              <Icon src={Download16GradientBlueIcon}>{t('dovetail.download_yaml')}</Icon>
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
