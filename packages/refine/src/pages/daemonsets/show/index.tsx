import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { WorkloadDropdown } from 'src/components/Dropdowns/WorkloadDropdown';
import { PageShow } from '../../../components/PageShow';
import {
  ImageField,
  BasicGroup,
  PodsGroup,
  ConditionsGroup,
  ReplicaField,
  EventsTab
} from '../../../components/ShowContent';
import { WorkloadModel } from '../../../models';

export const DaemonSetShow: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();
  return (
    <PageShow<WorkloadModel>
      showConfig={{
        tabs: [{
          title: i18n.t('dovetail.detail'),
          key: 'detail',
          groups: [
            BasicGroup(i18n, {
              basicFields: [ImageField(i18n)],
              upAreas: [{
                fields: [ReplicaField()]
              }]
            }),
            PodsGroup(),
            ConditionsGroup(i18n)
          ]
        }, EventsTab(i18n)],
      }}
      Dropdown={WorkloadDropdown}
    />
  );
};
