import type { Pod } from 'kubernetes-types/core/v1';
import { WithId } from '../types';
import { shortenedImage } from '../utils/string';
import { WorkloadModel } from './workload-model';

export class PodModel extends WorkloadModel<Pod> {
  constructor(public data: WithId<Pod>) {
    super(data);
  }

  get imageNames() {
    return (
      this.data.spec?.containers.map(container =>
        shortenedImage(container.image || '')
      ) || []
    );
  }

  get restartCount() {
    if (this.data.status?.containerStatuses) {
      return this.data.status?.containerStatuses[0].restartCount || 0;
    }
    return 0;
  }

  get readyDisplay() {
    return `${this.data.status?.containerStatuses?.filter(c => c.ready).length}/${this
      .data.spec?.containers.length}`;
  }
}
