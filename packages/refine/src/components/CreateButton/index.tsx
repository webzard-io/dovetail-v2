import { useUIKit } from '@cloudtower/eagle';
import { PlusAddCreateNew16BoldOntintIcon } from '@cloudtower/icons-react';
import { useResource } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOpenForm } from 'src/hooks/useOpenForm';

export function CreateButton() {
  const kit = useUIKit();
  const { t } = useTranslation();
  const openForm = useOpenForm();
  const { resource } = useResource();

  return (
    <kit.button
      prefixIcon={<PlusAddCreateNew16BoldOntintIcon />}
      type="primary"
      onClick={openForm}
    >
      {t('dovetail.create_resource', { resource: resource?.meta?.kind })}
    </kit.button>
  );
}
