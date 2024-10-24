import { Icon, Menu, usePushModal } from '@cloudtower/eagle';
import { EditPen16BlueIcon } from '@cloudtower/icons-react';
import { MenuItemProps } from 'antd/lib/menu/MenuItem';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ResourceModel } from '../../models';
import { EditFieldModal } from '../EditField';
import { EditAnnotationForm } from '../EditMetadataForm/EditAnnotationForm';

type EditMenuItemProps<Model extends ResourceModel> = {
  formRef: React.MutableRefObject<{
    submit: () => Promise<unknown> | undefined;
  } | null>;
  resourceModel: Model;
} & MenuItemProps;

export function EditAnnotationDropdownMenuItem<Model extends ResourceModel>(
  props: EditMenuItemProps<Model>
) {
  const { formRef, resourceModel } = props;
  const { t } = useTranslation();
  const pushModal = usePushModal();
  return (
    <Menu.Item
      {...props}
      className="ant-dropdown-menu-item"
      onClick={(e) => {
        const modalProps = {
          formRef,
          title: t('dovetail.edit_annotation'),
          fullscreen: true,
          renderContent() {
            return <EditAnnotationForm ref={formRef} resourceModel={resourceModel} />;
          },
        };

        pushModal<'EditFieldModal'>({
          component: EditFieldModal,
          props: modalProps,
        });

        props.onClick?.(e);
      }}
    >
      <Icon src={EditPen16BlueIcon}>{t('dovetail.edit_annotation')}</Icon>
    </Menu.Item>
  );
}
