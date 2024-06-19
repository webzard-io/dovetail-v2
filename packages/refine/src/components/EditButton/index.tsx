import { Button } from '@cloudtower/eagle';
import { useParsed } from '@refinedev/core';
import React from 'react';
import { useEdit } from '../../hooks/useEdit';

export const EditButton: React.FC = () => {
  const { id } = useParsed();
  const { edit } = useEdit();

  return (
    <Button
      type="primary"
      onClick={() => {
        if (id) edit(id);
      }}
    >
      Edit
    </Button>
  );
};
