import { Select, AntdOption } from '@cloudtower/eagle';
import { useList, useResource } from '@refinedev/core';
import React from 'react';
import type { FormWidgetProps } from './widget';

type NamespaceSelectProps = FormWidgetProps<string | string[]>;

export function NamespaceSelectWidget(props: NamespaceSelectProps) {
  const { action } = useResource();
  const { data } = useList({
    resource: 'namespaces',
    meta: {
      resourceBasePath: '/api/v1',
      kind: 'Namespace',
    },
    pagination: {
      mode: 'off'
    }
  });

  return (
    <Select input={props} disabled={action === 'edit'}>
      {data?.data.map(namespace => (
        <AntdOption key={namespace.metadata.name} value={namespace.metadata.name}>
          {namespace.metadata.name}
        </AntdOption>
      ))}
    </Select>
  );
}

export const namespaceRules = [
  {
    required: true,
    message: 'Please input the namespace.',
  },
];
