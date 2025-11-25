import { Select, AntdOption, KitSelectProps } from '@cloudtower/eagle';
import { useList } from '@refinedev/core';
import React from 'react';

type ResourceSelectProps = {
  className?: string;
  resource: string;
  resourceBasePath: string;
  namespace?: string;
  kind: string;
  value: string;
  placeholder?: string;
  onChange: (
    value: string | string[],
    object: { object: Record<string, unknown> } | { object: Record<string, unknown> }[]
  ) => void;
  selectProps?: KitSelectProps;
};

export function ResourceSelect(props: ResourceSelectProps) {
  const {
    className,
    resource,
    resourceBasePath,
    kind,
    namespace,
    selectProps,
    value,
    onChange,
    placeholder,
  } = props;
  const { data, isLoading, isError } = useList({
    resource,
    meta: {
      resourceBasePath,
      kind,
    },
    pagination: {
      mode: 'off',
    },
  });

  return (
    <Select
      className={className}
      placeholder={placeholder}
      input={{
        value,
        onChange,
      }}
      loading={isLoading}
      error={isError}
      {...selectProps}
    >
      {data?.data
        .filter(item => !namespace || item.metadata.namespace === namespace)
        .map(item => (
          <AntdOption key={item.metadata.name} value={item.metadata.name} object={item}>
            {item.metadata.name}
          </AntdOption>
        ))}
    </Select>
  );
}
