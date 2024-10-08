import { BaseRecord } from '@refinedev/core';

export function getApiVersion(resourceBasePath: string): string {
  console.log('resourceBasePath', resourceBasePath);
  return resourceBasePath.replace(/^(\/api\/)|(\/apis\/)/, '');
}

export function pruneBeforeEdit(v: BaseRecord) {
  delete v.id;
  delete v.metadata.relations;
}
