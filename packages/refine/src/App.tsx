import { createBrowserHistory } from 'history';
import { GlobalStore } from 'k8s-api-provider';
import React, { useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Route, Router } from 'react-router-dom';
import { Layout } from './components';
import {
  CRONJOB_INIT_VALUE,
  DAEMONSET_INIT_VALUE,
  POD_INIT_VALUE,
  SERVER_INSTANCE_INIT_VALUE,
  NODE_INIT_VALUE,
} from './constants/k8s';
import { Dovetail } from './Dovetail';
import i18n from './i18n';
import { ConfigMapConfig } from './pages/configmaps';
import { CronJobForm, CronJobList, CronJobShow } from './pages/cronjobs';
import { DaemonSetForm, DaemonSetList, DaemonSetShow } from './pages/daemonsets';
import { DeploymentList, DeploymentShow } from './pages/deployments';
import { IngressConfig } from './pages/ingresses';
import { JobConfig } from './pages/jobs';
import { NetworkPolicyConfig } from './pages/networkPolicies';
import { NodeList, NodeShow } from './pages/nodes';
import { PersistentVolumeClaimConfig } from './pages/persistentvolumeclaims';
import { PersistentVolumeConfig } from './pages/persistentvolumes';
import { PodShow, PodList, PodForm } from './pages/pods';
import { SecretsConfig } from './pages/secrets';
import { ServicesConfig } from './pages/services';
import { StatefulSetConfig } from './pages/statefulsets';
import { StorageClassConfig } from './pages/storageclasses';
import { ProviderPlugins } from './plugins';
import { RESOURCE_GROUP, ResourceConfig, FormContainerType, FormType } from './types';

function App() {
  const history = createBrowserHistory();

  const resourcesConfig = useMemo((): ResourceConfig<any>[] => {
    return [
      {
        name: 'cronjobs',
        basePath: '/apis/batch/v1beta1',
        kind: 'CronJob',
        apiVersion: 'batch/v1beta1',
        parent: RESOURCE_GROUP.WORKLOAD,
        initValue: CRONJOB_INIT_VALUE,
        isCustom: true,
      },
      {
        name: 'daemonsets',
        basePath: '/apis/apps/v1',
        kind: 'DaemonSet',
        apiVersion: 'apps/v1',
        parent: RESOURCE_GROUP.WORKLOAD,
        initValue: DAEMONSET_INIT_VALUE,
        isCustom: true,
      },
      {
        name: 'deployments',
        basePath: '/apis/apps/v1',
        kind: 'Deployment',
        apiVersion: 'apps/v1',
        parent: RESOURCE_GROUP.WORKLOAD,
        formConfig: {
          formType: FormType.YAML,
          formContainerType: FormContainerType.MODAL,
        },
        isCustom: true,
      },
      StatefulSetConfig(i18n),
      {
        name: 'pods',
        basePath: '/api/v1',
        kind: 'Pod',
        apiVersion: 'v1',
        parent: RESOURCE_GROUP.WORKLOAD,
        initValue: POD_INIT_VALUE,
        isCustom: true,
      },
      {
        name: 'nodes',
        basePath: '/api/v1',
        kind: 'Node',
        apiVersion: 'v1',
        parent: RESOURCE_GROUP.WORKLOAD,
        initValue: NODE_INIT_VALUE,
        isCustom: true,
      },
      StorageClassConfig(i18n),
      PersistentVolumeConfig(i18n),
      PersistentVolumeClaimConfig(i18n),
      {
        name: 'serverinstances',
        basePath: '/apis/kubesmart.smtx.io/v1alpha1',
        kind: 'ServerInstance',
        apiVersion: 'kubesmart.smtx.io/v1alpha1',
        parent: RESOURCE_GROUP.NETWORK,
        initValue: SERVER_INSTANCE_INIT_VALUE,
        noShow: true,
        formConfig: {
          formType: FormType.FORM,
          useFormProps: {
            mode: 'onTouched',
          },
          isDisabledChangeMode: true,
          fields: () => [
            {
              path: ['metadata', 'name'],
              key: 'name',
              label: i18n.t('dovetail.name'),
              disabledWhenEdit: true,
              validators: [
                (value: unknown) => {
                  if (!value)
                    return {
                      isValid: false,
                      errorMsg: i18n.t('dovetail.name_can_not_be_empty'),
                    };
                  return { isValid: true, errorMsg: '' };
                },
              ],
            },
            {
              path: ['spec', 'address', 'host'],
              key: 'host',
              label: i18n.t('dovetail.host'),
              disabledWhenEdit: true,
            },
            {
              path: ['spec', 'address', 'port'],
              key: 'port',
              label: i18n.t('dovetail.port'),
              type: 'number',
              disabledWhenEdit: true,
            },
            {
              path: ['spec', 'address', 'credentials', 'ssh', 'username'],
              key: 'username',
              label: i18n.t('dovetail.username'),
            },
            {
              path: ['spec', 'address', 'credentials', 'ssh', 'password'],
              key: 'password',
              label: i18n.t('dovetail.password'),
            },
          ],
        },
      },
      JobConfig(i18n),
      IngressConfig(i18n),
      NetworkPolicyConfig(i18n),
      ConfigMapConfig(i18n),
      SecretsConfig(i18n),
      ServicesConfig(i18n),
    ];
  }, []);

  const globalStore = useMemo(() => {
    const clusterName = import.meta.env.VITE_CLUSTER_NAME || 'clusterName';
    return new GlobalStore(
      {
        apiUrl: `/api/sks-proxy/api/v1/clusters/${clusterName}/proxy`,
        watchWsApiUrl: `api/sks-ws/sks-proxy/api/v1/clusters/${clusterName}/proxy`,
        prefix: 'default',
        plugins: ProviderPlugins,
      },
      ProviderPlugins
    );
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <Dovetail
        resourcesConfig={resourcesConfig}
        Layout={Layout}
        history={history}
        globalStoreMap={{default: globalStore} as any}
        schemaUrlPrefix="/api/sks/api/v1/clusters/sks-mgmt/proxy/openapi/v3"
      >
        <Router history={history}>
          <Route path="/cronjobs" exact>
            <CronJobList />
          </Route>
          <Route path="/cronjobs/show">
            <CronJobShow />
          </Route>
          <Route path="/cronjobs/create">
            <CronJobForm />
          </Route>
          <Route path="/cronjobs/edit">
            <CronJobForm />
          </Route>
          <Route path="/daemonsets" exact>
            <DaemonSetList />
          </Route>
          <Route path="/daemonsets/show">
            <DaemonSetShow />
          </Route>
          <Route path="/daemonsets/create">
            <DaemonSetForm />
          </Route>
          <Route path="/daemonsets/edit">
            <DaemonSetForm />
          </Route>
          <Route path="/deployments" exact>
            <DeploymentList />
          </Route>
          <Route path="/deployments/show">
            <DeploymentShow />
          </Route>
          <Route path="/pods" exact>
            <PodList />
          </Route>
          <Route path="/pods/show">
            <PodShow />
          </Route>
          <Route path="/pods/create">
            <PodForm />
          </Route>
          <Route path="/pods/edit">
            <PodForm />
          </Route>
          <Route path="/nodes" exact>
            <NodeList />
          </Route>
          <Route path="/nodes/show">
            <NodeShow />
          </Route>
        </Router>
      </Dovetail>
    </I18nextProvider>
  );
}

export default App;
