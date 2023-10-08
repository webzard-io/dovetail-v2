import yaml from 'js-yaml';
import { JSONSchema7 } from 'json-schema';
import { isObject } from 'lodash-es';
import { generateSchemaTypeValue } from './schema';

export function generateYamlBySchema(defaultValue: Record<string, unknown>, schema: JSONSchema7) {
  const typeObject = generateSchemaTypeValue(schema) as Record<string, unknown>;

  function makeAnnotations(obj: Record<string, unknown>, key: string) {
    const result: Record<string, unknown> = {};

    if (isObject(obj[key])) {
      result[`#${key}`] = {};

      Object.keys(obj[key] as Record<string, unknown>).forEach(prop => {
        result[`#${key}`] = {
          ...(result[`#${key}`] as Record<string, unknown>),
          ...makeAnnotations(obj[key] as Record<string, unknown>, prop),
        };
      });
    } else {
      result[`#${key}`] = obj[key];
    }

    return result;
  }

  function merge(obj1: Record<string, unknown>, obj2: Record<string, unknown>, merged: Record<string, unknown> = {}) {
    for (const key in obj1) {
      merged[key] = obj1[key];
    }

    for (const key in obj2) {
      if (key in obj1) {
        if (isObject(obj2[key]) && isObject(obj1[key])) {
          merged[key] = merge(obj1[key] as Record<string, unknown>, obj2[key] as Record<string, unknown>);
        }
      } else {
        merged = {
          ...merged,
          ...makeAnnotations(obj2, key),
        };
      }
    }
    return merged;
  }

  const merged = merge(defaultValue, typeObject);
  const content = yaml.dump(merged);

  return content.replace(/(')(#.+?)(')/g, '$2').replace(/( +)(#)/g, '$2$1');
}
