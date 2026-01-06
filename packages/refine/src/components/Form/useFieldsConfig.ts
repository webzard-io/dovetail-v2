import { useList, useShow } from '@refinedev/core';
import { FieldValues } from 'react-hook-form';
import { ResourceModel } from 'src/models';
import { RefineFormConfig, ResourceConfig } from 'src/types';

function useFieldsConfig<Model extends ResourceModel>(
  resourceConfig?: Pick<
    ResourceConfig<Model>,
    'name' | 'displayName' | 'kind' | 'initValue' | 'basePath' | 'formConfig'
  >,
  formConfig?: { fields: RefineFormConfig['fields'] },
  resourceId?: string,
  step?: number,
  customOptions?: Record<string, unknown>,
  transformedInitValues?: FieldValues
) {
  const action = resourceId ? 'edit' : 'create';
  const listQuery = useList<Model>({
    resource: resourceConfig?.name,
    meta: { resourceBasePath: resourceConfig?.basePath, kind: resourceConfig?.kind },
    pagination: {
      mode: 'off',
    },
  });
  const showQuery = useShow<Model>({
    resource: resourceConfig?.name,
    meta: { resourceBasePath: resourceConfig?.basePath, kind: resourceConfig?.kind },
    id: resourceId,
  });

  return formConfig?.fields?.({
    record: showQuery.queryResult.data?.data,
    records: listQuery.data?.data || [],
    action,
    step: step || 0,
    customOptions: customOptions || {},
    transformedInitValues: transformedInitValues || {},
  });
}

export default useFieldsConfig;
