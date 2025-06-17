/**
 * Utility hook for transforming data structures by mapping paths between different object structures.
 * Useful for converting between form values and API data structures.
 */

import { Unstructured } from 'k8s-api-provider';
import { get } from 'lodash-es';
import { useCallback } from 'react';
import { immutableSet } from '../utils/object';

interface UsePathMapOptions {
  /** Array of path mappings, each containing source path and target path arrays */
  pathMap?: { from: string[]; to: string[] }[];
  /** Optional function to transform initial values after path mapping */
  transformInitValues?: (values: Record<string, unknown>) => Record<string, unknown>;
  /** Optional function to transform values before applying/saving */
  transformApplyValues?: (values: Record<string, unknown>) => Unstructured;
}

/**
 * Hook that provides functions to transform data between different object structures using path mappings
 * @param options Configuration options including path mappings and transform functions
 * @returns Object containing transformation functions for init and apply operations
 */
function usePathMap(options: UsePathMapOptions): {
  transformInitValues: (values: Record<string, unknown>) => Record<string, unknown>;
  transformApplyValues: (values: Record<string, unknown>) => Unstructured;
} {
  const { pathMap, transformInitValues: transformInitValuesFromOptions, transformApplyValues: transformApplyValuesFromOptions } = options;

  /**
 * Transforms initial values by mapping paths from source to target structure
 * @param values Initial values to transform
 * @returns Transformed values with updated paths
 */
  const transformInitValues = useCallback((values: Record<string, unknown>) => {
    // Get raw YAML values or use values as is
    const initValues = (values._rawYaml as Record<string, unknown> || values);
    let result = initValues;

    // Apply each path mapping
    for (const { from, to } of (pathMap || [])) {
      // Copy value from source path to target path
      result = immutableSet(initValues, to, get(initValues, from));

      // Clean up the source path after copying
      const fromPath = [...from];
      const lastKey = fromPath.pop();
      if (lastKey) {
        const obj = get(result, fromPath);
        if (obj && typeof obj === 'object') {
          delete (obj as Record<string, unknown>)[lastKey];
        }
      }
    }

    // Apply custom transform if provided
    return transformInitValuesFromOptions?.(result) || result;
  }, [transformInitValuesFromOptions, pathMap]);
  /**
   * Transforms values back to original structure before applying/saving
   * @param values Values to transform back
   * @returns Transformed values in original structure
   */
  const transformApplyValues = useCallback((values: Record<string, unknown>) => {
    let result = values;

    // Apply each path mapping in reverse
    for (const { from, to } of (pathMap || [])) {
      // Copy value from target path back to source path
      result = immutableSet(
        values,
        from,
        get(result, to),
      );

      // Clean up the target path after copying back
      const toPath = [...to];
      const lastKey = toPath.pop();
      if (lastKey) {
        const obj = get(result, toPath);
        if (obj && typeof obj === 'object') {
          delete (obj as Record<string, unknown>)[lastKey];
        }
      }
    }

    // Apply custom transform if provided
    return transformApplyValuesFromOptions?.(result) || (result as Unstructured);
  }, [transformApplyValuesFromOptions, pathMap]);

  return {
    transformInitValues,
    transformApplyValues,
  };
}

export default usePathMap;
