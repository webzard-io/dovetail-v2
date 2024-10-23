import OpenAPI from 'src/utils/openapi';

class SchemaStore {
  private openapiMap: Record<string, OpenAPI> = {};

  async fetchSchemas(resourceBasePath: string, pathPrefix: string) {
    const openapi = this.openapiMap[`${resourceBasePath}-${pathPrefix}`] || new OpenAPI(resourceBasePath, pathPrefix);
    this.openapiMap[`${resourceBasePath}-${pathPrefix}`] = openapi;

    const schemas = await openapi.fetch();

    return schemas;
  }

  async fetchSchema(resourceBasePath: string, pathPrefix: string, kind: string) {
    const openapi = this.openapiMap[`${resourceBasePath}-${pathPrefix}`] || new OpenAPI(resourceBasePath, pathPrefix);

    this.openapiMap[`${resourceBasePath}-${pathPrefix}`] = openapi;
    await openapi.fetch();

    return openapi.findSchema(kind);
  }
}

export default new SchemaStore();
