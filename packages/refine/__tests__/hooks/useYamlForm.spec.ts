import { act, renderHook } from '@testing-library/react-hooks';
import useYamlForm from '../../src/components/Form/useYamlForm';

const onFinishCore = jest.fn();

jest.mock('@refinedev/core', () => {
  const actual = jest.requireActual('@refinedev/core');

  return {
    ...actual,
    useForm: () => ({
      queryResult: undefined,
      onFinish: onFinishCore,
      formLoading: false,
      mutationResult: {},
    }),
    useResource: () => ({ action: 'create', resource: { name: 'configmaps' } }),
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

jest.mock('src/hooks/useSchema', () => ({
  useSchema: () => ({
    schema: null,
    loading: false,
    error: null,
    fetchSchema: jest.fn(),
  }),
}));

jest.mock('src/hooks/useGlobalStore', () => ({
  useGlobalStore: () => ({ restoreItem: (item: unknown) => item }),
}));

jest.mock('src/hooks/useK8sYamlEditor', () => ({
  __esModule: true,
  default: () => ({ fold: jest.fn() }),
}));

const SINGLE_DOCUMENT_YAML = `apiVersion: v1
kind: ConfigMap
metadata:
  name: foo
`;

const MULTI_DOCUMENT_YAML = `${SINGLE_DOCUMENT_YAML}---
apiVersion: v1
kind: ConfigMap
metadata:
  name: bar
`;

function renderYamlForm(editorValue: string) {
  const onSubmitAbort = jest.fn();
  const { result } = renderHook(() =>
    useYamlForm({
      resource: 'configmaps',
      action: 'create',
      // RefineFormContainer 切换到 YAML 模式时总会传入数组，即使没有任何字段需要校验
      rules: [],
      onSubmitAbort,
    })
  );

  // editorProps.ref 就是 hook 内部读取编辑器内容的 ref，测试里直接注入桩实现
  (
    result.current.editorProps.ref as unknown as {
      current: { getEditorValue: () => string };
    }
  ).current = { getEditorValue: () => editorValue };

  return { result, onSubmitAbort };
}

describe('useYamlForm submit', () => {
  beforeEach(() => {
    onFinishCore.mockClear();
  });

  // 多文档 YAML 在编辑器里语法合法，但 js-yaml 的单文档 load 会抛错，
  // 该异常必须被捕获并转成提示，否则用户点击提交毫无反应
  it('should show the single document error when submitting multi-document yaml', async () => {
    const { result, onSubmitAbort } = renderYamlForm(MULTI_DOCUMENT_YAML);

    await act(async () => {
      await result.current.formProps.onFinish?.({});
    });

    expect(result.current.editorProps.errorMsgs).toEqual([
      'dovetail.only_support_one_yaml',
    ]);
    expect(onSubmitAbort).toHaveBeenCalled();
    expect(onFinishCore).not.toHaveBeenCalled();
  });

  it('should submit single document yaml', async () => {
    const { result, onSubmitAbort } = renderYamlForm(SINGLE_DOCUMENT_YAML);

    await act(async () => {
      await result.current.formProps.onFinish?.({});
    });

    expect(result.current.editorProps.errorMsgs).toEqual([]);
    expect(onSubmitAbort).not.toHaveBeenCalled();
    expect(onFinishCore).toHaveBeenCalledWith({
      apiVersion: 'v1',
      kind: 'ConfigMap',
      metadata: { name: 'foo' },
    });
  });
});
