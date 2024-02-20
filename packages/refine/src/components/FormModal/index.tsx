import { CloseCircleFilled } from '@ant-design/icons';
import { useUIKit, popModal } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useResource } from '@refinedev/core';
import React, { useState, useContext, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import YamlForm, { YamlFormProps } from 'src/components/YamlForm';
import ConfigsContext from 'src/contexts/configs';

const FullscreenModalStyle = css`
  &.ant-modal.fullscreen {
    .ant-modal-header {
      padding: 60px 128px 32px 128px;
    }

    .ant-modal-body {
      padding: 0 128px;
    }

    .ant-modal-footer {
      padding: 15px 128px;
    }
  }
`;

export type FormModalProps = {
  resource?: string;
  id?: string;
  formProps?: YamlFormProps;
  renderForm?: (props: YamlFormProps) => React.ReactNode;
};

export function FormModal(props: FormModalProps) {
  const { resource: resourceFromProps, id, formProps, renderForm } = props;
  const { i18n } = useTranslation();
  const { resource } = useResource();
  const configs = useContext(ConfigsContext);
  const [saveButtonProps, setSaveButtonProps] = useState<{ loading?: boolean; onClick?: ()=> void; }>({});
  const kit = useUIKit();

  const config = useMemo(() => configs[resourceFromProps || resource?.name || ''], [configs, resourceFromProps, resource]);
  const title = useMemo(() => i18n.t(
    id ? 'dovetail.edit_resource' : 'dovetail.create_resource',
    { resource: config?.kind }
  ), [id, i18n, config]);

  const onCancel = useCallback(() => {
    popModal();
  }, []);
  const onOk = useCallback(() => {
    saveButtonProps.onClick?.();
  }, [saveButtonProps]);
  const onFinish = useCallback(() => {
    popModal();
  }, []);

  return (
    <kit.modal
      className={FullscreenModalStyle}
      width="calc(100vw - 16px)"
      title={title}
      okButtonProps={saveButtonProps}
      closeIcon={<CloseCircleFilled />}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
      fullscreen
    >
      {
        renderForm ? renderForm({
          ...formProps,
          initialValues: formProps?.initialValues || config?.initValue,
          id,
          onSaveButtonPropsChange: setSaveButtonProps,
          onFinish
        }) : (
          <YamlForm
            {...formProps}
            initialValues={formProps?.initialValues || config?.initValue}
            id={id}
            isShowLayout={false}
            onSaveButtonPropsChange={setSaveButtonProps}
            onFinish={onFinish}
          />
        )
      }
    </kit.modal>
  );
}

export default FormModal;
