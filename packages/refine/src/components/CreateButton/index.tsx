import { useUIKit } from '@cloudtower/eagle';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOpenForm } from 'src/hooks/useOpenForm';

export function CreateButton() {
  const kit = useUIKit();
  const { t } = useTranslation();
  const openForm = useOpenForm();

  return (
    <kit.button type="primary" onClick={openForm}>
      {t('dovetail.create')}
    </kit.button>
  );
}
