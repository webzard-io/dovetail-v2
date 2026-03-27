import { Button } from '@cloudtower/eagle';
import { PlusAddCreateNew16BoldOntintIcon } from '@cloudtower/icons-react';
import { useResource } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOpenForm } from 'src/hooks/useOpenForm';
import { transformResourceKindInSentence } from 'src/utils/string';

interface CreateButtonProps {
  label?: string;
  children?: React.ReactNode;
}

export function CreateButton(props: CreateButtonProps) {
  const { t, i18n } = useTranslation();
  const openForm = useOpenForm();
  const { resource } = useResource();
  const label = props.label || resource?.meta?.kind;

  return (
    <Button
      prefixIcon={<PlusAddCreateNew16BoldOntintIcon />}
      type="primary"
      onClick={() => openForm()}
    >
      {props.children ||
        t('dovetail.create_resource', {
          resource: transformResourceKindInSentence(label, i18n.language),
        })}
    </Button>
  );
}
