import { createBrowserHistory } from 'history';
import { GlobalStore } from 'k8s-api-provider';
import React, { useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Route, Router } from 'react-router-dom';
import { YamlFormProps, Layout, YamlForm } from './components';
import {
  CRONJOB_INIT_VALUE,
  DAEMONSET_INIT_VALUE,
  DEPLOYMENT_INIT_VALUE,
  POD_INIT_VALUE,
  SERVER_INSTANCE_INIT_VALUE,
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
import { PodShow, PodList, PodForm } from './pages/pods';
import { SecretsConfig } from './pages/secrets';
import { ServicesConfig } from './pages/services';
import { StatefulSetConfig } from './pages/statefulsets';
import { ProviderPlugins } from './plugins';
import { RESOURCE_GROUP, ResourceConfig, FormType } from './types';

function App() {
  const history = createBrowserHistory();

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
        formConfig: {
          formType: FormType.MODAL,
          renderForm: (formProps: YamlFormProps) => (
            <YamlForm
              {...formProps}
              initialValues={DEPLOYMENT_INIT_VALUE}
              isShowLayout={false}
            />
          ),
        },
        isCustom: true,
      },
      StatefulSetConfig(i18n),
      {
        name: 'pods',
        basePath: '/api/v1',
        kind: 'Pod',
        parent: RESOURCE_GROUP.WORKLOAD,
        label: 'Pods',
        initValue: POD_INIT_VALUE,
        isCustom: true,
      },
      {
        name: 'serverinstances',
        basePath: '/apis/kubesmart.smtx.io/v1alpha1',
        kind: 'ServerInstance',
        parent: RESOURCE_GROUP.NETWORK,
        label: 'ServerInstanceList',
        initValue: SERVER_INSTANCE_INIT_VALUE,
        formConfig: {
          fields: [
            {
              path: ['metadata', 'name'],
              key: 'name',
              label: i18n.t('dovetail.name'),
              validators: [
                (value: string) => {
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
            },
            {
              path: ['spec', 'address', 'port'],
              key: 'port',
              label: i18n.t('dovetail.port'),
              type: 'number',
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
        noShow: true,
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
    <I18nextProvider i18n={i18n}>
      <Dovetail
        resourcesConfig={resourcesConfig as ResourceConfig[]}
        Layout={Layout}
        history={history}
        globalStore={globalStore}
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
        </Router>
      </Dovetail>
    </I18nextProvider>
  );
}

export default App;
