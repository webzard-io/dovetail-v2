import { createBrowserHistory } from 'history';
import { GlobalStore } from 'k8s-api-provider';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Router } from 'react-router-dom';
import { Layout } from './components';
import {
  CRONJOB_INIT_VALUE,
  DAEMONSET_INIT_VALUE,
  STATEFULSET_INIT_VALUE,
  POD_INIT_VALUE,
} from './constants/k8s';
import { Dovetail } from './Dovetail';
import { ConfigMapConfig } from './pages/configmaps';
import { CronJobForm, CronJobList, CronJobShow } from './pages/cronjobs';
import { DaemonSetForm, DaemonSetList, DaemonSetShow } from './pages/daemonsets';
import { DeploymentForm, DeploymentList, DeploymentShow } from './pages/deployments';
import { JobConfig } from './pages/jobs';
import { PodShow, PodList, PodForm } from './pages/pods';
import { SecretsConfig } from './pages/secrets';
import { ServicesConfig } from './pages/services';
import { StatefulSetShow, StatefulSetList, StatefulSetForm } from './pages/statefulsets';
import { ProviderPlugins } from './plugins';
import { RESOURCE_GROUP, ResourceConfig, FormType } from './types';

function App() {
  const { t } = useTranslation();
  const histroy = createBrowserHistory();

  const resourcesConfig = useMemo(() => {
    return [
      {
        name: 'cronjobs',
        basePath: '/apis/batch/v1beta1',
        kind: 'CronJob',
        parent: RESOURCE_GROUP.WORKLOAD,
        label: 'CronJobs',
        initValue: CRONJOB_INIT_VALUE,
        isCustom: true,
      },
      {
        name: 'daemonsets',
        basePath: '/apis/apps/v1',
        kind: 'DaemonSet',
        parent: RESOURCE_GROUP.WORKLOAD,
        label: 'DaemonSets',
        initValue: DAEMONSET_INIT_VALUE,
        isCustom: true,
      },
      {
        name: 'deployments',
        basePath: '/apis/apps/v1',
        kind: 'Deployment',
        parent: RESOURCE_GROUP.WORKLOAD,
        label: 'Deployments',
        formType: FormType.MODAL,
        FormModal: DeploymentForm,
        isCustom: true,
      },
      {
        name: 'statefulsets',
        basePath: '/apis/apps/v1',
        kind: 'StatefulSet',
        parent: RESOURCE_GROUP.WORKLOAD,
        label: 'StatefulSets',
        initValue: STATEFULSET_INIT_VALUE,
        isCustom: true,
      },
      {
        name: 'pods',
        basePath: '/api/v1',
        kind: 'Pod',
        parent: RESOURCE_GROUP.WORKLOAD,
        label: 'Pods',
        initValue: POD_INIT_VALUE,
        isCustom: true,
      },
      JobConfig,
      ConfigMapConfig,
      SecretsConfig,
      ServicesConfig,
    ];
  }, []);

  const refineResources = useMemo(() => {
    return [
      {
        name: t('dovetail.cluster'),
        identifier: RESOURCE_GROUP.CLUSTER,
      },
      {
        name: t('dovetail.workload'),
        identifier: RESOURCE_GROUP.WORKLOAD,
      },
      {
        name: t('dovetail.network'),
        identifier: RESOURCE_GROUP.NETWORK,
      },
      {
        name: t('dovetail.storage'),
        identifier: RESOURCE_GROUP.STORAGE,
      },
    ];
  }, [t]);
  const globalStore = useMemo(() => {
    return new GlobalStore(
      {
        apiUrl: '/api/k8s',
        watchWsApiUrl: 'api/sks-ws/k8s',
        prefix: 'default',
      },
      ProviderPlugins
    );
  }, []);
  return (
    <Dovetail
      resourcesConfig={resourcesConfig as ResourceConfig[]}
      refineResources={refineResources}
      Layout={Layout}
      history={histroy}
      globalStore={globalStore}
    >
      <Router history={histroy}>
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
        <Route path="/statefulsets" exact>
          <StatefulSetList />
        </Route>
        <Route path="/statefulsets/show">
          <StatefulSetShow />
        </Route>
        <Route path="/statefulsets/create">
          <StatefulSetForm />
        </Route>
        <Route path="/statefulsets/edit">
          <StatefulSetForm />
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
      </Router>
    </Dovetail>
  );
}

export default App;
