export function getApiVersion(resourceBasePath: string): string {
  return resourceBasePath.replace(/^(\/api\/)|(\/apis\/)/, '');
}
