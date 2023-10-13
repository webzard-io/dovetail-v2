import { JSONSchema7 } from 'json-schema';
import { getApiVersion } from 'src/utils/k8s';
import { resolveRef } from 'src/utils/schema';

interface OpenAPIResponse {
  openapi: string;
  paths: {
    [prop: string]: {
      get: {
        responses: {
          200: {
            content: {
              'application/json': {
                schema: JSONSchema7;
              };
            };
          };
        };
      };
    };
  };
  components: {
    schemas: {
      [prop: string]: JSONSchema7 & {
        'x-kubernetes-group-version-kind': {
          group: string;
          kind: string;
          version: string;
        }[];
      };
    };
  };
}

class K8sOpenAPI {
  response: OpenAPIResponse | null = null;
  apiVersion: string;

  constructor(public resourceBasePath: string) {
    this.apiVersion = getApiVersion(resourceBasePath);
  }

  public async fetch(): Promise<OpenAPIResponse> {
    const response = await fetch(
      `/api/sks/api/v1/clusters/sks-mgmt/proxy/openapi/v3${this.resourceBasePath}`
    );

    return response.json();
  }

  public async findSchema(kind: string) {
    const result = this.response || (await this.fetch());
    const schema = Object.values(result.components.schemas).find(schema =>
      schema['x-kubernetes-group-version-kind']?.some(
        ({ kind: schemaKind, version: schemaVersion, group: schemaGroup }) =>
          kind === schemaKind &&
          this.apiVersion === `${schemaGroup ? schemaGroup + '/' : ''}${schemaVersion}`
      )
    );

    if (schema) {
      resolveRef(schema, result.components.schemas, {
        prune: {
          description: true,
          optional: false,
          fields: [],
          metadata: true,
          xProperty: true,
        },
      });
    }

    return schema;
  }
}

export default K8sOpenAPI;
