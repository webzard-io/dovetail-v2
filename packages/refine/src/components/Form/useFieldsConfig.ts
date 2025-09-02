import { useList, useShow } from '@refinedev/core';
import { ResourceModel } from 'src/models';
import { RefineFormConfig, ResourceConfig } from 'src/types';

function useFieldsConfig<Model extends ResourceModel>(
  config?: ResourceConfig<Model>,
  formConfig?: { fields: RefineFormConfig['fields'] },
  resourceId?: string,
  step?: number
) {
  const action = resourceId ? 'edit' : 'create';
  const listQuery = useList<Model>({
    resource: config?.name,
    meta: { resourceBasePath: config?.basePath, kind: config?.kind },
    pagination: {
      mode: 'off',
    },
  });
  const showQuery = useShow<Model>({
    resource: config?.name,
    meta: { resourceBasePath: config?.basePath, kind: config?.kind },
    id: resourceId,
  });

  return formConfig?.fields?.({
    record: showQuery.queryResult.data?.data,
    records: listQuery.data?.data || [],
    action,
    step: step || 0,
  });
}

export default useFieldsConfig;
