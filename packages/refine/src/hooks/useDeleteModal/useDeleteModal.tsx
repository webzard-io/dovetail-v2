import { ExclamationErrorCircle16RedIcon } from '@cloudtower/icons-react';
import { BaseKey, useDelete } from '@refinedev/core';
import { Modal } from 'antd';
import React from 'react';

export const useDeleteModal = () => {
  const { mutate } = useDelete();
  const showDeleteConfirm = (resource: string, id: BaseKey) => {
    Modal.confirm({
      title: '删除',
      icon: <ExclamationErrorCircle16RedIcon />,
      content: `确定要删除${id}吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        mutate({
          resource,
          id,
        });
      },
    });
  };

  return { showDeleteConfirm };
};
