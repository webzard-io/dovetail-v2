import { UnstructuredList } from 'k8s-api-provider';
import { WorkloadModel } from '../../src/models';
import { ProviderPlugins } from '../../src/plugins';
import { RawDeploymentList, mockGlobalStore } from './mock';

describe('Test Plugins together', () => {
  ProviderPlugins.forEach(p => p.init(mockGlobalStore as any));

  async function processListByPlugins(list: UnstructuredList) {
    let nextList = list;
    for (const plugin of ProviderPlugins) {
      nextList = await plugin.processData(nextList);
    }
    return nextList;
  }

  it('should return deployment model', async () => {
    const result = await processListByPlugins(RawDeploymentList as UnstructuredList);
    const deploymentModel = result.items[0] as WorkloadModel;
    expect(result.items.length).toEqual(2);
    expect(deploymentModel.restarts).toEqual(5);
  });

  it('should return deployment model with relation', async () => {
    const result = await processListByPlugins(RawDeploymentList as UnstructuredList);
    const deploymentModel = result.items[0] as WorkloadModel;
    expect((deploymentModel.metadata as any).relations).toEqual([
      {
        kind: 'Pod',
        apiVersion: 'v1',
        type: 'creates',
        selector: {
          matchLabels: {
            'app.kubernetes.io/component': 'controller',
            'app.kubernetes.io/instance': 'cert-manager',
            'app.kubernetes.io/name': 'cert-manager',
          },
        },
        inbound: false,
      },
      {
        kind: 'Pod',
        apiVersion: 'v1',
        type: 'creates',
        selector: {
          matchLabels: {
            'app.kubernetes.io/component': 'controller',
            'app.kubernetes.io/instance': 'cert-manager',
            'app.kubernetes.io/name': 'cert-manager',
          },
        },
        inbound: false,
      },
    ]);
  });
});
