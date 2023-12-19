import { useResource, type IResourceItem } from '@refinedev/core';
import { JSONSchema7 } from 'json-schema';
import { useState, useEffect, useMemo, useCallback } from 'react';
import OpenAPI from 'src/utils/openapi';

type UseSchemaOptions = {
  resource?: IResourceItem;
  skip?: boolean;
}

type UseSchemaResult = {
  schema: JSONSchema7 | null;
  loading: boolean;
  error: Error | null;
  fetchSchema: ()=> void;
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
      const schema = await openapi.findSchema(resource?.meta?.kind);

      setSchema(schema || null);
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [resource, openapi]);

  useEffect(() => {
    if (options?.skip) return;

    fetchSchema();
  }, [fetchSchema]);

  return {
    schema,
    loading,
    error,
    fetchSchema,
  };
}
