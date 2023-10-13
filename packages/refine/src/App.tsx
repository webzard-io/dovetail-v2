import { initParrotI18n } from '@cloudtower/eagle';
import { Refine } from '@refinedev/core';
import { dataProvider, liveProvider, GlobalStore } from 'k8s-api-provider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ConfigmapForm, ConfigmapList, ConfigmapShow } from './pages/configmap';
import { CronJobForm, CronJobList, CronJobShow } from './pages/cronjobs';
import { DaemonSetForm, DaemonSetList, DaemonSetShow } from './pages/daemonsets';
import { DeploymentForm, DeploymentList, DeploymentShow } from './pages/deployments';
import { JobShow, JobList, JobForm } from './pages/jobs';
import { PodShow, PodList, PodForm } from './pages/pods';
import { StatefulSetShow, StatefulSetList, StatefulSetForm } from './pages/statefulsets';
import { routerProvider } from './providers/router-provider';

import './styles.css';
import 'antd/dist/antd.css';
import '@cloudtower/eagle/dist/style.css';

initParrotI18n();

const globalStore = new GlobalStore({
  apiUrl: '/api/k8s',
  watchWsApiUrl: 'api/sks-ws/k8s',
  prefix: 'default',
});

function App() {
  const { t } = useTranslation();
  return (
    <BrowserRouter>
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
        resources={[
          {
            name: t('dovetail.workload'),
          },
          {
            name: 'cronjobs',
            meta: {
              // TODO: dynamic load base path from API schema
              resourceBasePath: '/apis/batch/v1beta1',
              kind: 'CronJob',
              parent: t('dovetail.workload'),
              label: 'CronJobs',
            },
            list: '/cronjobs',
            show: '/cronjobs/show',
            create: '/cronjobs/create',
            edit: '/cronjobs/edit',
          },
          {
            name: 'daemonsets',
            meta: {
              resourceBasePath: '/apis/apps/v1',
              kind: 'DaemonSet',
              parent: t('dovetail.workload'),
              label: 'DaemonSets',
            },
            list: '/daemonsets',
            show: '/daemonsets/show',
            create: '/daemonsets/create',
            edit: '/daemonsets/edit',
          },
          {
            name: 'deployments',
            meta: {
              resourceBasePath: '/apis/apps/v1',
              kind: 'Deployment',
              parent: t('dovetail.workload'),
            },
            list: '/deployments',
            show: '/deployments/show',
            create: '/deployments/create',
            edit: '/deployments/edit',
          },
          {
            name: 'jobs',
            meta: {
              resourceBasePath: '/apis/batch/v1',
              kind: 'Job',
              parent: t('dovetail.workload'),
            },
            list: '/jobs',
            show: '/jobs/show',
            create: '/jobs/create',
            edit: '/jobs/edit',
          },
          {
            name: 'statefulsets',
            meta: {
              resourceBasePath: '/apis/apps/v1',
              kind: 'StatefulSet',
              parent: t('dovetail.workload'),
              label: 'StatefulSets',
            },
            list: '/statefulsets',
            show: '/statefulsets/show',
            create: '/statefulsets/create',
            edit: '/statefulsets/edit',
          },
          {
            name: 'pods',
            meta: {
              resourceBasePath: '/api/v1',
              kind: 'Pod',
              parent: t('dovetail.workload'),
              label: 'Pods',
            },
            list: '/pods',
            show: '/pods/show',
            create: '/pods/create',
            edit: '/pods/edit',
          },
          {
            name: 'Core',
          },
        ]}
      >
        <Layout>
          <Switch>
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
            <Route path="/deployments/create">
              <DeploymentForm />
            </Route>
            <Route path="/deployments/edit">
              <DeploymentForm />
            </Route>

            <Route path="/jobs" exact>
              <JobList />
            </Route>
            <Route path="/jobs/show">
              <JobShow />
            </Route>
            <Route path="/jobs/create">
              <JobForm />
            </Route>
            <Route path="/jobs/edit">
              <JobForm />
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
          </Switch>
        </Layout>
      </Refine>
    </BrowserRouter>
  );
}

export default App;
