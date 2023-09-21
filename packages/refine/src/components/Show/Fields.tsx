import React from 'react';
import { KeyValue } from '../KeyValue';

export type ShowField = {
  title: string;
  path: string[];
  render?: (val: unknown) => React.ReactElement;
};

export const MetadataFields: ShowField[] = [
  {
    title: 'Name',
    path: ['metadata', 'name'],
  },
  {
    title: 'Type',
    path: ['kind'],
  },
  {
    title: 'NameSpace',
    path: ['metadata', 'namespace'],
  },
  {
    title: 'Age',
    path: ['metadata', 'creationTimestamp'],
  },
  {
    title: 'Labels',
    path: ['metadata', 'labels'],
    render: value => {
      return <KeyValue value={value as Record<string, string>} />;
    },
  },
  {
    title: 'Annotations',
    path: ['metadata', 'annotations'],
    render: value => {
      return <KeyValue value={value as Record<string, string>} />;
    },
  },
];
