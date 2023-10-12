import { useUIKit } from '@cloudtower/eagle';
import { useList } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'usehooks-ts';

export const NS_STORE_KEY = 'namespace-filter';
export const ALL_NS = '_all';

export const useNamespacesFilter = () => {
  const [value] = useLocalStorage(NS_STORE_KEY, ALL_NS);

  return {
    value,
  };
};

export const NamespacesFilter: React.FC = () => {
  const kit = useUIKit();
  const { t } = useTranslation();
  const { data } = useList({
    resource: 'namespaces',
    meta: {
      resourceBasePath: '/api/v1',
      kind: 'Namespace',
    },
  });

  const [value, setValue] = useLocalStorage(NS_STORE_KEY, ALL_NS);

  return (
    <kit.select
      input={{
        value,
        onChange(value) {
          setValue(value as string);
        },
      }}
    >
      <kit.option key="_all" value="_all">
        {t('dovetail.all_namespaces')}
      </kit.option>
      {data?.data.map(namespace => {
        const { name } = namespace.metadata;
        return (
          <kit.option key={name} value={name}>
            {name}
          </kit.option>
        );
      })}
    </kit.select>
  );
};
