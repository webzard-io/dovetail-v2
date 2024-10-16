import { i18n } from 'i18next';
import { Unstructured } from 'k8s-api-provider';
import { Secret } from 'kubernetes-types/core/v1';
import { SECRET_OPAQUE_INIT_VALUE } from 'src/constants/k8s';
import { SecretDataGroup, BasicGroup } from '../../components/ShowContent';
import { AgeColumnRenderer, DataKeysColumnRenderer } from '../../hooks/useEagleTable/columns';
import { ResourceModel } from '../../models';
import { RESOURCE_GROUP, ResourceConfig } from '../../types';

function isBase64(value: string) {
  try {
    window.atob(value);
    return !!value;
  } catch {
    return false;
  }
}

export const SecretsConfig = (i18n: i18n): ResourceConfig<ResourceModel> => ({
  name: 'secrets',
  kind: 'Secret',
  basePath: '/api/v1',
  apiVersion: 'v1',
  parent: RESOURCE_GROUP.STORAGE,
  initValue: SECRET_OPAQUE_INIT_VALUE,
  columns: () => [DataKeysColumnRenderer(i18n), AgeColumnRenderer(i18n)],
  formConfig: {
    transformInitValues: (value) => {
      const data = (value as Secret).data || {};

      return {
        ...(value as Unstructured),
        data: Object.keys(data).reduce((result: Record<string, string>, key) => {
          result[key] = window.atob(data[key]);

          return result;
        }, {})
      };
    },
    transformApplyValues: (value) => {
      const data = (value as Secret).data || {};

      return {
        ...(value as Unstructured),
        data: Object.keys(data).reduce((result: Record<string, string>, key) => {
          const value = data[key];

          result[key] = isBase64(value) ? value : window.btoa(value);

          return result;
        }, {})
      };
    },
  },
  showConfig: () => ({
    tabs: [
      {
        title: i18n.t('dovetail.detail'),
        key: 'detail',
        groups: [BasicGroup(i18n), SecretDataGroup()],
      },
    ],
  }),
});
