import { useUIKit } from '@cloudtower/eagle';
import { useParsed } from '@refinedev/core';
import React from 'react';
import { useEdit } from '../../hooks/useEdit';

export const EditButton: React.FC = () => {
  const { id } = useParsed();
  const kit = useUIKit();

  const { edit } = useEdit();

  return (
    <kit.button
      type="primary"
      onClick={() => {
        if (id) edit(id);
      }}
    >
      Edit
    </kit.button>
  );
};
