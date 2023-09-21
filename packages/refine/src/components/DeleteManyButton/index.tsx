import { useUIKit } from '@cloudtower/eagle';
import { useResource } from '@refinedev/core';
import React, { useCallback } from 'react';
import { useDeleteManyModal } from '../../hooks/useDeleteModal/useDeleteManyModal';

export const DeleteManyButton: React.FC<{ ids: string[] }> = props => {
  const { resource } = useResource();
  const kit = useUIKit();
  const { showDeleteManyConfirm } = useDeleteManyModal();

  const onClick = useCallback(() => {
    if (resource?.name) {
      showDeleteManyConfirm(resource.name, props.ids);
    }
  }, [props.ids, resource, showDeleteManyConfirm]);

  return (
    <kit.button type="primary" danger onClick={onClick}>
      Delete
    </kit.button>
  );
};
