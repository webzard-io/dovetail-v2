import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { Pod } from 'kubernetes-types/core/v1';
import { WorkloadState } from '../constants';
import { shortenedImage } from '../utils/string';
import { formatSi, parseSi } from '../utils/unit';
import { ResourceQuantity } from './types/metric';
import { WorkloadBaseModel } from './workload-base-model';

type RequiredPod = Required<Pod> & Unstructured;

export class PodModel extends WorkloadBaseModel {
  public request: ResourceQuantity;
  public limit: ResourceQuantity;
  public declare spec?: RequiredPod['spec'];
  public declare status?: RequiredPod['status'];

  constructor(
    public _rawYaml: RequiredPod,
    public _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);

    let cpuRequestNum = 0;
    let memoryRequestNum = 0;
    let cpuLimitNum = 0;
    let memoryLimitNum = 0;

    for (const container of _rawYaml.spec?.containers || []) {
      cpuRequestNum += parseSi(container.resources?.requests?.cpu || '0');
      memoryRequestNum += parseSi(container.resources?.requests?.memory || '0');
      cpuLimitNum += parseSi(container.resources?.limits?.cpu || '0');
      memoryLimitNum += parseSi(container.resources?.limits?.memory || '0');
    }

    this.request = {
      cpu: {
        value: cpuRequestNum,
        si: formatSi(cpuRequestNum, {
          suffix: 'm',
        }),
      },
      memory: {
        value: memoryRequestNum,
        si: formatSi(memoryRequestNum, {
          suffix: 'i',
        }),
      },
    };

    this.limit = {
      cpu: {
        value: cpuLimitNum,
        si: formatSi(cpuLimitNum, {
          suffix: 'm',
        }),
      },
      memory: {
        value: memoryLimitNum,
        si: formatSi(memoryLimitNum, {
          suffix: 'i',
        }),
      },
    };
  }

  get imageNames() {
    return (
      this._rawYaml.spec?.containers.map(container =>
        shortenedImage(container.image || '')
      ) || []
    );
  }

  get restartCount() {
    if (this._rawYaml.status?.containerStatuses) {
      return this._rawYaml.status?.containerStatuses.reduce((count, container) => {
        count += container.restartCount;
        return count;
      }, 0) || 0;
    }

    return 0;
  }

  get readyDisplay() {
    return `${this._rawYaml.status?.containerStatuses?.filter(c => c.ready).length}/${this
      ._rawYaml.spec?.containers.length}`;
  }
  get readyContainerCount() {
    return this._rawYaml.status?.containerStatuses?.filter(c => c.ready).length;
  }

  get containerCount() {
    return this._rawYaml.spec?.containers.length;
  }

  get stateDisplay() {
    if (this.metadata.deletionTimestamp) {
      return WorkloadState.TERMINATING;
    }
    return this.status?.phase?.toLowerCase() || WorkloadState.UNKNOWN;
  }
}
