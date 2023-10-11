import type { Pod } from 'kubernetes-types/core/v1';
import { Resource } from '../types';
import { shortenedImage } from '../utils/string';
import { ResourceModel } from './resource-model';

export class PodModel extends ResourceModel {
  constructor(public data: Pod & Resource) {
    super(data);
  }

  get nodeName() {
    return this.data.spec?.nodeName || '';
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
}
