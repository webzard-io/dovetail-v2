import { renderHook } from '@testing-library/react-hooks';
import { createElement } from 'react';
import type { ReactNode } from 'react';

// Mock heavy external dependencies before any import
jest.mock('@cloudtower/eagle', () => ({}));
jest.mock('@linaria/core', () => ({
  css: () => '',
  cx: (...args: string[]) => args.join(' '),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: {} }),
}));

// useLocalStorage must return a stable array reference (same as real behavior)
const STABLE_LOCAL_STORAGE_VALUE = ['_all'];
jest.mock('usehooks-ts', () => ({
  useLocalStorage: jest.fn(() => [STABLE_LOCAL_STORAGE_VALUE, jest.fn()]),
}));
jest.mock('@refinedev/core', () => ({
  useResource: jest.fn(() => ({
    resource: { name: 'persistentvolumes' },
  })),
  useList: jest.fn(() => ({ data: { data: [] } })),
}));

import { useNamespacesFilter } from '../../src/components/NamespacesFilter';
import { ConfigsContext } from '../../src/contexts';

const NON_NS_CONFIGS = {
  persistentvolumes: { nonNsResource: true },
} as Record<string, any>;

const NS_CONFIGS = {
  deployments: { nonNsResource: false },
} as Record<string, any>;

function createWrapper(configs: Record<string, any>) {
  return function Wrapper({ children }: { children?: ReactNode }) {
    return createElement(ConfigsContext.Provider, { value: configs }, children);
  };
}

describe('useNamespacesFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return stable reference for nonNsResource across re-renders', () => {
    const { useResource } = jest.requireMock('@refinedev/core');
    useResource.mockReturnValue({
      resource: { name: 'persistentvolumes' },
    });

    const { result, rerender } = renderHook(() => useNamespacesFilter(), {
      wrapper: createWrapper(NON_NS_CONFIGS),
    });

    const firstValue = result.current.value;
    expect(firstValue).toEqual([]);

    rerender();

    const secondValue = result.current.value;
    expect(secondValue).toEqual([]);

    // The returned array must be the same reference across re-renders
    // for nonNsResource. Creating a new [] each render causes downstream
    // useEffect([filters]) in ResourceList to fire and reset pagination to page 1.
    expect(firstValue).toBe(secondValue);
  });

  it('should return localStorage value for namespace-scoped resources', () => {
    const { useResource } = jest.requireMock('@refinedev/core');
    useResource.mockReturnValue({
      resource: { name: 'deployments' },
    });

    const { result } = renderHook(() => useNamespacesFilter(), {
      wrapper: createWrapper(NS_CONFIGS),
    });

    expect(result.current.value).toEqual(['_all']);
    // Should return the same reference as useLocalStorage provides
    expect(result.current.value).toBe(STABLE_LOCAL_STORAGE_VALUE);
  });
});
