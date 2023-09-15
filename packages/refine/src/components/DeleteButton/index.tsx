import { useUIKit } from '@cloudtower/eagle';
import { useResource, useParsed, useDelete } from '@refinedev/core';
import React, { useCallback } from 'react';

export const DeleteButton: React.FC = () => {
  const { resource } = useResource();
  const { id } = useParsed();
  const { mutate } = useDelete();
  const kit = useUIKit();

  const onClick = useCallback(() => {
    if (resource?.name && id) {
      mutate({
        resource: resource.name,
        id,
      });
    }
  }, [id, mutate, resource?.name]);

  return (
    <kit.button type="primary" danger onClick={onClick}>
      Delete
    </kit.button>
  );
};
