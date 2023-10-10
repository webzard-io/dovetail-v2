import type { Deployment, StatefulSet } from 'kubernetes-types/apps/v1';
import { WithId } from '../types';
import { shortenedImage } from '../utils/string';
import { ResourceModel } from './resource-model';

export class WorkloadModel extends ResourceModel {
  constructor(public data: WithId<Deployment | StatefulSet>) {
    super(data);
  }

  get imageNames() {
    return (
      this.data.spec?.template.spec?.containers.map(container =>
        shortenedImage(container.image || '')
      ) || []
    );
  }

  get restartCount() {
    // TODO: need count from pods
    return 0;
  }
}
