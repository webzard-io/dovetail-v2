import { Column, IngressRulesTableTabField } from '../../components';
import K8sDropdown from '../../components/K8sDropdown';
import { INGRESS_INIT_VALUE } from '../../constants/k8s';
import {
  AgeColumnRenderer,
  IngressDefaultBackendColumnRenderer,
  IngressRulesColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { IngressModel } from '../../models';
import { RESOURCE_GROUP, ResourceConfig, FormType } from '../../types';

export const IngressConfig: ResourceConfig<IngressModel> = {
  name: 'ingresses',
  kind: 'Ingress',
  basePath: '/apis/networking.k8s.io/v1',
  apiVersion: 'networking.k8s.io/v1',
  label: 'Ingresses',
  parent: RESOURCE_GROUP.NETWORK,
  columns: () =>
    [
      IngressDefaultBackendColumnRenderer(),
      IngressRulesColumnRenderer(),
      AgeColumnRenderer(),
    ] as Column<IngressModel>[],
  showConfig: () => ({
    descriptions: [],
    groups: [],
    tabs: [IngressRulesTableTabField()],
  }),
  initValue: INGRESS_INIT_VALUE,
  Dropdown: K8sDropdown,
  formType: FormType.MODAL,
};
