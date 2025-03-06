import {
  ConfigProvider,
  KitStoreProvider,
  ModalStack,
  useMessage,
} from '@cloudtower/eagle';
import { NotificationProvider, Refine, RefineProps } from '@refinedev/core';
import { History } from 'history';
import { dataProvider, liveProvider, GlobalStore } from 'k8s-api-provider';
import { keyBy } from 'lodash-es';
import React, { useEffect, useMemo } from 'react';
import { Router } from 'react-router-dom';
import { ResourceCRUD } from './components/ResourceCRUD';
import ConfigsContext from './contexts/configs';
import ConstantsContext from './contexts/constants';
import GlobalStoreContext from './contexts/global-store';
import { routerProvider } from './providers';
import { ResourceConfig } from './types';

import './styles.css';

type Props = {
  resourcesConfig: ResourceConfig[];
  schemaUrlPrefix: string;
  useHashUrl?: boolean;
  urlPrefix?: string;
  Layout?: React.FC<unknown>;
  history: History;
  globalStore: Record<string, GlobalStore>;
  antdGetPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
} & Partial<RefineProps>;

export const Dovetail: React.FC<Props> = props => {
  const {
    resourcesConfig,
    urlPrefix = '',
    schemaUrlPrefix,
    Layout,
    history,
    globalStore,
    accessControlProvider,
    antdGetPopupContainer,
  } = props;
  const msg = useMessage();

  useEffect(() => {
    msg.config({ getContainer: antdGetPopupContainer });
  }, [msg, antdGetPopupContainer]);

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
        <ConfigsContext.Provider value={keyBy(resourcesConfig, 'name')}>
          <ConstantsContext.Provider value={{ schemaUrlPrefix }}>
            <ConfigProvider
              antd5Configs={{
                getPopupContainer: antdGetPopupContainer || (() => document.body),
              }}
              antd4Configs={{
                getPopupContainer: antdGetPopupContainer || (() => document.body),
              }}
            >
              <GlobalStoreContext.Provider value={{ globalStore: globalStore.default }}>
                <Refine
                  dataProvider={{
                    default: dataProvider(globalStore.default),
                    tenant: dataProvider(globalStore.tenant),
                  }}
                  liveProvider={liveProvider(globalStore.default)}
                  routerProvider={routerProvider}
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
                        dataProviderName: c.dataProviderName,
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
                  {...props}
                >
                  {content}
                </Refine>
              </GlobalStoreContext.Provider>
            </ConfigProvider>
          </ConstantsContext.Provider>
        </ConfigsContext.Provider>
      </KitStoreProvider>
    </Router>
  );
};
