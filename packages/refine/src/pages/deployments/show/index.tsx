import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { WorkloadDropdown } from '../../../components/Dropdowns/WorkloadDropdown';
import { PageShow } from '../../../components/PageShow';
import {
  ImageField,
  ReplicaField,
  BasicGroup,
  PodsGroup,
  ConditionsGroup,
  EventsTab
} from '../../../components/ShowContent';
import { WorkloadModel } from '../../../models';

export const DeploymentShow: React.FC<IResourceComponentsProps> = () => {
  const { i18n } = useTranslation();
  return (
    <PageShow<WorkloadModel>
      showConfig={{
        basicGroup: BasicGroup(i18n, {
          upAreas: [{ fields: [ReplicaField(),] }],
          basicFields: [ImageField(i18n),]
        }),
        tabs: [{
          title: i18n.t('dovetail.detail'),
          key: 'detail',
          groups: [
            
            PodsGroup(),
            ConditionsGroup(i18n)
          ]
        }, EventsTab(i18n)],
      }}
      Dropdown={WorkloadDropdown}
    />
  );
};
