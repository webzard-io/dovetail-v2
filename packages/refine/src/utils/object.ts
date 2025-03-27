import { setWith, clone } from 'lodash-es';

export function immutableSet<
  T extends Record<string, unknown> | unknown[] = Record<string, unknown>
>(obj: T, path: string | string[], value: unknown): T {
  return setWith(clone(obj), path, value, clone) as T;
}
