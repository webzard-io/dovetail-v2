import { JSONSchema7, JSONSchema7Type } from 'json-schema';
import { pick } from 'lodash';

type TransformOptions = {
  generateValue?: (schema: JSONSchema7) => JSONSchema7Type | undefined | null | Record<string, unknown>;
}

export function generateValueFromSchema(schema: JSONSchema7, options: TransformOptions): JSONSchema7Type | undefined | Record<string, unknown> {
  const { generateValue } = options;

  if (!schema) {
    return {};
  }

  switch (true) {
    case schema.type === 'string' && 'enum' in schema && Boolean(schema.enum?.length):
      return generateValue?.(schema) || schema.enum?.[0];
    case schema.type === 'string':
      return generateValue?.(schema) || '';
    case schema.type === 'boolean':
      return generateValue?.(schema) || false;
    case schema.type === 'array':
      if (
        !schema.minItems ||
        !schema.items ||
        typeof schema.items === 'boolean' ||
        Array.isArray(schema.items)
      ) {
        return generateValue?.(schema) || [];
      }

      return new Array(schema.minItems).fill(generateValueFromSchema(schema.items, options));
    case schema.type === 'number':
    case schema.type === 'integer':
      return generateValue?.(schema) || 0;
    case schema.type === 'object': {
      const obj: Record<string, unknown> = {};

      for (const key in schema.properties) {
        obj[key] = generateValueFromSchema(
          schema.properties[key] as JSONSchema7,
          options,
        );
      }

      return obj;
    }
    case Array.isArray(schema.type) &&
      'anyOf' in schema &&
      Boolean(schema.anyOf?.length):
    case Array.isArray(schema.type) &&
      'oneOf' in schema &&
      Boolean(schema.oneOf?.length): {
        const subSchema = (schema.anyOf || schema.oneOf)?.[0];

        return generateValueFromSchema(subSchema as JSONSchema7, options);
      }
    case 'allOf' in schema
      && Boolean(schema.allOf?.length):
      return generateValueFromSchema(schema.allOf?.[0] as JSONSchema7, options);
    default:
      return undefined;
  }
}

export function generateSchemaTypeValue(schema: JSONSchema7): JSONSchema7Type | undefined | Record<string, unknown> {
  return generateValueFromSchema(schema, {
    generateValue(schema): JSONSchema7Type | undefined | null | Record<string, unknown> {
      if (schema.type === 'array' && schema.items) {
        return generateSchemaTypeValue(schema.items as JSONSchema7);
      } else {
        return schema.type;
      }
    }
  });
}

type ResolveOptions = {
  prune: {
    description: boolean;
    optional: boolean;
    metadata: boolean;
    fields: string[];
    xProperty: boolean;
  };
};

export function resolveRef(schema: JSONSchema7, schemas: Record<string, JSONSchema7>, options: ResolveOptions) {
  const { prune } = options;

  if (schema.$ref) {
    const refKey = schema.$ref.replace('#/components/schemas/', '');

    Object.assign(schema, schemas[refKey]);

    if (
      prune.metadata &&
      [
        'io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta',
        'io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta',
      ].some((k) => refKey.includes(k)) &&
      schema.properties
    ) {
      schema.properties = pick(schema.properties, [
        'name',
        'namespace',
        'annotations',
        'labels',
      ]);
    }
    delete schema.$ref;
  }

  for (const schemaKey in schema) {
    if (
      prune.xProperty &&
      schemaKey.startsWith('x-') &&
      schemaKey !== 'x-kubernetes-group-version-kind'
    ) {
      delete schema[schemaKey as keyof JSONSchema7];
    }
  }

  switch (true) {
    case schema.type === 'array':
      if (Array.isArray(schema.items)) {
        schema.items.forEach((item) =>
          resolveRef(item as JSONSchema7, schemas, options)
        );
      } else if (typeof schema.items === 'object') {
        resolveRef(schema.items, schemas, options);
      }
      break;
    case schema.type === 'object':
      for (const key in schema.properties) {
        const subSchema = schema.properties[key] as JSONSchema7;

        if (prune.optional && !schema.required?.includes(key)) {
          delete schema.properties[key];
        }
        if (prune.fields.includes(key)) {
          delete schema.properties[key];
        }

        resolveRef(subSchema, schemas, options);
      }

      if (schema.additionalProperties) {
        resolveRef(schema.additionalProperties as JSONSchema7, schemas, options);
      }

      break;
    case !!(schema.allOf && schema.allOf[0]):
      resolveRef(schema.allOf?.[0] as JSONSchema7, schemas, options);
    default:
  }

  if (prune.description) {
    delete schema.description;
  }

  return schema;
}
