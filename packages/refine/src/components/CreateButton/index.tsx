import { useCallback } from 'react';
import { useUIKit } from '@cloudtower/eagle';
import { useResource, useNavigation } from '@refinedev/core';

export function CreateButton() {
  const { resource } = useResource();
  const { create } = useNavigation()
  const kit = useUIKit();

  const onClick = useCallback(() => {
    if (resource?.name) {
      create(resource.name);
    }
  }, []);

  return (
    <kit.button type='primary' onClick={onClick}>Create</kit.button>
  )
}
