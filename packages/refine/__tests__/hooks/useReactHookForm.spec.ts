import { renderHook } from '@testing-library/react-hooks';
import { useForm } from '../../src/components/Form/useReactHookForm';

const queryResult = {
  data: {
    data: {
      id: 'default/source-pvc',
      apiVersion: 'v1',
      kind: 'PersistentVolumeClaim',
      metadata: { name: 'source-pvc', namespace: 'default' },
    },
  },
};

jest.mock('@refinedev/core', () => {
  const actual = jest.requireActual('@refinedev/core');

  return {
    ...actual,
    useForm: () => ({
      queryResult,
      onFinish: jest.fn(),
      onFinishAutoSave: jest.fn(),
      formLoading: false,
      mutationResult: {},
    }),
    useTranslate: () => (key: string) => key,
    useRefineContext: () => ({ options: {} }),
    useWarnAboutChange: () => ({
      warnWhenUnsavedChanges: false,
      setWarnWhen: jest.fn(),
    }),
  };
});

jest.mock('src/hooks/use409Retry', () => ({
  use409Retry: () => ({
    captureInitialResource: jest.fn(),
    mutationMeta: {},
  }),
}));

function renderForm(action: 'create' | 'edit') {
  return renderHook(() =>
    useForm({
      refineCoreProps: { resource: 'persistentvolumeclaims', action },
      defaultValues: {
        metadata: { name: '', namespace: 'default' },
      },
    })
  );
}

describe('useReactHookForm initial data', () => {
  // 详情页打开的新建表单会命中详情页的资源缓存，此时不能用缓存里的资源回填表单
  it('should not fill the form with the cached record in create action', () => {
    const { result } = renderForm('create');

    expect(result.current.getValues().metadata.name).toBe('');
  });

  it('should fill the form with the fetched record in edit action', () => {
    const { result } = renderForm('edit');

    expect(result.current.getValues().metadata.name).toBe('source-pvc');
  });
});
