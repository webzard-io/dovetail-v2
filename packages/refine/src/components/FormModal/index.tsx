import { CloseCircleFilled } from '@ant-design/icons';
import { useUIKit, popModal } from '@cloudtower/eagle';
import { css } from '@linaria/core';
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
  resource: string;
  id?: string;
  formProps: YamlFormProps;
  renderForm?: (props: YamlFormProps & { ref: React.MutableRefObject<YamlFormHandler | null> }) => React.ReactNode;
};

function FormModal(props: FormModalProps) {
  const { resource, id, formProps, renderForm } = props;
  const { i18n } = useTranslation();
  const formRef = useRef<YamlFormHandler | null>(null);
  const configs = useContext(ConfigsContext);
  const kit = useUIKit();

  const title = useMemo(() => i18n.t(
    id ? 'dovetail.edit_resource' : 'dovetail.create_resource',
    { resource: configs[resource].kind }
  ), [id, i18n, configs, resource]);

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
        renderForm ? renderForm({ ...formProps, id, ref: formRef, onFinish }) : (
          <YamlForm
            {...formProps}
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
