import { ExclamationErrorCircle16RedIcon } from '@cloudtower/icons-react';
import { BaseKey, useDeleteMany } from '@refinedev/core';
import { Modal } from 'antd';
import React from 'react';

export const useDeleteManyModal = () => {
  const { mutate } = useDeleteMany();
  const showDeleteManyConfirm = (resource: string, ids: BaseKey[]) => {
    Modal.confirm({
      title: '删除',
      icon: <ExclamationErrorCircle16RedIcon />,
      content: `确定要删除${ids.join(', ')}吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        mutate({
          resource,
          ids,
        });
      },
    });
  };

  return { showDeleteManyConfirm };
};
