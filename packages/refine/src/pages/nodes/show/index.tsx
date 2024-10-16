import { IResourceComponentsProps } from '@refinedev/core';
import { Unstructured } from 'k8s-api-provider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import K8sDropdown from 'src/components/Dropdowns/K8sDropdown';
import { PageShow } from 'src/components/PageShow';
import { BasicGroup, ConditionsGroup, NodeTaintsGroup } from 'src/components/ShowContent';
import { ResourceModel } from 'src/models';

export const NodeShow: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();

  return (
    <PageShow<ResourceModel<Node & Unstructured>>
      showConfig={{
        tabs: [
          {
            title: i18n.t('dovetail.detail'),
            key: 'detail',
            groups: [
              BasicGroup(i18n, {
                upAreas: [{ fields: [] }],
                basicFields: [],
              }),
              NodeTaintsGroup(i18n),
              ConditionsGroup(i18n),
            ],
          },
        ],
      }}
      Dropdown={K8sDropdown}
    />
  );
};
