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
              <ResourceList config={config} />
            </Route>
            {!config.noShow ? (
              <Route path={`${urlPrefix}/${config.name}/show`}>
                <ResourceShow config={config} />
              </Route>
            ) : null}
            {
              // the modals would render in ModalStack
              config.formConfig?.formType === FormType.PAGE ? (
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
