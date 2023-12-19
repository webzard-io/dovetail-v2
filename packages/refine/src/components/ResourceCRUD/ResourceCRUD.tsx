import { ResourceModel } from 'k8s-api-provider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route } from 'react-router-dom';
import { ResourceConfig, Resource } from '../../types';
import { ResourceForm } from './create';
import { ResourceList } from './list';
import { ResourceShow } from './show';

type Props = { configs: ResourceConfig[]; urlPrefix?: string };
export const ResourceCRUD: React.FC<Props> = props => {
  const { configs, urlPrefix } = props;
  const { i18n } = useTranslation();
  return (
    <>
      {configs.map(config => {
        // const formatter = config.formatter || ((v: Resource) => new ResourceModel(v));
        const formatter = (v: Resource) => v as ResourceModel;
        return (
          <React.Fragment key={config.name}>
            <Route path={`${urlPrefix}/${config.name}`} exact>
              <ResourceList
                name={config.kind}
                formatter={formatter}
                columns={config.columns?.(i18n) || []}
                Dropdown={config.Dropdown}
              />
            </Route>
            <Route path={`${urlPrefix}/${config.name}/show`}>
              <ResourceShow
                formatter={formatter}
                filedGroups={config.showFields?.(i18n) || []}
                Dropdown={config.Dropdown}
              />
            </Route>
            <Route path={`${urlPrefix}/${config.name}/create`}>
              <ResourceForm config={config} />
            </Route>
            <Route path={`${urlPrefix}/${config.name}/edit`}>
              <ResourceForm config={config} />
            </Route>
          </React.Fragment>
        );
      })}
    </>
  );
};
