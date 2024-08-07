import { GlobalStore, Unstructured, UnstructuredList } from 'k8s-api-provider';
import { DaemonSet, Deployment, ReplicaSet, StatefulSet } from 'kubernetes-types/apps/v1';
import { Job } from 'kubernetes-types/batch/v1';
import { Service } from 'kubernetes-types/core/v1';
import { LabelSelector, ObjectMeta } from 'kubernetes-types/meta/v1';
import { omit } from 'lodash';
import { ResourceModel } from '../models';

export type Relation = {
  kind: string;
  apiVersion: string;
  type: 'creates' | 'uses' | 'applies' | 'owner' | 'selects';
  inbound: boolean;
  // TODO: use union types
  name?: string;
  namespace?: string;
  selector?: LabelSelector;
};

export type ExtendObjectMeta = ObjectMeta & {
  relations?: Relation[];
};

export class RelationPlugin {
  private globalStore?: GlobalStore;

  init(globalStore: GlobalStore) {
    this.globalStore = globalStore;
  }

  async processData(res: UnstructuredList) {
    const { kind, apiVersion } = res;
    const items = await Promise.all(
      res.items.map(item =>
        this.processItem({
          // TODO: unify this with data-provider getOne method
          kind: kind.replace(/List$/g, ''),
          apiVersion,
          ...omit(item, ['apiVersion', 'kind']),
        })
      )
    );
    return {
      ...res,
      items,
    } as UnstructuredList;
  }

  async processItem(item: Unstructured): Promise<ResourceModel> {
    this.processPodSelector(item);
    return item as ResourceModel;
  }

  restoreData(res: UnstructuredList): UnstructuredList {
    res.items = res.items.map(item => this.restoreItem(item));
    return res;
  }

  restoreItem(item: Unstructured): Unstructured {
    return {
      ...item,
      metadata: omit(item.metadata, 'relations'),
    };
  }

  private processPodSelector(item: Unstructured): Unstructured {
    const { spec, kind } = item as
      | Deployment
      | DaemonSet
      | StatefulSet
      | ReplicaSet
      | Job
      | Service;

    if (!spec?.selector) {
      return item;
    }

    // TODO: also check apiVersion along with kind
    if (
      !kind ||
      ![
        'Deployment',
        'DaemonSet',
        'StatefulSet',
        'ReplicaSet',
        'Job',
        'Service',
      ].includes(kind)
    ) {
      return item;
    }

    const selector = { ...spec?.selector };

    // empty selector or legacy resources like Service
    if (!selector.matchLabels && !selector.matchExpressions) {
      selector.matchLabels = {};
      for (const key of Object.keys(selector)) {
        if (key === 'matchLabels') {
          continue;
        }
        selector.matchLabels[key] = (selector as Record<string, string>)[key];
        delete (selector as Record<string, string>)[key];
      }
    }

    this.appendRelation(item, {
      kind: 'Pod',
      apiVersion: 'v1',
      type: kind === 'Service' ? 'selects' : 'creates',
      selector,
      inbound: false,
    });

    return item;
  }

  private appendRelation(item: Unstructured, relation: Relation): Unstructured {
    const metadata = item.metadata as ExtendObjectMeta;
    if (!metadata.relations) {
      metadata.relations = [];
    }

    metadata.relations.push(relation);

    return item;
  }
}

export const relationPlugin = new RelationPlugin();
