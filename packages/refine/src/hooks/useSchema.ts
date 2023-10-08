import { useResource, type IResourceItem } from '@refinedev/core';
import { JSONSchema7 } from 'json-schema';
import { useState, useEffect, useMemo } from 'react';
import OpenAPI from 'src/utils/openapi';

type useSchemaOptions = {
  resource?: IResourceItem;
}

export function useSchema(options?: useSchemaOptions): JSONSchema7 | null {
  const [schema, setSchema] = useState<JSONSchema7 | null>(null);
  const useResourceResult = useResource();
  const resource = options?.resource || useResourceResult.resource;
  const openapi = useMemo(
    () => new OpenAPI(resource?.meta?.resourceBasePath),
    [resource?.meta?.resourceBasePath]
  );

  useEffect(() => {
    (async function () {
      const schema = await openapi.findSchema(resource?.meta?.kind);

      setSchema(schema || null);
    })();
  }, [resource, openapi]);

  return schema;
}
