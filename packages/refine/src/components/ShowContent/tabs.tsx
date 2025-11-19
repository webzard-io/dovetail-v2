import { i18n as I18nType } from 'i18next';
import { Condition } from 'kubernetes-types/meta/v1';
import React from 'react';
import { LabelsAndAnnotationsShow } from 'src/components/LabelsAndAnnotationsShow';
import { PodLog } from 'src/components/PodLog';
import { ResourceModel, PodModel } from 'src/models';
import { ConditionsTable } from '../ConditionsTable';
import { ShowTab, EventsTableTabField } from './fields';

export const EventsTab = <Model extends ResourceModel>({
  i18n,
  size,
}: {
  i18n: I18nType;
  size?: 'small' | 'medium';
}): ShowTab<Model> => ({
  title: i18n.t('dovetail.event'),
  key: 'events',
  background: 'white',
  groups: [
    {
      areas: [
        {
          fields: [EventsTableTabField({ size })],
        },
      ],
    },
  ],
});

export const ConditionsTab = <Model extends ResourceModel>({
  i18n,
  size,
}: {
  i18n: I18nType;
  size?: 'small' | 'medium';
}): ShowTab<Model> => ({
  title: i18n.t('dovetail.condition'),
  key: 'conditions',
  background: 'white',
  groups: [
    {
      areas: [
        {
          fields: [
            {
              key: 'Conditions',
              path: ['status', 'conditions'],
              renderContent: value => {
                return (
                  <div
                    style={{
                      padding: size === 'small' ? '0 12px' : '0 24px',
                      height: '100%',
                    }}
                  >
                    <ConditionsTable conditions={value as Condition[]} />
                  </div>
                );
              },
            },
          ],
        },
      ],
    },
  ],
});

export const LabelAnnotationsTab = <Model extends ResourceModel>({
  i18n,
  size,
}: {
  i18n: I18nType;
  size?: 'small' | 'medium';
}): ShowTab<Model> => ({
  title: i18n.t('dovetail.label_annotations'),
  key: 'label-annotations',
  background: 'white',
  groups: [
    {
      areas: [
        {
          fields: [
            {
              key: 'label-annotations',
              path: [],
              renderContent: (_, record) => {
                return (
                  <LabelsAndAnnotationsShow
                    labels={record.metadata?.labels as Record<string, string>}
                    annotations={record.metadata?.annotations as Record<string, string>}
                    size={size}
                  />
                );
              },
            },
          ],
        },
      ],
    },
  ],
});

export const PodLogTab = <Model extends PodModel>(
  i18n: I18nType,
  apiUrl: string
): ShowTab<Model> => ({
  title: i18n.t('dovetail.log'),
  key: 'pod-log',
  background: 'white',
  groups: [
    {
      areas: [
        {
          fields: [
            {
              key: 'log',
              path: [],
              renderContent: (_, record) => {
                return <PodLog pod={record} apiUrl={apiUrl} />;
              },
            },
          ],
        },
      ],
    },
  ],
});
