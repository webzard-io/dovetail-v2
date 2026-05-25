import { renderHook, act } from '@testing-library/react-hooks';
import { Unstructured } from 'k8s-api-provider';
import { createElement, ReactNode } from 'react';
import GlobalStoreContext from '../../src/contexts/global-store';
import { Retry409MetaOptions, use409Retry } from '../../src/hooks/use409Retry';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

function makeResource(resourceVersion: string): Unstructured {
  return {
    id: 'default/test',
    apiVersion: 'v1',
    kind: 'ConfigMap',
    metadata: {
      name: 'test',
      namespace: 'default',
      resourceVersion,
    },
  };
}

function createWrapper(restoreItem?: (resource: Unstructured) => Unstructured) {
  return function Wrapper({ children }: { children?: ReactNode }) {
    return createElement(
      GlobalStoreContext.Provider,
      {
        value: {
          default: {
            restoreItem,
          },
        } as any,
      },
      children
    );
  };
}

function getRetryMeta(
  mutationMeta: ReturnType<typeof use409Retry>['mutationMeta']
) {
  return mutationMeta.resourceVersionConflictRetry as Retry409MetaOptions;
}

describe('use409Retry', () => {
  it('captures the initial raw resource once', () => {
    const resource = makeResource('1');
    const restoredResource = makeResource('raw-1');
    const restoreItem = jest.fn(() => restoredResource);
    const { result } = renderHook(
      () =>
        use409Retry({
          action: 'edit',
          dataProviderName: 'default',
          id: 'default/test',
          mutationMeta: {
            updateType: 'put',
          },
        }),
      {
        wrapper: createWrapper(restoreItem),
      }
    );

    act(() => {
      result.current.captureInitialResource(resource);
    });
    restoredResource.metadata!.resourceVersion = 'changed-after-capture';
    act(() => {
      result.current.captureInitialResource(makeResource('2'));
    });

    expect(
      getRetryMeta(result.current.mutationMeta).initialResource?.metadata
        ?.resourceVersion
    ).toBe('raw-1');
    expect(restoreItem).toHaveBeenCalledTimes(1);
  });

  it('does not capture initial resource when restoreItem is not provided', () => {
    const { result } = renderHook(
      () =>
        use409Retry({
          action: 'edit',
          id: 'default/test',
          mutationMeta: {
            updateType: 'put',
          },
        }),
      {
        wrapper: createWrapper(),
      }
    );

    act(() => {
      result.current.captureInitialResource(makeResource('1'));
    });

    expect(getRetryMeta(result.current.mutationMeta).initialResource).toBeUndefined();
  });

  it('does not add conflict retry meta for create forms', () => {
    const { result } = renderHook(
      () =>
        use409Retry({
          action: 'create',
          mutationMeta: {
            resourceVersionConflictRetry: {
              conflictMessage: 'old conflict',
            },
            updateType: 'put',
          },
        }),
      {
        wrapper: createWrapper(),
      }
    );

    act(() => {
      result.current.captureInitialResource(makeResource('1'));
    });

    expect(result.current.mutationMeta).toEqual({
      updateType: 'put',
    });
  });

  it('overrides existing conflict retry meta when retry is enabled', () => {
    const { result } = renderHook(
      () =>
        use409Retry({
          action: 'edit',
          id: 'default/test',
          mutationMeta: {
            resourceVersionConflictRetry: {
              conflictMessage: 'custom conflict',
            },
            updateType: 'put',
          },
        }),
      {
        wrapper: createWrapper(),
      }
    );

    expect(getRetryMeta(result.current.mutationMeta).conflictMessage).toBe(
      'dovetail.resource_version_conflict'
    );
    expect(getRetryMeta(result.current.mutationMeta).initialResource).toBeUndefined();
    expect(result.current.mutationMeta.updateType).toBe('put');
  });
});
