import { IResourceComponentsProps } from '@refinedev/core';
import { Unstructured } from 'k8s-api-provider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { WorkloadPodsTable } from 'src/components';
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
          {
            key: 'pods',
            title: 'Pod',
            groups: [
              {
                areas: [
                  {
                    fields: [
                      {
                        key: 'pods',
                        path: [],
                        renderContent: (_, record) => {
                          return (
                            <div style={{ padding: '0 24px', height: '100%' }}>
                              <WorkloadPodsTable
                                filter={pod => pod.spec?.nodeName === record.name}
                                namespace={record.metadata.namespace}
                                hideToolbar
                              />
                            </div>
                          );
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }}
      Dropdown={K8sDropdown}
    />
  );
};
