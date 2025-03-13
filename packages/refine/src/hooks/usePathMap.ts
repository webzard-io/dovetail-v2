import { Unstructured } from 'k8s-api-provider';
import { get } from 'lodash-es';
import { immutableSet } from '../utils/object';

interface UsePathMapOptions {
  pathMap?: [string[], string[]][];
  transformInitValues?: (values: Record<string, unknown>) => Record<string, unknown>;
  transformApplyValues?: (values: Record<string, unknown>) => Unstructured;
}

function usePathMap(options: UsePathMapOptions): {
  transformInitValues: (values: Record<string, unknown>) => Record<string, unknown>;
  transformApplyValues: (values: Record<string, unknown>) => Unstructured;
} {
  const { pathMap, transformInitValues, transformApplyValues } = options;

  return {
    transformInitValues(values: Record<string, unknown>) {
      const initValues = (values._rawYaml as Record<string, unknown> || values);
      let result = initValues;

      for (const [from, to] of (pathMap || [])) {
        result = immutableSet(initValues, to, get(initValues, from));

        const fromPath = [...from];
        const lastKey = fromPath.pop();
        if (lastKey) {
          const obj = get(result, fromPath.join('.'));
          if (obj && typeof obj === 'object') {
            delete (obj as Record<string, unknown>)[lastKey];
          }
        }
      }

      return transformInitValues?.(result) || result;
    },
    transformApplyValues(values: Record<string, unknown>) {
      let result = values;

      for (const [from, to] of (pathMap || [])) {
        result = immutableSet(
          values,
          from,
          get(result, to),
        );

        const toPath = [...to];
        const lastKey = toPath.pop();
        if (lastKey) {
          const obj = get(result, toPath.join('.'));
          if (obj && typeof obj === 'object') {
            delete (obj as Record<string, unknown>)[lastKey];
          }
        }
      }

      return transformApplyValues?.(result) || (result as Unstructured);
    },
  };
}

export default usePathMap;
