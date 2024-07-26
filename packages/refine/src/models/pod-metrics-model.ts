import { GlobalStore } from 'k8s-api-provider';
import { formatSi, parseSi } from '../utils/unit';
import { ResourceModel } from './resource-model';
import { PodMetrics, ResourceQuantity } from './types/metric';

export class PodMetricsModel extends ResourceModel<PodMetrics> {
  public usage: ResourceQuantity;

  constructor(
    public _rawYaml: PodMetrics,
    _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);

    let cpuUsageNum = 0;
    let memoryUsageNum = 0;
    for (const container of _rawYaml.containers) {
      cpuUsageNum += parseSi(container.usage.cpu || '0');
      memoryUsageNum += parseSi(container.usage.memory || '0');
    }

    this.usage = {
      cpu: {
        value: cpuUsageNum,
        si: formatSi(1000 * cpuUsageNum, {
          suffix: 'm',
          maxPrecision: 0,
        }),
      },
      memory: {
        value: memoryUsageNum,
        si: formatSi(memoryUsageNum, {
          suffix: 'i',
          maxPrecision: 0,
        }),
      },
    };
  }
}
