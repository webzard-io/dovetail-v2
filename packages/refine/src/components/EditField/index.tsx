import { Modal, Button, usePushModal, Typo, usePopModal } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import { useResource, CanAccess } from '@refinedev/core';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FormErrorAlert } from '../../components/FormErrorAlert';
import { AccessControlAuth } from '../../constants/auth';
import { useSubmitForm } from '../../hooks/useSubmitForm';
import { SmallModalStyle } from '../../styles/modal';
import { FullscreenModalStyle } from '../../styles/modal';

const EditButtonStyle = css`
  &.ant-btn.ant-btn-link {
    font-size: 13px;
    height: 18px;
    margin-left: 8px;
  }
`;

export interface EditFieldModalProps {
  title?: string;
  submitting?: boolean;
  errorMsgs?: string[];
  formRef: React.MutableRefObject<{
    submit: () => Promise<unknown> | boolean | undefined;
  } | null>;
  renderContent: () => React.ReactNode;
  fullscreen?: boolean;
}

export function EditFieldModal(props: EditFieldModalProps) {
  const { title, formRef: form, renderContent, fullscreen } = props;
  const { i18n } = useTranslation();
  const popModal = usePopModal();
  const { submitting, errorMsgs, reset, onSubmit } = useSubmitForm({
    formRef: form,
    onSubmitSuccess: () => {
      popModal();
    },
  });

  const close = useCallback(() => {
    popModal();
    reset();
  }, [reset]);

  return (
    <Modal
      className={fullscreen ? FullscreenModalStyle : SmallModalStyle}
      title={title || i18n.t('dovetail.edit')}
      confirmLoading={submitting}
      onOk={onSubmit}
      onCancel={close}
      okText={i18n.t('dovetail.save')}
      normal
      destroyOnClose
      fullscreen={fullscreen}
    >
      {renderContent()}
      <FormErrorAlert style={{ marginTop: 16 }} errorMsgs={errorMsgs} isEdit />
    </Modal>
  );
}

export interface EditField {
  modalProps: EditFieldModalProps;
}

export function EditField(props: EditField) {
  const { modalProps } = props;
  const { i18n } = useTranslation();
  const { resource } = useResource();
  const pushModal = usePushModal();

  return (
    <CanAccess resource={resource?.name} action={AccessControlAuth.Edit}>
      <Button
        className={cx(EditButtonStyle, Typo.Label.l4_regular_title)}
        type="link"
        onClick={() => {
          pushModal<'EditFieldModal'>({
            component: EditFieldModal,
            props: modalProps,
          });
        }}
      >
        {i18n.t('dovetail.edit')}
      </Button>
    </CanAccess>
  );
}
