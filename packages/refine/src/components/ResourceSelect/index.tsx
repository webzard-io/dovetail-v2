import { Select, AntdOption, KitSelectProps } from '@cloudtower/eagle';
import { useList } from '@refinedev/core';
import React from 'react';

type ResourceSelectProps = {
  resource: string;
  resourceBasePath: string;
  kind: string;
  value: string;
  onChange: (...params: unknown[]) => void;
  selectProps?: KitSelectProps;
};

export function ResourceSelect(props: ResourceSelectProps) {
  const { resource, resourceBasePath, kind, selectProps, value, onChange } = props;
  const { data, isLoading, isError } = useList({
    resource,
    meta: {
      resourceBasePath,
      kind,
    },
    pagination: {
      mode: 'off'
    }
  });

  return (
    <Select
      input={{
        value,
        onChange
      }}
      loading={isLoading}
      error={isError}
      {...selectProps}
    >
      {data?.data.map(namespace => (
        <AntdOption key={namespace.metadata.name} value={namespace.metadata.name}>
          {namespace.metadata.name}
        </AntdOption>
      ))}
    </Select>
  );
}
