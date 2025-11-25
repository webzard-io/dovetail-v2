import { LabelSelector, LabelSelectorRequirement } from 'kubernetes-types/meta/v1';
import { ResourceModel } from '../models/resource-model';

function isLabelSelector(selector: unknown): selector is LabelSelector {
  if (!selector || typeof selector !== 'object') {
    return false;
  }

  const s = selector as Record<string, unknown>;

  if ('matchExpressions' in s) {
    return true;
  }

  if ('matchLabels' in s) {
    const ml = s.matchLabels;
    return typeof ml === 'object' && ml !== null;
  }

  return false;
}

export function matchSelector(pod: ResourceModel, selector?: LabelSelector | Record<string, string>, namespace = 'default'): boolean {
  if (pod.metadata?.namespace !== namespace) {
    return false;
  }

  if (!selector || Object.keys(selector).length === 0) {
    return true;
  }

  const podLabels = pod.metadata?.labels || {};
  let matchLabels: Record<string, string> | undefined;
  let matchExpressions: LabelSelectorRequirement[] | undefined;

  if (isLabelSelector(selector)) {
    matchLabels = selector.matchLabels;
    matchExpressions = selector.matchExpressions;
  } else {
    matchLabels = selector as Record<string, string>;
  }

  if (matchLabels) {
    for (const key in matchLabels) {
      if (podLabels[key] !== matchLabels[key]) {
        return false;
      }
    }
  }

  if (matchExpressions) {
    for (const req of matchExpressions) {
      const { key, operator, values } = req;
      const labelValue = podLabels[key];
      const hasLabel = Object.prototype.hasOwnProperty.call(podLabels, key);

      switch (operator) {
        case 'In':
          if (!hasLabel || !values?.includes(labelValue)) return false;
          break;
        case 'NotIn':
          if (hasLabel && values?.includes(labelValue)) return false;
          break;
        case 'Exists':
          if (!hasLabel) return false;
          break;
        case 'DoesNotExist':
          if (hasLabel) return false;
          break;
        default:
          break;
      }
    }
  }

  return true;
}
