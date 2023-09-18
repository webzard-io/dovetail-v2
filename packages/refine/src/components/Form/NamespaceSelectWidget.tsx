import { useUIKit } from '@cloudtower/eagle';
import { useList } from '@refinedev/core';

type NamespaceSelectProps = {
  value?: string;
  onChange?: (value: string | string[]) => void;
  [props: string]: unknown;
}

export function NamespaceSelectWidget(props: NamespaceSelectProps) {
  const kit = useUIKit();
  const { data } = useList({
    resource: 'namespaces',
    meta: {
      resourceBasePath: "/api/v1",
      kind: "Namespace",
    },
  });

  return (
    <kit.select input={props}>
      {
        data?.data.map(namespace => (
          <kit.option
            key={namespace.metadata.name}
            value={namespace.metadata.name}
          >{namespace.metadata.name}</kit.option>
        ))
      }
    </kit.select>
  )
}

export const namespaceRules = [{
  required: true,
  message: 'Please input the namespace.'
}];
