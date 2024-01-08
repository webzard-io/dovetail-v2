import { Unstructured } from 'k8s-api-provider';
import { ListMeta } from 'kubernetes-types/meta/v1';

export type DataList<Output extends Unstructured = Unstructured> = {
  apiVersion: string;
  kind: string;
  metadata: ListMeta;
  items: Array<Unstructured & Output>;
};
