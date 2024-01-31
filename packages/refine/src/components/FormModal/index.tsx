import { CloseCircleFilled } from '@ant-design/icons';
import { ModalProps } from '@cloudtower/eagle';
import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { Modal } from 'antd';
import React, { useContext, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalContext } from 'src/components/ModalContextProvider';
import YamlForm, { YamlFormProps, YamlFormHandler } from 'src/components/YamlForm';

// const FullscreenModalStyle = css`
//   height: calc(100vh - 16px);
//   width: calc(100vw - 16px);
//   padding-bottom: 0;
//   margin: 0 auto;

//   .ant-modal-header {
//     padding: 24px 0 16px;
//     border: none;
//     width: 100%;
//     max-width: 1120px;
//     margin: 0 auto;

//     .ant-modal-title {
//       color: $gray-120;
//       font-size: 32px;
//       line-height: 40px;
//       font-weight: 700;
//       margin-left: 21%;
//     }
//   }

//   .ant-modal-content {
//     height: 100%;
//     border-radius: 0;
//     display: flex;
//     flex-direction: column;

//     .ant-modal-body {
//       padding: 4px 0 2px;
//       flex: 1;
//       overflow: auto;
//       margin: 0 21%;
//     }
//   }

//   .ant-modal-footer {
//     border-top: 0;
//     width: 100%;
//     background: $fills-trans-primary-light;
//     padding: 15px 0;

//     .footer-content {
//       display: flex;
//       margin: 0 auto;
//       max-width: 1120px;
//       width: 100%;

//       &:before,
//       &:after {
//         content: '';
//         flex-grow: 0;
//         flex-shrink: 0;
//         flex-basis: 21%;
//       }

//       .middle {
//         display: flex;
//         justify-content: space-between;
//         flex-shrink: 0;
//         flex-basis: 58%;
//         align-items: center;
//         > *:last-child {
//           margin-bottom: 40px;
//         }
//       }
//     }
//   }
// `;

export type FormModalProps = Pick<ModalProps,
  'okText' |
  'cancelText'
> & {
  resource: string;
  id?: string;
  formProps: YamlFormProps;
};

function FormModal(props: FormModalProps) {
  const { resource, id, okText, cancelText, formProps } = props;
  const { i18n } = useTranslation();
  const formRef = useRef<YamlFormHandler | null>(null);
  const modal = useContext(ModalContext);
  const kit = useUIKit();

  const visible = useMemo(() => resource === modal.resource, [resource, modal]);
  const title = useMemo(() => i18n.t(
    modal.id ? 'dovetail.edit_resource' : 'dovetail.create_resource',
    { resource: modal.resource }
  ), [modal, i18n]);

  const onCancel = useCallback(() => {
    modal.close();
  }, [modal]);
  const onOk = useCallback(() => {
    formRef.current?.saveButtonProps.onClick();
  }, []);
  const onFinish = useCallback(() => {
    modal.close();
  }, [modal]);

  return (
    <kit.modal
      width="calc(100vw - 16px)"
      title={title}
      // visible={visible}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={formRef.current?.saveButtonProps}
      closeIcon={<CloseCircleFilled />}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
      fullscreen
    >
      <YamlForm
        {...formProps}
        ref={formRef}
        id={id}
        isShowLayout={false}
        onFinish={onFinish}
      />
    </kit.modal>
  );
}

export default FormModal;
