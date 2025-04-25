import { Button } from '@cloudtower/eagle';
import { useResource, useParsed } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDeleteModal } from '../../hooks/useDeleteModal';

export const DeleteButton: React.FC = () => {
  const { resource } = useResource();
  const { id } = useParsed();
  const { t } = useTranslation();

  const { openDeleteConfirmModal } = useDeleteModal({resourceName: resource?.name || ''});

  return (
    <>
      <Button
        type="primary"
        danger
        onClick={() => openDeleteConfirmModal((id as string) || '')}
      >
        {t('dovetail.delete')}
      </Button>
    </>
  );
};
