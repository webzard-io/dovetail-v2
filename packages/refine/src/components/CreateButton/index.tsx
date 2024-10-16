import { Button } from '@cloudtower/eagle';
import { PlusAddCreateNew16BoldOntintIcon } from '@cloudtower/icons-react';
import { useResource } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOpenForm } from 'src/hooks/useOpenForm';

interface CreateButtonProps {
  label?: string;
}

export function CreateButton(props: CreateButtonProps) {
  const { t } = useTranslation();
  const openForm = useOpenForm();
  const { resource } = useResource();
  const label = props.label || resource?.meta?.kind;

  return (
    <Button
      prefixIcon={<PlusAddCreateNew16BoldOntintIcon />}
      type="primary"
      onClick={openForm}
    >
      {t('dovetail.create_resource', { resource: /^[a-zA-Z]/.test(label) ? ` ${label}` : label })}
    </Button>
  );
}
