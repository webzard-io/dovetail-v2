import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { KeyValue } from '../../../components/KeyValue';
import { PageShow } from '../../../components/PageShow';
import { ResourceModel } from '../../../model';

export const ConfigmapShow: React.FC<IResourceComponentsProps> = () => {
  return (
    <PageShow
      fieldGroups={[
        [],
        [],
        [
          {
            key: 'data',
            title: 'Data',
            path: ['data'],
            render: val => {
              return <KeyValue value={val as Record<string, string>} />;
            },
          },
        ],
      ]}
      formatter={d => new ResourceModel(d)}
    />
  );
};
