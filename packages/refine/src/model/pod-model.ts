import type { Pod } from 'kubernetes-types/core/v1';
import { ResourceQuantity } from 'src/types/metric';
import { formatSi, parseSi } from 'src/utils/unit';
import { WithId } from '../types';
import { shortenedImage } from '../utils/string';
import { WorkloadModel } from './workload-model';

export class PodModel extends WorkloadModel<Pod> {
  public request: ResourceQuantity;
  public limit: ResourceQuantity;

  constructor(public rawYaml: WithId<Pod>) {
    super(rawYaml);

    let cpuRequestNum = 0;
    let memoryRequestNum = 0;
    let cpuLimitNum = 0;
    let memoryLimitNum = 0;

    for (const container of rawYaml.spec?.containers || []) {
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
      this.rawYaml.spec?.containers.map(container =>
        shortenedImage(container.image || '')
      ) || []
    );
  }

  get restartCount() {
    if (this.rawYaml.status?.containerStatuses) {
      return this.rawYaml.status?.containerStatuses[0].restartCount || 0;
    }
    return 0;
  }

  get readyDisplay() {
    return `${this.rawYaml.status?.containerStatuses?.filter(c => c.ready).length}/${this
      .rawYaml.spec?.containers.length}`;
  }

  get readyContainerCount() {
    return this.rawYaml.status?.containerStatuses?.filter(c => c.ready).length;
  }

  get containerCount() {
    return this.rawYaml.spec?.containers.length;
  }
}
