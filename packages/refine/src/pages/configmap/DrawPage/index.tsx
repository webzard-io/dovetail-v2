import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { KeyValueListWidget } from '../../../components/Form';
import { MetadataFields } from '../../../components/Show/Fields';
import { PageShow } from '../../../components/Show/PageShow';

export const ConfigmapShow: React.FC<IResourceComponentsProps> = () => {
  return (
    <PageShow
      fields={[
        ...MetadataFields,
        {
          title: 'Data',
          path: ['data'],
          render: val => {
            return <KeyValueListWidget value={val as any} />;
          },
        },
      ]}
    />
  );
};
