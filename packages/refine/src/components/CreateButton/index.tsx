import { Button } from '@cloudtower/eagle';
import { PlusAddCreateNew16BoldOntintIcon } from '@cloudtower/icons-react';
import { useResource } from '@refinedev/core';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigsContext } from 'src/contexts';
import { useOpenForm } from 'src/hooks/useOpenForm';
import { addSpaceBeforeLetter } from 'src/utils/string';

interface CreateButtonProps {
  label?: string;
}

export function CreateButton(props: CreateButtonProps) {
  const { t } = useTranslation();
  const openForm = useOpenForm();
  const { resource } = useResource();
  const configs = useContext(ConfigsContext);
  const config = configs[resource?.name || ''];
  const label = props.label || resource?.meta?.kind;
  const createButtonText = config.createButtonText;

  return (
    <Button
      prefixIcon={<PlusAddCreateNew16BoldOntintIcon />}
      type="primary"
      onClick={openForm}
    >
      {createButtonText ||
        t('dovetail.create_resource', {
          resource: addSpaceBeforeLetter(label),
        })}
    </Button>
  );
}
