import { i18n } from 'i18next';
import { Column, IngressRulesTableTabField } from '../../components';
import K8sDropdown from '../../components/K8sDropdown';
import { INGRESS_INIT_VALUE } from '../../constants/k8s';
import {
  AgeColumnRenderer,
  IngressClassColumnRenderer,
  IngressDefaultBackendColumnRenderer,
  IngressRulesColumnRenderer,
  IngressTlsColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { IngressModel } from '../../models';
import { RESOURCE_GROUP, ResourceConfig, FormType } from '../../types';

export const IngressConfig = (i18n: i18n): ResourceConfig<IngressModel> => ({
  name: 'ingresses',
  kind: 'Ingress',
  basePath: '/apis/networking.k8s.io/v1',
  apiVersion: 'networking.k8s.io/v1',
  label: 'Ingresses',
  parent: RESOURCE_GROUP.NETWORK,
  columns: () =>
    [
      IngressDefaultBackendColumnRenderer(i18n),
      IngressRulesColumnRenderer(i18n),
      IngressClassColumnRenderer(i18n),
      IngressTlsColumnRenderer(i18n),
      AgeColumnRenderer(i18n),
    ] as Column<IngressModel>[],
  showConfig: () => ({
    descriptions: [],
    groups: [],
    tabs: [IngressRulesTableTabField(i18n)],
  }),
  initValue: INGRESS_INIT_VALUE,
  Dropdown: K8sDropdown,
  formType: FormType.MODAL,
});
