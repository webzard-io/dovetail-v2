import { LabelSelector } from 'kubernetes-types/meta/v1';
import { ResourceModel } from '../models/resource-model';

export function matchSelector(pod: ResourceModel, selector?: LabelSelector, namespace = 'default'): boolean {
  let match = true;
  // TODO: support complete selector match strategy
  // https://github.com/rancher/dashboard/blob/master/shell/utils/selector.js#L166
  if (selector) {
    for (const key in selector.matchLabels) {
      if (
        !pod.metadata?.labels?.[key] ||
        pod.metadata.labels?.[key] !== selector.matchLabels[key]
      ) {
        match = false;
      }
    }
  }

  return match && pod.metadata?.namespace === namespace;
}
