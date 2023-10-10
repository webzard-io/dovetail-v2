import { ModalProps } from '@cloudtower/eagle';
import { BaseKey, useDelete } from '@refinedev/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useDeleteModal = (resource: string) => {
  const { mutate } = useDelete();
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState<BaseKey>('');
  const { t } = useTranslation();
  const modalProps: ModalProps = {
    title: t('delete'),
    okText: t('delete'),
    okButtonProps: {
      danger: true,
    },
    cancelText: t('cancel'),
    children: t('confirm_delete_text', {
      target: id,
      interpolation: { escapeValue: false },
    }),
    onOk() {
      mutate({
        resource,
        id,
      });
      setVisible(false);
    },
    onCancel() {
      setVisible(false);
    },
  };

  function openDeleteConfirmModal(id: BaseKey) {
    setId(id);
    setVisible(true);
  }
  return { modalProps, visible, openDeleteConfirmModal };
};
