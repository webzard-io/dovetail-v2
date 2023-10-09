import { useUIKit } from '@cloudtower/eagle';
import { useResource, useParsed } from '@refinedev/core';
import React from 'react';
import { useDeleteModal } from '../../hooks/useDeleteModal';

export const DeleteButton: React.FC = () => {
  const { resource } = useResource();
  const { id } = useParsed();
  const kit = useUIKit();

  const { modalProps, visible, openDeleteConfirmModal } = useDeleteModal(resource?.name || '');

  return (
    <>
      <kit.button type="primary" danger onClick={() => openDeleteConfirmModal(id || '')}>
        Delete
      </kit.button>
      {visible ? <kit.modal {...modalProps} /> : null}
    </>
  );
};
