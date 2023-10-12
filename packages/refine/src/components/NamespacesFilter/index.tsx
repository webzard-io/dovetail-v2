import { useUIKit } from '@cloudtower/eagle';
import { useGo, useList, useParsed } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const NS_STORE_KEY = 'namespace-filter';
export const ALL_NS = '_all';

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

  const parsed = useParsed();
  const go = useGo();
  const value = parsed.params?.[NS_STORE_KEY] || ALL_NS;

  return (
    <kit.select
      input={{
        value,
        onChange(value) {
          go({
            query: {
              [NS_STORE_KEY]: value,
            },
            options: {
              keepQuery: true,
            },
          });
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
