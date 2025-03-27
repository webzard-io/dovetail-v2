import { Unstructured } from 'k8s-api-provider';
import usePathMap from '../../src/hooks/usePathMap';

interface TestSpec {
  oldPath?: string;
  newPath?: string;
  deep?: {
    old?: string;
  };
  value?: string;
  mapped?: string;
}

interface TestConfig {
  nested?: {
    new?: string;
  };
}

interface TestValues extends Record<string, unknown> {
  spec?: TestSpec;
  config?: TestConfig;
  data?: string;
  transformed?: string;
  extra?: string;
  type?: string;
  test?: string;
  _rawYaml?: Record<string, unknown>;
  parameters?: Record<string, string>;
}

describe('usePathMap', () => {
  it('should handle basic path mapping correctly', () => {
    const pathMap: { from: string[]; to: string[] }[] = [
      { from: ['spec', 'oldPath'], to: ['spec', 'newPath'] },
    ];

    const { transformInitValues, transformApplyValues } = usePathMap({ pathMap });

    const initValues: TestValues = {
      spec: {
        oldPath: 'value',
      },
    };

    const transformedInit = transformInitValues(initValues) as TestValues;
    expect(transformedInit.spec?.newPath).toBe('value');
    expect(transformedInit.spec?.oldPath).toBeUndefined();

    const applyValues: TestValues = {
      spec: {
        newPath: 'updated-value',
      },
    };

    const transformedApply = transformApplyValues(applyValues) as TestValues;
    expect(transformedApply.spec?.oldPath).toBe('updated-value');
    expect(transformedApply.spec?.newPath).toBeUndefined();
  });

  it('should handle nested path mapping correctly', () => {
    const pathMap: { from: string[]; to: string[] }[] = [
      { from: ['spec', 'deep', 'old'], to: ['config', 'nested', 'new'] },
    ];

    const { transformInitValues } = usePathMap({ pathMap });

    const initValues: TestValues = {
      spec: {
        deep: {
          old: 'nested-value',
        },
      },
    };

    const transformedInit = transformInitValues(initValues) as TestValues;
    expect(transformedInit.config?.nested?.new).toBe('nested-value');
    expect(transformedInit.spec?.deep?.old).toBeUndefined();
  });

  it('should support custom transform functions', () => {
    const pathMap: { from: string[]; to: string[] }[] = [
      { from: ['data'], to: ['transformed'] },
    ];

    const customTransform = (values: Record<string, unknown>) => ({
      ...values,
      extra: 'custom',
    });

    const { transformInitValues, transformApplyValues } = usePathMap({
      pathMap,
      transformInitValues: customTransform,
      transformApplyValues: (values) => ({
        id: 'test-id',
        apiVersion: 'v1',
        kind: 'Test',
        ...values,
        type: 'Custom',
      } as unknown as Unstructured),
    });

    const initValues: TestValues = {
      data: 'test',
    };

    const transformedInit = transformInitValues(initValues) as TestValues;
    expect(transformedInit.transformed).toBe('test');
    expect(transformedInit.extra).toBe('custom');

    const applyValues: TestValues = {
      transformed: 'test',
    };

    const transformedApply = transformApplyValues(applyValues) as TestValues;
    expect(transformedApply.data).toBe('test');
    expect(transformedApply.type).toBe('Custom');
  });

  it('should handle empty mapping correctly', () => {
    const { transformInitValues, transformApplyValues } = usePathMap({});

    const values: TestValues = {
      test: 'value',
    };

    expect(transformInitValues(values)).toEqual(values);
    expect(transformApplyValues(values)).toEqual(values);
  });

  it('should handle raw YAML data correctly', () => {
    const pathMap: { from: string[]; to: string[] }[] = [
      { from: ['spec', 'value'], to: ['spec', 'mapped'] },
    ];

    const { transformInitValues } = usePathMap({ pathMap });

    const values: TestValues = {
      _rawYaml: {
        spec: {
          value: 'yaml-value',
        },
      },
    };

    const transformed = transformInitValues(values) as TestValues;
    expect(transformed.spec?.mapped).toBe('yaml-value');
    expect(transformed.spec?.value).toBeUndefined();
  });

  it('should handle StorageClass CSI parameter mapping correctly', () => {
    const pathMap: { from: string[]; to: string[] }[] = [
      { from: ['parameters', 'csi.storage.k8s.io/fstype'], to: ['parameters', 'fstype'] },
    ];

    const { transformInitValues, transformApplyValues } = usePathMap({ pathMap });

    const initValues: TestValues = {
      parameters: {
        'csi.storage.k8s.io/fstype': 'ext4',
      },
    };

    const transformedInit = transformInitValues(initValues) as TestValues;
    expect(transformedInit.parameters?.fstype).toBe('ext4');
    expect(transformedInit.parameters?.['csi.storage.k8s.io/fstype']).toBeUndefined();

    const applyValues: TestValues = {
      parameters: {
        fstype: 'xfs',
      },
    };

    const transformedApply = transformApplyValues(applyValues) as TestValues;
    expect(transformedApply.parameters?.['csi.storage.k8s.io/fstype']).toBe('xfs');
    expect(transformedApply.parameters?.fstype).toBeUndefined();
  });
});
