import { KitStoreProvider, ModalStack } from '@cloudtower/eagle';
import { Refine, ResourceProps } from '@refinedev/core';
import { History } from 'history';
import {
  dataProvider,
  liveProvider,
  GlobalStore,
} from 'k8s-api-provider';
import React, { useMemo } from 'react';
import { Router } from 'react-router-dom';
import ModalContextProvider from 'src/components/ModalContextProvider';
import { ResourceCRUD } from './components/ResourceCRUD';
import GlobalStoreContext from './contexts/global-store';
import { routerProvider } from './providers/router-provider';
import './i18n';

import './styles.css';

import { ResourceConfig } from './types';

type Props = {
  resourcesConfig: ResourceConfig[];
  useHashUrl?: boolean;
  urlPrefix?: string;
  refineResources?: ResourceProps[];
  Layout?: React.FC<unknown>;
  history: History;
  globalStore: GlobalStore;
};

export const Dovetail: React.FC<Props> = props => {
  const { resourcesConfig, urlPrefix = '', Layout, history, globalStore } = props;

  const notCustomResources = useMemo(() => {
    return resourcesConfig.filter(c => !c.isCustom);
  }, [resourcesConfig]);

  const content = useMemo(() => {
    const _content = (
      <>
        <ResourceCRUD configs={notCustomResources} urlPrefix={urlPrefix} />
        {props.children}
        <ModalStack></ModalStack>
      </>
    );
    if (Layout) {
      return <Layout>{_content}</Layout>;
    }
    return _content;
  }, [Layout, notCustomResources, props.children, urlPrefix]);

  return (
    <Router history={history}>
      <KitStoreProvider>
        <ModalContextProvider>
          <GlobalStoreContext.Provider value={{ globalStore }}>
            <Refine
              dataProvider={{
                default: dataProvider(globalStore),
              }}
              routerProvider={routerProvider}
              liveProvider={liveProvider(globalStore)}
              options={{
                warnWhenUnsavedChanges: true,
                liveMode: 'auto',
              }}
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
          </GlobalStoreContext.Provider>
        </ModalContextProvider>
      </KitStoreProvider>
    </Router>
  );
};
