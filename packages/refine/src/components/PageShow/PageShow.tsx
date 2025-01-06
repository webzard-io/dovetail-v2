import { Loading } from '@cloudtower/eagle';
import { useNavigation, useParsed, useResource, useShow } from '@refinedev/core';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigsContext } from 'src/contexts';
import { ResourceModel } from '../../models';
import { ShowContent, ShowConfig } from '../ShowContent';

type Props<Model extends ResourceModel> = {
  showConfig: ShowConfig<Model>;
  formatter?: (r: Model) => Model;
  Dropdown?: React.FC<{ record: Model }>;
};

export const PageShow = <Model extends ResourceModel>(props: Props<Model>) => {
  const parsed = useParsed();
  const { resource } = useResource();
  const configs = useContext(ConfigsContext);
  const config = configs[resource?.name || ''];
  const nav = useNavigation();
  const i18n = useTranslation();
  const { queryResult } = useShow({
    id: parsed?.params?.id,
    queryOptions: {
      retry: 1,
    },
    errorNotification: () => {
      return {
        key: 'resource-non-exist',
        message: i18n.t('dovetail.fail_get_detail', {
          resource: config.displayName || resource?.name,
          name: parsed?.params?.id,
          interpolation: { escapeValue: false },
        }),
        description: 'Error',
        type: 'error',
      };
    },
  });

  const { isLoading, isError } = queryResult;

  useEffect(() => {
    // go back to list, when fail to fetch detail
    if (isError && resource) {
      nav.list(resource);
    }
  }, [isError, nav, resource]);

  return isLoading ? <Loading /> : <ShowContent {...props} />;
};
