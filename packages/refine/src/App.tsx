import { ErrorComponent, GitHubBanner, Refine } from "@refinedev/core";

import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Layout } from "./components/Layout";
import { dataProvider } from "./providers/k8s-data-provider";
import { GlobalStore } from "./providers/k8s-data-provider/global-store";
import { liveProvider } from "./providers/k8s-live-provider";
import { routerProvider } from './providers/router-provider';
import {
  DeploymentCreate,
  DeploymentList,
} from "./pages/deployments";
import {
  ConfigmapForm,
  ConfigmapList,
} from './pages/configmap';

import "./App.css";
import 'antd/dist/antd.css';
import '@cloudtower/eagle/dist/style.css';

const globalStore = new GlobalStore({
  apiUrl: "/api/k8s",
  watchApiUrl: 'api/sks-ws/k8s'
});

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

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
          liveMode: "auto",
        }}
        resources={[
          {
            name: "deployments",
            meta: {
              resourceBasePath: "/apis/apps/v1",
              kind: "Deployment",
            },
            list: "/deployments",
            show: "/deployments/show/:id",
            create: "/deployments/create",
            edit: "/deployments/edit/:id",
          },
          {
            name: "configmaps",
            meta: {
              resourceBasePath: "/api/v1",
              kind: "ConfigMap",
            },
            list: "/configmaps",
            show: "/configmaps/show/:id",
            create: "/configmaps/create",
            edit: "/configmaps/edit",
          },
        ]}
      >
        <Layout>
          <Switch>
            <Route path="/deployments" exact>
              <DeploymentList />
            </Route>
            <Route
              path="/deployments/create"
            >
              <DeploymentCreate />
            </Route>

            <Route path="/configmaps" exact>
              <ConfigmapList />
            </Route>
            <Route
              path="/configmaps/create"
            >
              <ConfigmapForm />
            </Route>
            <Route
              path="/configmaps/edit"
            >
              <ConfigmapForm />
            </Route>
          </Switch>
        </Layout>
      </Refine>
    </BrowserRouter >
  );
}

export default App;
