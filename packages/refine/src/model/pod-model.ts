import type { Pod } from 'kubernetes-types/core/v1';
import { WithId } from '../types';
import { shortenedImage } from '../utils/string';
import { WorkloadModel } from './workload-model';

export class PodModel extends WorkloadModel<Pod> {
  constructor(public rawYaml: WithId<Pod>) {
    super(rawYaml);
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
    return `${this.rawYaml.status?.containerStatuses?.filter(c => c.ready).length}/${
      this.rawYaml.spec?.containers.length
    }`;
  }
}
