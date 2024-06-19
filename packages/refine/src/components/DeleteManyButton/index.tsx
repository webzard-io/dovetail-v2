import { Button, Modal } from '@cloudtower/eagle';
import { useResource } from '@refinedev/core';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDeleteManyModal } from '../../hooks/useDeleteModal/useDeleteManyModal';

export const DeleteManyButton: React.FC<{ ids: string[] }> = props => {
  const { resource } = useResource();
  const { t } = useTranslation();
  const { modalProps, visible, setVisible } = useDeleteManyModal(
    resource?.name || '',
    props.ids
  );

  const onClick = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  return (
    <>
      <Button type="primary" danger onClick={onClick}>
        {t('dovetail.delete')}
      </Button>
      {visible ? <Modal {...modalProps} /> : null}
    </>
  );
};
