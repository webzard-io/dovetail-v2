import { Loading, useMessage } from '@cloudtower/eagle';
import { useNavigation, useParsed, useResource, useShow } from '@refinedev/core';
import React, { useContext, useEffect, useMemo } from 'react';
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
  const msg = useMessage();
  const { resource } = useResource();
  const configs = useContext(ConfigsContext);
  const config = configs[resource?.name || ''];
  const nav = useNavigation();
  const i18n = useTranslation();
  const notExistMsg = useMemo(
    () => ({
      key: 'resource-non-exist',
      message: i18n.t('dovetail.fail_get_detail', {
        resource: config.displayName || resource?.name,
        name: parsed?.params?.id,
        interpolation: { escapeValue: false },
      }),
      description: 'Error',
      type: 'error' as const,
    }),
    [config.displayName, i18n, parsed, resource?.name]
  );
  const { queryResult } = useShow({
    id: parsed?.params?.id,
    queryOptions: {
      retry: 1,
    },
    errorNotification: () => {
      return notExistMsg;
    },
  });

  const { isLoading, isError } = queryResult;

  useEffect(() => {
    const isNotExist =
      !isLoading &&
      parsed.params?.uid !== undefined &&
      parsed.params?.uid !== queryResult.data?.data.metadata.uid;

    // go back to list, when fail to fetch detail
    if ((isError || isNotExist) && resource) {
      if (isNotExist) {
        msg.open({
          content: notExistMsg.message,
          duration: 4.5,
          ...notExistMsg,
        });
      }
      nav.list(resource);
    }
  }, [isError, nav, resource, queryResult, parsed, msg, notExistMsg, isLoading]);

  return isLoading ? <Loading /> : <ShowContent {...props} />;
};
