import { useResource, type IResourceItem } from '@refinedev/core';
import { JSONSchema7 } from 'json-schema';
import { useState, useEffect, useMemo } from 'react';
import OpenAPI from 'src/utils/openapi';

type UseSchemaOptions = {
  resource?: IResourceItem;
}

type UseSchemaResult = {
  schema: JSONSchema7 | null;
  loading: boolean;
  error: Error | null;
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

  useEffect(() => {
    (async function () {
      setLoading(true);
      setError(null);
      try {
        const schema = await openapi.findSchema(resource?.meta?.kind);

        setSchema(schema || null);
      } catch(e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, [resource, openapi]);

  return {
    schema,
    loading,
    error,
  };
}
