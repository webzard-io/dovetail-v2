import { useResource, type IResourceItem } from '@refinedev/core';
import { JSONSchema7 } from 'json-schema';
import { useState, useEffect, useCallback, useMemo } from 'react';
import OpenAPI from 'src/utils/openapi';

type UseSchemaOptions = {
  resource?: IResourceItem;
  skip?: boolean;
};

type UseSchemaResult = {
  schema: JSONSchema7 | null;
  loading: boolean;
  error: Error | null;
  fetchSchema: () => void;
};

export function useApiGroupSchema() {
  const [state, setState] = useState<{
    schemas: JSONSchema7[] | null;
    schemasMap: Record<string, JSONSchema7[]>;
    loading: boolean;
    error: Error | null;
  }>({
    schemas: null,
    schemasMap: {},
    loading: false,
    error: null,
  });

  const fetchSchema = useCallback(async (apiGroups: string[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const results = await Promise.all(
        apiGroups.map(async (apiGroup) => {
          if (state.schemasMap[apiGroup]) {
            return { apiGroup, schemas: state.schemasMap[apiGroup] };
          }
          const openapi = new OpenAPI(apiGroup);
          const groupSchemas = await openapi.fetch();
          return { apiGroup, schemas: groupSchemas || [] };
        })
      );

      const newSchemasMap = results.reduce((acc, { apiGroup, schemas }) => {
        acc[apiGroup] = schemas;
        return acc;
      }, {} as Record<string, JSONSchema7[]>);

      const allSchemas = results.flatMap(({ schemas }) => schemas);

      setState({
        schemas: allSchemas,
        schemasMap: newSchemasMap,
        loading: false,
        error: null,
      });
    } catch (e) {
      setState(prev => ({ ...prev, loading: false, error: e as Error }));
    }
  }, [state.schemasMap]);

  return { ...state, fetchSchema };
}

export function useSchema(options?: UseSchemaOptions): UseSchemaResult {
  const [schema, setSchema] = useState<JSONSchema7 | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const useResourceResult = useResource();
  const resource = options?.resource || useResourceResult.resource;
  const openapi = useMemo(
    () => new OpenAPI(resource?.meta?.resourceBasePath),
    [resource?.meta?.resourceBasePath]
  );

  const fetchSchema = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await openapi.fetch();
      const schema = await openapi.findSchema(resource?.meta?.kind);

      setSchema(schema || null);
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [resource?.meta?.kind, openapi]);

  useEffect(() => {
    if (options?.skip) return;

    fetchSchema();
  }, [fetchSchema, options?.skip]);

  return {
    schema,
    loading,
    error,
    fetchSchema,
  };
}
