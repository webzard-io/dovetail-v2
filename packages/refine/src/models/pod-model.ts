import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { Pod } from 'kubernetes-types/core/v1';
import { ResourceState } from '../constants';
import { shortenedImage } from '../utils/string';
import { formatSi, parseSi } from '../utils/unit';
import { DeploymentModel } from './deployment-model';
import { ReplicaSetModel } from './replicaset-model';
import { ResourceQuantity } from './types/metric';
import { WorkloadBaseModel } from './workload-base-model';

type RequiredPod = Required<Pod> & Unstructured;

interface NetworkStatus {
  name: string;
  ips?: string[];
}
export class PodModel extends WorkloadBaseModel {
  public request: ResourceQuantity;
  public limit: ResourceQuantity;
  public declare spec?: RequiredPod['spec'];
  public declare status?: RequiredPod['status'];
  public belongToDeployment: DeploymentModel | undefined;

  constructor(
    public _rawYaml: RequiredPod,
    _globalStore: GlobalStore
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

  getBelongToDeployment(deployments: DeploymentModel[], replicaSets: ReplicaSetModel[]) {
    const ownerReferences = this.metadata.ownerReferences;

    // 通过 ownerReference 匹配 ReplicaSet
    const belongToReplicaSet = replicaSets.find(replicaSet =>
      ownerReferences?.some(ownerReference =>
        ownerReference.kind === 'ReplicaSet' && ownerReference.uid === replicaSet.metadata.uid
      )
    );
    // 通过 ownerReference 匹配 Deployment
    return deployments.find(deployment =>
      belongToReplicaSet?.metadata.ownerReferences?.some(ownerReference =>
        ownerReference.kind === 'Deployment' && ownerReference.uid === deployment.metadata.uid
      )
    );
  }

  get imageNames() {
    return (
      this._rawYaml.spec?.containers.map(container =>
        shortenedImage(container.image || '')
      ) || []
    );
  }

  get restarts() {
    if (this._rawYaml.status?.containerStatuses) {
      return this._rawYaml.status?.containerStatuses.reduce((count, container) => {
        count += container.restartCount;
        return count;
      }, 0) || 0;
    }

    return 0;
  }

  get readyDisplay() {
    return `${this._rawYaml.status?.containerStatuses?.filter(c => c.ready).length || 0}/${this
      ._rawYaml.spec?.containers.length || 0}`;
  }
  get readyContainerCount() {
    return this._rawYaml.status?.containerStatuses?.filter(c => c.ready).length;
  }

  get containerCount() {
    return this._rawYaml.spec?.containers.length;
  }

  get stateDisplay() {
    if (this.metadata.deletionTimestamp) {
      return ResourceState.TERMINATING;
    }
    return this.status?.phase?.toLowerCase() || ResourceState.UNKNOWN;
  }

  get ips() {
    const ips: string[] = [];

    if (this.status?.podIP) {
      ips.push(this.status.podIP);
    }

    const networkStatusStr =
      this.metadata?.annotations?.['k8s.v1.cni.cncf.io/network-status'];
    if (networkStatusStr) {
      try {
        const networkStatus: NetworkStatus[] = JSON.parse(networkStatusStr);

        networkStatus.forEach(network => {
          if (network.ips && Array.isArray(network.ips)) {
            network.ips.forEach(ip => {
              if (!ips.includes(ip)) {
                ips.push(ip);
              }
            });
          }
        });
      } catch (error) {
        console.warn('Failed to parse network-status annotation:', error);
      }
    }

    return ips;
  }

  get ipsDisplay() {
    return this.ips.join(', ');
  }

  get hasDnsConfig() {
    return !!(this.spec?.dnsConfig &&
      (this.spec.dnsConfig.nameservers?.length ||
        this.spec.dnsConfig.searches?.length ||
        this.spec.dnsConfig.options?.length));
  }
}
