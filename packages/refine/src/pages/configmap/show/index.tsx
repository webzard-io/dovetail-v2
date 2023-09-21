import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { KeyValue } from '../../../components/KeyValue';
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
            return <KeyValue value={val as any} />;
          },
        },
      ]}
    />
  );
};
