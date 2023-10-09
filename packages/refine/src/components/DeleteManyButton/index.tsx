import { useUIKit } from '@cloudtower/eagle';
import { useResource } from '@refinedev/core';
import React, { useCallback } from 'react';
import { useDeleteManyModal } from '../../hooks/useDeleteModal/useDeleteManyModal';

export const DeleteManyButton: React.FC<{ ids: string[] }> = props => {
  const { resource } = useResource();
  const kit = useUIKit();
  const { modalProps, visible, setVisible } = useDeleteManyModal(
    resource?.name || '',
    props.ids
  );

  const onClick = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  return (
    <>
      <kit.button type="primary" danger onClick={onClick}>
        Delete
      </kit.button>
      {visible ? <kit.modal {...modalProps} /> : null}
    </>
  );
};
