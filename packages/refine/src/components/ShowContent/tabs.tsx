import { i18n as I18nType } from 'i18next';
import { Condition } from 'kubernetes-types/meta/v1';
import React from 'react';
import { PodLog } from 'src/components/PodLog';
import { KeyValue, Tags } from 'src/index';
import { ResourceModel, PodModel } from 'src/models';
import { ConditionsTable } from '../ConditionsTable';
import { ShowTab, EventsTableTabField } from './fields';

export const EventsTab = <Model extends ResourceModel>(
  i18n: I18nType
): ShowTab<Model> => ({
  title: i18n.t('dovetail.event'),
  key: 'events',
  groups: [
    {
      areas: [
        {
          fields: [EventsTableTabField()],
        },
      ],
    },
  ],
});

export const ConditionsTab = <Model extends ResourceModel>(
  i18n: I18nType
): ShowTab<Model> => ({
  title: i18n.t('dovetail.condition'),
  key: 'conditions',
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
                  <div style={{ padding: '0 24px', height: '100%' }}>
                    <ConditionsTable conditions={value as Condition[]} />;
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

export const LabelAnnotationsTab = <Model extends ResourceModel>(
  i18n: I18nType
): ShowTab<Model> => ({
  title: i18n.t('dovetail.label_annotations'),
  key: 'label-annotations',
  groups: [
    {
      title: i18n.t('dovetail.label'),
      areas: [
        {
          fields: [
            {
              key: 'Labels',
              title: i18n.t('dovetail.label'),
              path: ['metadata', 'labels'],
              render: value => {
                if (!value) {
                  return '-';
                }

                return <Tags value={value as Record<string, string>} />;
              },
            },
          ],
        },
      ],
    },
    {
      title: i18n.t('dovetail.annotation'),
      areas: [
        {
          fields: [
            {
              key: 'Annotations',
              title: i18n.t('dovetail.annotation'),
              path: ['metadata', 'annotations'],
              render: value => {
                return <KeyValue data={value as Record<string, string>} />;
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
