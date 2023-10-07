import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { MetadataFields } from '../../../components/Show/Fields';
import { PageShow } from '../../../components/Show/PageShow';

export const DeploymentShow: React.FC<IResourceComponentsProps> = () => {
  return <PageShow fields={[...MetadataFields]} />;
};
