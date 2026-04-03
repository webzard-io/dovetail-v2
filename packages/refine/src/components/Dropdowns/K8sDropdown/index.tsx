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
import { useCan, useParsed, useResource } from '@refinedev/core';
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
  /** 隐藏「编辑」按钮 */
  hideEdit?: boolean;
  /** 隐藏「编辑 YAML」按钮 */
  hideEditYaml?: boolean;
  /** 隐藏「下载 YAML」按钮 */
  hideDownloadYaml?: boolean;
}

export function K8sDropdown(props: React.PropsWithChildren<K8sDropdownProps>) {
  const {
    record,
    size = 'normal',
    resourceConfig,
    customButton,
    deleteDialogProps,
    hideEdit: hideEditProp,
    hideEditYaml,
    hideDownloadYaml,
  } = props;
  const globalStore = useGlobalStore();
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

  // 在详情页（show page）中，ShowContentView 已经渲染了独立的编辑按钮，
  // 因此 Dropdown 中的编辑项需要根据情况隐藏以避免重复。
  // 通过比较 Dropdown 操作的资源与当前页面资源，确保只在操作同一资源时隐藏，
  // 这样 AccessMethodForm 等子资源表格中的 Dropdown 不会受影响。
  const { action } = useParsed();
  const { resource } = useResource();
  const isInShowPage = action === 'show';
  const isSameResource = resourceName === resource?.name;
  const isShowPageSameResource = isInShowPage && isSameResource;

  // Item 1（"编辑{Kind}" 或 "编辑 YAML"）：详情页且同资源时隐藏，因为与独立按钮完全重复
  const shouldHideEdit = hideEditProp || isShowPageSameResource;
  // Item 2（"编辑 YAML"）：当 formType 不是 FORM 时隐藏，
  // 因为此时 Item 1 已经是"编辑 YAML"，两者文案和功能完全重复。
  // 当 formType 是 FORM 时保留，因为它提供了与 Item 1（"编辑{Kind}"）不同的操作。
  const shouldHideEditYaml = hideEditYaml || formType !== FormType.FORM;

  return (
    <>
      <Dropdown
        overlay={
          <Menu>
            {shouldHideEdit || canEditData?.can === false || config?.hideEdit ? null : (
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
            {shouldHideEditYaml ||
            canEditData?.can === false ||
            config?.hideEdit ? null : (
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
            {hideDownloadYaml ? null : (
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
                <Icon src={Download16GradientBlueIcon}>
                  {t('dovetail.download_yaml')}
                </Icon>
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
