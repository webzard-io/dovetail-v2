import { Modal, Button, usePushModal, usePopModal, } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useResource, CanAccess } from '@refinedev/core';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FormErrorAlert } from 'src/components/FormErrorAlert';
import { AccessControlAuth } from 'src/constants/auth';
import { SmallModalStyle } from 'src/styles/modal';
import { useSubmitForm } from 'src/hooks/useSubmitForm';

const EditButtonStyle = css`
  &.ant-btn.ant-btn-link {
    font-size: 13px;
    height: 22px;
    margin-left: 8px;
  }
`;

export interface EditFieldModalProps {
  title?: string;
  submitting?: boolean;
  errorMsgs?: string[];
  formRef: React.MutableRefObject<{
    submit: () => (Promise<unknown> | undefined);
  } | null>;
  renderContent: () => React.ReactNode;
}

export function EditFieldModal(props: EditFieldModalProps) {
  const { title, formRef: form, renderContent } = props;
  const { i18n } = useTranslation();
  const popModal = usePopModal();
  const {
    submitting,
    errorMsgs,
    reset,
    onSubmit,
  } = useSubmitForm({
    formRef: form,
    onSubmitSuccess: () => {
      popModal();
    }
  });

  const close = useCallback(() => {
    popModal();
    reset();
  }, [reset]);

  return (
    <Modal
      className={SmallModalStyle}
      title={title || i18n.t('dovetail.edit')}
      confirmLoading={submitting}
      onOk={onSubmit}
      onCancel={close}
      okText={i18n.t('dovetail.save')}
      normal
      destroyOnClose
    >
      {renderContent()}
      <FormErrorAlert
        style={{ marginTop: 16 }}
        errorMsgs={errorMsgs}
        isEdit
      />
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
    <CanAccess
      resource={resource?.name}
      action={AccessControlAuth.Edit}
    >
      <Button
        className={EditButtonStyle}
        type="link"
        onClick={() => {
          pushModal<'EditFieldModal'>({
            component: EditFieldModal,
            props: modalProps
          });
        }}
      >{i18n.t('dovetail.edit')}</Button>
    </CanAccess>
  );
}
