import { Icon, Menu, usePushModal } from '@cloudtower/eagle';
import { EditPen16BlueIcon } from '@cloudtower/icons-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ResourceModel } from '../../models';
import { EditFieldModal } from '../EditField';
import { EditLabelForm } from '../EditMetadataForm/EditLabelForm';

type EditMenuItemProps<Model extends ResourceModel> = {
  formRef: React.MutableRefObject<{
    submit: () => Promise<unknown> | undefined;
  } | null>;
  resourceModel: Model;
};

export function EditLabelDropdownMenuItem<Model extends ResourceModel>(
  props: EditMenuItemProps<Model>
) {
  const { formRef, resourceModel } = props;
  const { t } = useTranslation();
  const pushModal = usePushModal();
  return (
    <Menu.Item
      className="ant-dropdown-menu-item"
      onClick={() => {
        const modalProps = {
          formRef,
          title: t('dovetail.edit_label'),
          fullscreen: true,
          renderContent() {
            return (
              <EditLabelForm
                ref={formRef}
                resourceModel={resourceModel}
              />
            );
          },
        };

        pushModal<'EditFieldModal'>({
          component: EditFieldModal,
          props: modalProps,
        });
      }}
    >
      <Icon src={EditPen16BlueIcon}>{t('dovetail.edit_label')}</Icon>
    </Menu.Item>
  );
}
