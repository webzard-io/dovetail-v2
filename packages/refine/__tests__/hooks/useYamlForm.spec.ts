import { act, renderHook } from '@testing-library/react-hooks';
import useYamlForm, { YamlFormRule } from '../../src/components/Form/useYamlForm';

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

function renderYamlForm(editorValue: string, rules: YamlFormRule[] = []) {
  const onSubmitAbort = jest.fn();
  const { result } = renderHook(() =>
    useYamlForm({
      resource: 'configmaps',
      action: 'create',
      // RefineFormContainer 切换到 YAML 模式时总会传入数组，即使没有任何字段需要校验
      rules,
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

describe('useYamlForm rules', () => {
  beforeEach(() => {
    onFinishCore.mockClear();
  });

  const invalidNameRule = (isHidePathInYamlError?: boolean): YamlFormRule => ({
    path: ['metadata', 'name'],
    isHidePathInYamlError,
    validators: [() => ({ isValid: false, errorMsg: 'name already exists' })],
  });

  // 默认在错误末尾附上字段 path，便于用户在 YAML 里定位出错的字段
  it('should append the field path to the rule error by default', async () => {
    const { result, onSubmitAbort } = renderYamlForm(SINGLE_DOCUMENT_YAML, [
      invalidNameRule(),
    ]);

    await act(async () => {
      await result.current.formProps.onFinish?.({});
    });

    expect(result.current.editorProps.errorMsgs).toEqual([
      'name already exists(metadata.name)',
    ]);
    expect(onSubmitAbort).toHaveBeenCalled();
    expect(onFinishCore).not.toHaveBeenCalled();
  });

  it('should hide the field path when isHidePathInYamlError is set', async () => {
    const { result } = renderYamlForm(SINGLE_DOCUMENT_YAML, [invalidNameRule(true)]);

    await act(async () => {
      await result.current.formProps.onFinish?.({});
    });

    expect(result.current.editorProps.errorMsgs).toEqual(['name already exists']);
    expect(onFinishCore).not.toHaveBeenCalled();
  });
});
