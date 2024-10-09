import { KitStoreProvider, ModalStack, useMessage } from '@cloudtower/eagle';
import { NotificationProvider, Refine, AccessControlProvider } from '@refinedev/core';
import { History } from 'history';
import { dataProvider, liveProvider, GlobalStore } from 'k8s-api-provider';
import { keyBy } from 'lodash-es';
import React, { useMemo } from 'react';
import { Router } from 'react-router-dom';
import { ResourceCRUD } from './components/ResourceCRUD';
import ConfigsContext from './contexts/configs';
import ConstantsContext from './contexts/constants';
import GlobalStoreContext from './contexts/global-store';
import { routerProvider } from './providers/router-provider';
import { ResourceConfig } from './types';

import './styles.css';

type Props = {
  resourcesConfig: ResourceConfig[];
  schemaUrlPrefix: string;
  useHashUrl?: boolean;
  urlPrefix?: string;
  Layout?: React.FC<unknown>;
  history: History;
  globalStore: GlobalStore;
  accessControlProvider?: AccessControlProvider;
  routerProvider?: any;
};

export const Dovetail: React.FC<Props> = props => {
  const {
    resourcesConfig,
    urlPrefix = '',
    schemaUrlPrefix,
    Layout,
    history,
    globalStore,
    accessControlProvider,
    routerProvider: customRouterProvider,
  } = props;
  const msg = useMessage();

  const notCustomResources = useMemo(() => {
    return resourcesConfig.filter(c => !c.isCustom);
  }, [resourcesConfig]);

  const content = useMemo(() => {
    const _content = (
      <>
        <ModalStack />
        <ResourceCRUD configs={notCustomResources} urlPrefix={urlPrefix} />
        {props.children}
      </>
    );
    if (Layout) {
      return <Layout>{_content}</Layout>;
    }
    return _content;
  }, [Layout, notCustomResources, props.children, urlPrefix]);

  const notificationProvider = useMemo(() => {
    type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';
    const provider: NotificationProvider = {
      open: ({ message, key, type }) => {
        const EXCLUDE = ['getList', 'getOne', 'getMany'];

        if (EXCLUDE.some(excludeKey => key?.includes(excludeKey))) return;

        msg.open({
          content: message,
          key,
          duration: 4.5,
          type: type as NoticeType,
        });
      },
      close: () => undefined,
    };
    return provider;
  }, [msg]);

  return (
    <Router history={history}>
      <KitStoreProvider>
        <GlobalStoreContext.Provider value={{ globalStore }}>
          <ConfigsContext.Provider value={keyBy(resourcesConfig, 'name')}>
            <ConstantsContext.Provider value={{ schemaUrlPrefix }}>
              <Refine
                dataProvider={{
                  default: dataProvider(globalStore),
                }}
                routerProvider={customRouterProvider || routerProvider}
                liveProvider={liveProvider(globalStore)}
                notificationProvider={notificationProvider}
                options={{
                  warnWhenUnsavedChanges: true,
                  liveMode: 'auto',
                  disableTelemetry: true,
                }}
                accessControlProvider={accessControlProvider}
                resources={resourcesConfig.map(c => {
                  return {
                    name: c.name,
                    meta: {
                      resourceBasePath: c.basePath,
                      kind: c.kind,
                      parent: c.parent,
                      label: `${c.kind}s`,
                    },
                    list: `${urlPrefix}/${c.name}`,
                    show: `${urlPrefix}/${c.name}/show`,
                    create: `${urlPrefix}/${c.name}/create`,
                    edit: `${urlPrefix}/${c.name}/edit`,
                  };
                })}
              >
                {content}
              </Refine>
            </ConstantsContext.Provider>
          </ConfigsContext.Provider>
        </GlobalStoreContext.Provider>
      </KitStoreProvider>
    </Router>
  );
};
