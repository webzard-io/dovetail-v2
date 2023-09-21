import { useUIKit } from '@cloudtower/eagle';
import { useResource, useParsed } from '@refinedev/core';
import React from 'react';
import { useDeleteModal } from '../../hooks/useDeleteModal';

export const DeleteButton: React.FC = () => {
  const { resource } = useResource();
  const { id } = useParsed();
  const kit = useUIKit();

  const { showDeleteConfirm } = useDeleteModal();

  return (
    <kit.button
      type="primary"
      danger
      onClick={() => showDeleteConfirm(resource?.name || '', id || '')}
    >
      Delete
    </kit.button>
  );
};
