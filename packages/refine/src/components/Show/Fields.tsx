import React from 'react';
import { ConditionsTable } from '../ConditionsTable';
import { KeyValue } from '../KeyValue';
import { Tags } from './Tags';

export type ShowField = {
  key: string;
  title: string;
  path: string[];
  render?: (val: unknown, record: Record<string, any>) => React.ReactElement;
};

export const FirstLineFields: ShowField[] = [
  {
    key: 'NameSpace',
    title: 'NameSpace',
    path: ['metadata', 'namespace'],
  },
  {
    key: 'Age',
    title: 'Age',
    path: ['metadata', 'creationTimestamp'],
  },
];

export const SecondLineFields: ShowField[] = [
  {
    key: 'Labels',
    title: 'Labels',
    path: ['metadata', 'labels'],
    render: value => {
      return <Tags value={value as Record<string, string>} />;
    },
  },
  {
    key: 'Annotations',
    title: 'Annotations',
    path: ['metadata', 'annotations'],
    render: value => {
      return <Tags value={value as Record<string, string>} />;
    },
  },
];

export const MetadataFields: ShowField[] = [
  {
    key: 'Name',
    title: 'Name',
    path: ['metadata', 'name'],
  },
  {
    key: 'Type',
    title: 'Type',
    path: ['kind'],
  },
  {
    key: 'NameSpace',
    title: 'NameSpace',
    path: ['metadata', 'namespace'],
  },
  {
    key: 'Age',
    title: 'Age',
    path: ['metadata', 'creationTimestamp'],
  },
  {
    key: 'Labels',
    title: 'Labels',
    path: ['metadata', 'labels'],
    render: value => {
      return <KeyValue value={value as Record<string, string>} />;
    },
  },
  {
    key: 'Annotations',
    title: 'Annotations',
    path: ['metadata', 'annotations'],
    render: value => {
      return <KeyValue value={value as Record<string, string>} />;
    },
  },
];

export const ImageField: ShowField = {
  key: 'Image',
  title: 'Image',
  path: ['spec', 'template', 'spec', 'containers', '0', 'image'],
};

export const ReplicaField: ShowField = {
  key: 'Replicas',
  title: 'Ready',
  path: ['status', 'replicas'],
  render: (_, record) => {
    return (
      <span>
        {record.status.readyReplicas}/{record.status.replicas}
      </span>
    );
  },
};

export const ConditionsField: ShowField = {
  key: 'Conditions',
  title: 'Conditions',
  path: ['status', 'conditions'],
  render: value => {
    return <ConditionsTable conditions={value as any} />;
  },
};
