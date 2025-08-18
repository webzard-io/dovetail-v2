import { i18n as I18nType } from 'i18next';
import React from 'react';
import { PodLog } from 'src/components/PodLog';
import {
  ResourceModel,
  PodModel,
} from 'src/models';
import {
  ShowTab,
  EventsTableTabField,
} from './fields';

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

export const PodLogTab = <Model extends PodModel>(i18n: I18nType, apiUrl: string): ShowTab<Model> => ({
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
