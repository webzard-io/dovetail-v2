import { BaseRecord } from '@refinedev/core';

export function getApiVersion(resourceBasePath: string): string {
  return resourceBasePath.replace(/^(\/api\/)|(\/apis\/)/, '');
}

export function pruneBeforeEdit(v: BaseRecord) {
  delete v.id;
  delete v.metadata?.managedFields;
  if (v.metadata?.annotations) {
    delete v.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'];
  }
}
