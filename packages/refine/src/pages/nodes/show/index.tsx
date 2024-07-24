import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import K8sDropdown from 'src/components/K8sDropdown';
import { PageShow } from 'src/components/PageShow';
import {
  BasicGroup,
  ConditionsGroup,
} from 'src/components/ShowContent';
import { NodeModel } from 'src/models';

export const NodeShow: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();

  return (
    <PageShow<NodeModel>
      showConfig={{
        tabs: [{
          title: i18n.t('dovetail.detail'),
          key: 'detail',
          groups: [
            BasicGroup(i18n, {
              upAreas: [{ fields: [] }],
              basicFields: []
            }),
            ConditionsGroup(i18n)
          ]
        }],
      }}
      Dropdown={K8sDropdown}
    />
  );
};
