import {
  Icon,
  Divider,
  Dropdown,
  Menu,
  Button,
  DeleteDialogProps,
} from '@cloudtower/eagle';
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
import { FormType, ResourceConfig } from 'src/types';
import { getResourceNameByKind } from 'src/utils';
import { transformResourceKindInSentence } from 'src/utils/string';
import { useGlobalStore } from '../../../hooks';
import { ResourceModel } from '../../../models';
export type DropdownSize = 'normal' | 'large';

interface K8sDropdownProps {
  record: ResourceModel;
  size?: DropdownSize;
  customButton?: React.ReactNode;
  resourceName?: string;
  config?: Pick<
    ResourceConfig,
    | 'name'
    | 'displayName'
    | 'kind'
    | 'initValue'
    | 'apiVersion'
    | 'basePath'
    | 'formConfig'
    | 'hideEdit'
  >;
  displayName?: string;
  deleteDialogProps?: Partial<DeleteDialogProps>;
  hideEdit?: boolean;
}

export function K8sDropdown(props: React.PropsWithChildren<K8sDropdownProps>) {
  const {
    record,
    size = 'normal',
    resourceName: resourceNameFromProps,
    config: configFromProps,
    customButton,
    deleteDialogProps,
    displayName,
    hideEdit,
  } = props;
  const globalStore = useGlobalStore();
  const useResourceResult = useResource();
  const configs = useContext(ConfigsContext);
  const resourceName =
    resourceNameFromProps || getResourceNameByKind(record.kind || '', configs);
  const config = configFromProps || configs[resourceName || ''];
  const { t, i18n } = useTranslation();
  const { openDeleteConfirmModal } = useDeleteModal({
    resourceName: resourceName || '',
    deleteDialogProps,
    displayName,
    meta: record.apiVersion
      ? {
          kind: record.kind || '',
          resourceBasePath:
            // k8s 通用规则，apiVersion 包含 / 则使用 apis，否则使用 api
            (record.apiVersion?.includes('/') ? 'apis' : 'api') + `/${record.apiVersion}`,
        }
      : undefined,
  });
  const download = useDownloadYAML();
  const openForm = useOpenForm();
  const isInShowPage =
    useResourceResult.action === 'show' &&
    useResourceResult.resource?.name === resourceName;
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
  const formType = config?.formConfig?.formType;

  return (
    <>
      <Dropdown
        overlay={
          <Menu>
            {isInShowPage ||
            canEditData?.can === false ||
            hideEdit ||
            config?.hideEdit ? null : (
              <Menu.Item
                onClick={() => openForm({ id: record.id, resourceName, config })}
              >
                <Icon src={EditPen16PrimaryIcon}>
                  {formType === FormType.FORM
                    ? `${t('dovetail.edit')}${transformResourceKindInSentence(
                        displayName || config?.displayName || record.kind || '',
                        i18n.language
                      )}`
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
        {customButton || (
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
        )}
      </Dropdown>
    </>
  );
}

export default K8sDropdown;
