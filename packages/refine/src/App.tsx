import { ErrorComponent, GitHubBanner, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerBindings, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { dataProvider } from "./providers/k8s-data-provider";
import { GlobalStore } from "./providers/k8s-data-provider/global-store";
import { liveProvider } from "./providers/k8s-live-provider";
import {
  DeploymentCreate,
  DeploymentList,
} from "./pages/deployments";

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
      <RefineKbarProvider>
        <Refine
          dataProvider={{
            default: dataProvider(globalStore),
          }}
          liveProvider={liveProvider(globalStore)}
          routerProvider={routerBindings}
          options={{
            syncWithLocation: true,
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
          ]}
        >
          <Routes>
            <Route
              element={
                <Layout>
                  <Outlet />
                </Layout>
              }
            >
              <Route
                index
                element={<NavigateToResource resource="deployments" />}
              />

              <Route path="deployments">
                <Route index element={<DeploymentList />} />
                <Route
                  path="create"
                  element={<DeploymentCreate />}
                />
              </Route>
            </Route>
          </Routes>
          <RefineKbar />
          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
        </Refine>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
