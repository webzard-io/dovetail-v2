import {
  ImmersiveDialog,
  SmallDialog,
  Button,
  usePushModal,
  Typo,
  usePopModal,
} from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import { useResource, CanAccess } from '@refinedev/core';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FormErrorAlert } from '../../components/FormErrorAlert';
import { AccessControlAuth } from '../../constants/auth';
import { useSubmitForm } from '../../hooks/useSubmitForm';

const EditButtonStyle = css`
  &.ant-btn.ant-btn-link {
    font-size: 12px;
    height: 18px;
    margin-left: 8px;

    span {
      height: 18px;
    }
  }
`;

export interface EditFieldFormHandler {
  submit: () => Promise<unknown> | undefined;
}

export interface EditFieldModalProps {
  title?: string;
  submitting?: boolean;
  errorMsgs?: string[];
  formRef: React.MutableRefObject<{
    submit: () => Promise<unknown> | boolean | undefined;
  } | null>;
  renderContent: () => React.ReactNode;
  fullscreen?: boolean;
  namespace: string;
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
  const ModalComponent = fullscreen ? ImmersiveDialog : SmallDialog;

  const close = useCallback(() => {
    popModal();
    reset();
  }, [popModal, reset]);

  return (
    <ModalComponent
      title={title || i18n.t('dovetail.edit')}
      confirmLoading={submitting}
      onOk={onSubmit}
      onCancel={close}
      okText={i18n.t('dovetail.save')}
      destroyOnClose
    >
      {renderContent()}
      <FormErrorAlert style={{ marginTop: 16 }} errorMsgs={errorMsgs} isEdit />
    </ModalComponent>
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
      params={{
        namespace: modalProps.namespace,
      }}
    >
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
