import { useUIKit } from '@cloudtower/eagle';
import { useResource, useNavigation } from '@refinedev/core';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export function CreateButton() {
  const { resource } = useResource();
  const { create } = useNavigation();
  const kit = useUIKit();
  const { t } = useTranslation();

  const onClick = useCallback(() => {
    if (resource?.name) {
      create(resource.name);
    }
  }, [create, resource?.name]);

  return (
    <kit.button type="primary" onClick={onClick}>
      {t('create')}
    </kit.button>
  );
}
