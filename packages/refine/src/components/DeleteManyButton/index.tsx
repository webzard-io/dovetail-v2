import { useUIKit } from '@cloudtower/eagle';
import { useResource, useDeleteMany } from '@refinedev/core';
import React, { useCallback } from 'react';

export const DeleteManyButton: React.FC<{ ids: string[] }> = props => {
  const { resource } = useResource();
  const { mutate } = useDeleteMany();
  const kit = useUIKit();

  const onClick = useCallback(() => {
    if (resource?.name) {
      mutate({
        resource: resource.name,
        ids: props.ids,
      });
    }
  }, [mutate, props.ids, resource?.name]);

  return (
    <kit.button type="primary" danger onClick={onClick}>
      Delete
    </kit.button>
  );
};
