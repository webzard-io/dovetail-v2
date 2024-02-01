import React from 'react';
import { Route } from 'react-router-dom';
import { ResourceConfig } from '../../types';
import { DrawerShow } from '../DrawerShow';
import { ResourceForm } from './create';
import { ResourceList } from './list';
import { ResourceShow } from './show';

type Props = { configs: ResourceConfig[]; urlPrefix?: string };
export const ResourceCRUD: React.FC<Props> = props => {
  const { configs, urlPrefix } = props;

  return (
    <>
      {configs.map(config => {
        const listPath = `${urlPrefix}/${config.name}`;
        const showPath = `${listPath}/show`;
        const editPath = `${listPath}/edit`;
        const createPath = `${listPath}/create`;
        const listEle = (
          <ResourceList
            name={config.kind}
            formatter={config.formatter}
            columns={config.columns?.() || []}
            Dropdown={config.Dropdown}
          >
            {config.isDrawerShowMode ? (
              <DrawerShow
                drawerProps={config.drawerProps}
                fieldGroups={config.showFields?.() || []}
              />
            ) : null}
          </ResourceList>
        );

        let listRoute = (
          <Route path={`${urlPrefix}/${config.name}`} exact>
            {listEle}
          </Route>
        );

        let showRoute: JSX.Element | undefined = (
          <Route path={showPath}>
            <ResourceShow
              formatter={config.formatter}
              filedGroups={config.showFields?.() || []}
              Dropdown={config.Dropdown}
            />
          </Route>
        );

        if (config.isDrawerShowMode) {
          const path = [`${urlPrefix}/${config.name}`, showPath];
          listRoute = (
            <Route path={path} exact>
              {listEle}
            </Route>
          );
          showRoute = undefined;
        }

        return (
          <React.Fragment key={config.name}>
            {listRoute}
            {showRoute}
            <Route path={createPath}>
              <ResourceForm config={config} />
            </Route>
            <Route path={editPath}>
              <ResourceForm config={config} />
            </Route>
          </React.Fragment>
        );
      })}
    </>
  );
};
