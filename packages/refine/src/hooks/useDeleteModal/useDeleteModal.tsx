import { ModalProps } from '@cloudtower/eagle';
import { BaseKey, useDelete } from '@refinedev/core';
import { useState } from 'react';

export const useDeleteModal = (resource: string) => {
  const { mutate } = useDelete();
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState<BaseKey>('');
  const modalProps: ModalProps = {
    title: '删除',
    okText: '删除',
    okButtonProps: {
      danger: true,
    },
    cancelText: '取消',
    children: `确定要删除${id}吗？`,
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
