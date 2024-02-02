import { CloseCircleFilled } from '@ant-design/icons';
import { useUIKit, popModal } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useResource } from '@refinedev/core';
import React, { useContext, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import YamlForm, { YamlFormProps, YamlFormHandler } from 'src/components/YamlForm';
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
  renderForm?: (props: YamlFormProps & { ref: React.MutableRefObject<YamlFormHandler | null> }) => React.ReactNode;
};

export function FormModal(props: FormModalProps) {
  const { resource: resourceFromProps, id, formProps, renderForm } = props;
  const { i18n } = useTranslation();
  const { resource } = useResource();
  const formRef = useRef<YamlFormHandler | null>(null);
  const configs = useContext(ConfigsContext);
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
    formRef.current?.saveButtonProps.onClick();
  }, []);
  const onFinish = useCallback(() => {
    popModal();
  }, []);

  return (
    <kit.modal
      className={FullscreenModalStyle}
      width="calc(100vw - 16px)"
      title={title}
      okButtonProps={formRef.current?.saveButtonProps}
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
          ref: formRef,
          onFinish
        }) : (
          <YamlForm
            {...formProps}
            initialValues={formProps?.initialValues || config?.initValue}
            ref={formRef}
            id={id}
            isShowLayout={false}
            onFinish={onFinish}
          />
        )
      }
    </kit.modal>
  );
}

export default FormModal;
