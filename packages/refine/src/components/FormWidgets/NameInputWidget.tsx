import { Input, AntdInputProps } from '@cloudtower/eagle';
import { useResource } from '@refinedev/core';
import React from 'react';

export function NameInputWidget(props: AntdInputProps) {
  const { action } = useResource();

  return <Input {...props} disabled={action === 'edit'} />;
}
