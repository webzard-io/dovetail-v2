import { useUIKit } from '@cloudtower/eagle';
import { PlusAddCreateNew16BoldOntintIcon } from '@cloudtower/icons-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOpenForm } from 'src/hooks/useOpenForm';

export interface CreateButtonProps {
  resourceName: string;
}

export function CreateButton({ resourceName }: CreateButtonProps) {
  const kit = useUIKit();
  const { t } = useTranslation();
  const openForm = useOpenForm();

  return (
    <kit.button
      prefixIcon={<PlusAddCreateNew16BoldOntintIcon />}
      type="primary"
      onClick={openForm}
    >
      {t('dovetail.create_resource', { resource: resourceName })}
    </kit.button>
  );
}
