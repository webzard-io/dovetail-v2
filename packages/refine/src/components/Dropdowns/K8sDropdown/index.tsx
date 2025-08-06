import { Icon, Divider, Dropdown, Menu, Button } from '@cloudtower/eagle';
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
import { useOpenForm } from 'src/hooks/useOpenForm';
import { FormType } from 'src/types';
import { getResourceNameByKind } from 'src/utils';
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
  const configs = useContext(ConfigsContext);
  const resourceName = getResourceNameByKind(record.kind || '', configs);
  const config = configs[resourceName || ''];
  const { t } = useTranslation();
  const { openDeleteConfirmModal } = useDeleteModal({ resourceName: resourceName || '' });
  const download = useDownloadYAML();
  const openForm = useOpenForm();
  const isInShowPage = useResourceResult.action === 'show';
  const { data: canEditData } = useCan({
    resource: resourceName,
    action: AccessControlAuth.Edit,
    params: {
      namespace: record.namespace,
    },
  });
  const { data: canDeleteData } = useCan({
    resource: resourceName,
    action: AccessControlAuth.Delete,
    params: {
      namespace: record.namespace,
    },
  });
  const formType = config.formConfig?.formType || FormType.FORM;

  return (
    <>
      <Dropdown
        overlay={
          <Menu>
            {isInShowPage || canEditData?.can === false || config.hideEdit ? null : (
              <Menu.Item onClick={() => openForm({ id: record.id })}>
                <Icon src={EditPen16PrimaryIcon}>
                  {formType === FormType.FORM
                    ? t('dovetail.edit')
                    : t('dovetail.edit_yaml')}
                </Icon>
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
    </>
  );
}

export default K8sDropdown;
