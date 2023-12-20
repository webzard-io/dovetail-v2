import { ModalProps } from '@cloudtower/eagle';
import { BaseKey, useDeleteMany } from '@refinedev/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useDeleteManyModal = (resource: string, ids: BaseKey[]) => {
  const { mutate } = useDeleteMany();
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const modalProps: ModalProps = {
    title: t('dovetail.delete'),
    okText: t('dovetail.delete'),
    okButtonProps: {
      danger: true,
    },
    cancelText: t('dovetail.cancel'),
    children: t('dovetail.confirm_delete_text', {
      target: ids,
      interpolation: { escapeValue: false },
    }),
    onOk() {
      mutate({
        resource,
        ids,
      });
      setVisible(false);
    },
    onCancel() {
      setVisible(false);
    },
  };
  return { modalProps, visible, setVisible };
};
