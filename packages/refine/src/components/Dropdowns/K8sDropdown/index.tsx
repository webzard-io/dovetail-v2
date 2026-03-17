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
  resourceConfig?: Pick<
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
  deleteDialogProps?: Partial<DeleteDialogProps>;
  /**
   * 为 true 时跳过基于路由上下文的操作隐藏逻辑，始终显示全部操作按钮（编辑、编辑 YAML、下载 YAML）。
   * 适用于在详情页或表单中嵌套渲染的子资源列表（如 AccessMethodForm 中的 Service/Ingress），
   * 这些场景下子资源需要独立的编辑和下载能力，不应被父资源详情页的隐藏规则影响。
   */
  forceShowAllActions?: boolean;
}

export function K8sDropdown(props: React.PropsWithChildren<K8sDropdownProps>) {
  const {
    record,
    size = 'normal',
    resourceConfig,
    customButton,
    deleteDialogProps,
    forceShowAllActions,
  } = props;
  const globalStore = useGlobalStore();
  const useResourceResult = useResource();
  const configs = useContext(ConfigsContext);
  const resourceName =
    resourceConfig?.name || getResourceNameByKind(record.kind || '', configs);
  const config = resourceConfig || configs[resourceName || ''];
  const { t, i18n } = useTranslation();
  const { openDeleteConfirmModal } = useDeleteModal({
    resourceName: resourceName || '',
    deleteDialogProps,
    displayName: config.displayName,
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
  // 当前是否在详情页
  const isInShowPage = forceShowAllActions ? false : useResourceResult.action === 'show';
  // dropdown 资源是否为当前详情页的附属资源（如 CronJob 详情中的 Job、Job 详情中的 Pod）
  // 附属资源不应单独编辑 YAML 或下载 YAML
  const isChildResource = forceShowAllActions
    ? false
    : isInShowPage && useResourceResult.resource?.name !== resourceName;
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
            {/* 编辑资源按钮：详情页一律隐藏（无论同资源还是附属资源） */}
            {isInShowPage || canEditData?.can === false || config?.hideEdit ? null : (
              <Menu.Item
                onClick={() =>
                  openForm({ id: record.id, resourceName, resourceConfig: config })
                }
              >
                <Icon src={EditPen16PrimaryIcon}>
                  {formType === FormType.FORM
                    ? `${t('dovetail.edit')}${transformResourceKindInSentence(
                        config.displayName || record.kind || '',
                        i18n.language
                      )}`
                    : t('dovetail.edit_yaml')}
                </Icon>
              </Menu.Item>
            )}
            {/* 编辑 YAML 按钮：附属资源时隐藏（同资源时仍展示） */}
            {isChildResource || canEditData?.can === false || config?.hideEdit ? null : (
              <Menu.Item
                onClick={() =>
                  openForm({
                    id: record.id,
                    resourceName,
                    resourceConfig: config,
                    useYamlEditor: true,
                  })
                }
              >
                <Icon src={EditPen16PrimaryIcon}>{t('dovetail.edit_yaml')}</Icon>
              </Menu.Item>
            )}
            {/* 下载 YAML 按钮：附属资源时隐藏（同资源时仍展示） */}
            {isChildResource ? null : (
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
            )}
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
