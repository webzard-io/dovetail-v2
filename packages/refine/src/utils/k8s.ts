import { BaseRecord } from '@refinedev/core';

export function getApiVersion(resourceBasePath: string): string {
  return resourceBasePath.replace(/^(\/api\/)|(\/apis\/)/, '');
}

export function pruneBeforeEdit(v: BaseRecord) {
  delete v.id;
  if (v.metadata) {
    delete v.metadata.relations;
  }
}
