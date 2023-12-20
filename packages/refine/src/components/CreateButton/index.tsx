import { useUIKit } from '@cloudtower/eagle';
import { useResource, useNavigation, useGo } from '@refinedev/core';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export function CreateButton() {
  const { resource } = useResource();
  const navigation = useNavigation();
  const go = useGo();
  const kit = useUIKit();
  const { t } = useTranslation();

  const onClick = useCallback(() => {
    if (resource?.name) {
      go({
        to: navigation.createUrl(resource.name),
        options: {
          keepQuery: true,
        },
      });
    }
  }, [resource?.name]);

  return (
    <kit.button type="primary" onClick={onClick}>
      {t('dovetail.create')}
    </kit.button>
  );
}
