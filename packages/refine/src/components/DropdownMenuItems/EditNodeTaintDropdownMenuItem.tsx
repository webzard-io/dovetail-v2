import { Icon, Menu, usePushModal } from '@cloudtower/eagle';
import { EditPen16BlueIcon } from '@cloudtower/icons-react';
import { MenuItemProps } from 'antd/lib/menu/MenuItem';
import { Unstructured } from 'k8s-api-provider';
import { Node } from 'kubernetes-types/core/v1';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ResourceModel } from '../../models';
import { EditFieldModal } from '../EditField';
import { EditNodeTaintForm } from '../EditMetadataForm/EditNodeTaintForm';

type EditMenuItemProps = {
  formRef: React.MutableRefObject<{
    submit: () => Promise<unknown> | undefined;
  } | null>;
  resourceModel: ResourceModel<Unstructured & Node>;
} & MenuItemProps;

export function EditNodeTaintDropdownMenuItem(props: EditMenuItemProps) {
  const { formRef, resourceModel } = props;
  const { t } = useTranslation();
  const pushModal = usePushModal();
  return (
    <Menu.Item
      {...props}
      className="ant-dropdown-menu-item"
      onClick={e => {
        const modalProps = {
          formRef,
          title: t('dovetail.edit_node_taint'),
          fullscreen: true,
          renderContent() {
            return <EditNodeTaintForm ref={formRef} nodeModel={resourceModel} />;
          },
        };

        pushModal<'EditFieldModal'>({
          component: EditFieldModal,
          props: modalProps,
        });

        props.onClick?.(e);
      }}
    >
      <Icon src={EditPen16BlueIcon}>{t('dovetail.edit_node_taint')}</Icon>
    </Menu.Item>
  );
}
