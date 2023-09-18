import { useUIKit } from '@cloudtower/eagle';
import { useList, useResource } from '@refinedev/core';
import React from 'react';
import type { FormWidgetProps } from './widget';

type NamespaceSelectProps = FormWidgetProps<string | string[]>;

export function NamespaceSelectWidget(props: NamespaceSelectProps) {
  const kit = useUIKit();
  const { action } = useResource();
  const { data } = useList({
    resource: 'namespaces',
    meta: {
      resourceBasePath: '/api/v1',
      kind: 'Namespace',
    },
  });

  return (
    <kit.select input={props} disabled={action === 'edit'}>
      {
        data?.data.map(namespace => (
          <kit.option
            key={namespace.metadata.name}
            value={namespace.metadata.name}
          >{namespace.metadata.name}</kit.option>
        ))
      }
    </kit.select>
  );
}

export const namespaceRules = [{
  required: true,
  message: 'Please input the namespace.'
}];
