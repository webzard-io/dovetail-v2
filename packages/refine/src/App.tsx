import { initParrotI18n } from '@cloudtower/eagle';
import { Refine } from '@refinedev/core';
import { dataProvider, liveProvider, GlobalStore } from 'k8s-api-provider';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ConfigmapForm, ConfigmapList, ConfigmapShow } from './pages/configmap';
import { DeploymentForm, DeploymentList, DeploymentShow } from './pages/deployments';
import { JobShow, JobList, JobForm } from './pages/jobs';
import { StatefulSetShow, StatefulSetList, StatefulSetForm } from './pages/statefulSets';
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
            name: 'WorkLoad',
          },
          {
            name: 'deployments',
            meta: {
              resourceBasePath: '/apis/apps/v1',
              kind: 'Deployment',
              parent: 'WorkLoad',
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
              parent: 'WorkLoad',
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
              parent: 'WorkLoad',
            },
            list: '/statefulsets',
            show: '/statefulsets/show',
            create: '/statefulsets/create',
            edit: '/statefulsets/edit',
          },
          {
            name: 'Core',
          },
          {
            name: 'configmaps',
            meta: {
              resourceBasePath: '/api/v1',
              kind: 'ConfigMap',
              parent: 'Core',
            },
            list: '/configmaps',
            show: '/configmaps/show',
            create: '/configmaps/create',
            edit: '/configmaps/edit',
          },
        ]}
      >
        <Layout>
          <Switch>
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

            <Route path="/configmaps" exact>
              <ConfigmapList />
            </Route>
            <Route path="/configmaps/show">
              <ConfigmapShow />
            </Route>
            <Route path="/configmaps/create">
              <ConfigmapForm />
            </Route>
            <Route path="/configmaps/edit">
              <ConfigmapForm />
            </Route>
          </Switch>
        </Layout>
      </Refine>
    </BrowserRouter>
  );
}

export default App;
