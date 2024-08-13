import { JSONSchema7 } from 'json-schema';
import { getApiVersion } from 'src/utils/k8s';
import { resolveRef } from 'src/utils/schema';

// Define OpenAPI response structure
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
  // private response: OpenAPIResponse | null = null;
  private apiVersion: string;
  private schemas: Array<OpenAPIResponse['components']['schemas'][string]> | null = null;

  constructor(private resourceBasePath: string) {
    this.apiVersion = getApiVersion(resourceBasePath);
  }

  // Fetch and process OpenAPI schemas
  public async fetch(): Promise<Array<OpenAPIResponse['components']['schemas'][string]> | null> {
    try {
      const response = await fetch(
        `/api/sks/api/v1/clusters/sks-mgmt/proxy/openapi/v3${this.resourceBasePath}`
      );

      const result = await response.json() as OpenAPIResponse;

      this.schemas = Object.values(result.components.schemas);

      if (this.schemas) {
        this.processSchemas(result.components.schemas);
      }

      return this.schemas;
    } catch (error) {
      console.error('Failed to fetch OpenAPI schemas:', error);
      return null;
    }
  }

  // Find schema by kind and version
  public findSchema(kind: string): JSONSchema7 | undefined {
    return this.schemas?.find(schema =>
      schema['x-kubernetes-group-version-kind']?.some(
        ({ kind: schemaKind, version: schemaVersion, group: schemaGroup }) =>
          kind === schemaKind &&
          this.apiVersion === `${schemaGroup ? schemaGroup + '/' : ''}${schemaVersion}`
      )
    );
  }

  // Process and clean up schemas
  private processSchemas(schemaMap: OpenAPIResponse['components']['schemas']): void {
    this.schemas?.forEach(schema => {
      resolveRef(schema, schemaMap, {
        prune: {
          description: true,
          optional: false,
          fields: [],
          metadata: true,
          xProperty: true,
        },
      });

      // Remove status property from schema
      if (schema?.properties?.status) {
        delete schema.properties.status;
      }
    });
  }
}

export default K8sOpenAPI;
