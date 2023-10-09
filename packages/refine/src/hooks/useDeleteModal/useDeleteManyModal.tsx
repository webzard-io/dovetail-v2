import { ModalProps } from '@cloudtower/eagle';
import { BaseKey, useDeleteMany } from '@refinedev/core';
import { useState } from 'react';

export const useDeleteManyModal = (resource: string, ids: BaseKey[]) => {
  const { mutate } = useDeleteMany();
  const [visible, setVisible] = useState(false);
  console.log('visible', visible);
  const modalProps: ModalProps = {
    title: '删除',
    okText: '删除',
    okButtonProps: {
      danger: true,
    },
    cancelText: '取消',
    children: `确定要删除${ids.join(', ')}吗？`,
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
