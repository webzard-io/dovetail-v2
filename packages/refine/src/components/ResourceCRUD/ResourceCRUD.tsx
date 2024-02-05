import React from 'react';
import { Route } from 'react-router-dom';
import { ResourceConfig, FormType } from 'src/types';
import { ResourceForm } from './create';
import { ResourceList } from './list';
import { ResourceShow } from './show';

type Props = { configs: ResourceConfig[]; urlPrefix?: string };

export function ResourceCRUD(props: Props) {
  const { configs, urlPrefix } = props;

  return (
    <>
      {configs.map(config => {
        return (
          <React.Fragment key={config.name}>
            <Route path={`${urlPrefix}/${config.name}`} exact>
              <ResourceList
                name={config.kind}
                formatter={config.formatter}
                columns={config.columns?.() || []}
                Dropdown={config.Dropdown}
              />
            </Route>
            <Route path={`${urlPrefix}/${config.name}/show`}>
              <ResourceShow
                formatter={config.formatter}
                filedGroups={config.showFields?.() || []}
                Dropdown={config.Dropdown}
              />
            </Route>
            {
              // the modals would render in ModalStack
              config.formType === FormType.PAGE ? (
                <>
                  <Route path={`${urlPrefix}/${config.name}/create`}>
                    <ResourceForm config={config} />
                  </Route>
                  <Route path={`${urlPrefix}/${config.name}/edit`}>
                    <ResourceForm config={config} />
                  </Route>
                </>
              ) : null

            }
          </React.Fragment>
        );
      })}
    </>
  );
}
