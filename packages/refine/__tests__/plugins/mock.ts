import { DeploymentList } from 'kubernetes-types/apps/v1';
import { ReplicaSetList } from 'kubernetes-types/apps/v1';
import { ServiceList, PodList } from 'kubernetes-types/core/v1';
import { IngressList } from 'kubernetes-types/networking/v1';
import {
  PodModel,
  ReplicaSetModel,
  DeploymentModel,
  ServiceModel,
  IngressModel,
  ResourceModel,
} from '../../src/models';

export const mockGlobalStore: any = {
  get(resource: 'pods' | 'services' | 'ingresses' | 'deployments' | 'replicasets') {
    switch (resource) {
      case 'pods':
        return {
          ...RawPodList,
          items: RawPodList.items.map(pod => {
            const podModel = new PodModel(pod as any, mockGlobalStore);
            podModel.init();
            return podModel;
          }),
        };
      case 'services':
        return {
          ...RawServiceList,
          items: RawServiceList.items.map(service => {
            const serviceModel = new ServiceModel(service as any, mockGlobalStore);
            serviceModel.init();
            return serviceModel;
          }),
        };
      case 'ingresses':
        return {
          ...RawIngressList,
          items: RawIngressList.items.map(ingress => {
            const ingressModel = new IngressModel(ingress as any, mockGlobalStore);
            ingressModel.init();
            return ingressModel;
          }),
        };
      case 'deployments':
        return {
          ...RawDeploymentList,
          items: RawDeploymentList.items.map(deployment => {
            const deploymentModel = new DeploymentModel(
              deployment as any,
              mockGlobalStore
            );
            deploymentModel.init();
            return deploymentModel;
          }),
        };
      case 'replicasets':
        return {
          ...RawReplicaSetList,
          items: RawReplicaSetList.items.map(replicaset => {
            const replicasetModel = new ReplicaSetModel(
              replicaset as any,
              mockGlobalStore
            );
            replicasetModel.init();
            return replicasetModel;
          }),
        };
    }
  },
  restoreItem(model: ResourceModel) {
    return model._rawYaml;
  },
};

export const RawPodList: PodList = {
  kind: 'PodList',
  apiVersion: 'v1',
  metadata: {
    resourceVersion: '6238306',
  },
  items: [
    {
      metadata: {
        name: 'cert-manager-7d6d974dbf-drn4r',
        generateName: 'cert-manager-7d6d974dbf-',
        namespace: 'cert-manager',
        uid: 'ec27c3f2-90bc-4749-957e-61adee6fdfac',
        resourceVersion: '6067765',
        creationTimestamp: '2023-11-29T03:17:29Z',
        labels: {
          app: 'cert-manager',
          'app.kubernetes.io/component': 'controller',
          'app.kubernetes.io/instance': 'cert-manager',
          'app.kubernetes.io/managed-by': 'Helm',
          'app.kubernetes.io/name': 'cert-manager',
          'app.kubernetes.io/version': 'v1.8.0',
          'helm.sh/chart': 'cert-manager-v1.8.0',
          'pod-template-hash': '7d6d974dbf',
        },
        annotations: {
          'prometheus.io/path': '/metrics',
          'prometheus.io/port': '9402',
          'prometheus.io/scrape': 'true',
        },
        ownerReferences: [
          {
            apiVersion: 'apps/v1',
            kind: 'ReplicaSet',
            name: 'cert-manager-7d6d974dbf',
            uid: '13955182-e735-488d-9b9a-6410d2686401',
            controller: true,
            blockOwnerDeletion: true,
          },
        ],
        managedFields: [
          {
            manager: 'kube-controller-manager',
            operation: 'Update',
            apiVersion: 'v1',
            time: '2023-11-29T03:17:29Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:metadata': {
                'f:annotations': {
                  '.': {},
                  'f:prometheus.io/path': {},
                  'f:prometheus.io/port': {},
                  'f:prometheus.io/scrape': {},
                },
                'f:generateName': {},
                'f:labels': {
                  '.': {},
                  'f:app': {},
                  'f:app.kubernetes.io/component': {},
                  'f:app.kubernetes.io/instance': {},
                  'f:app.kubernetes.io/managed-by': {},
                  'f:app.kubernetes.io/name': {},
                  'f:app.kubernetes.io/version': {},
                  'f:helm.sh/chart': {},
                  'f:pod-template-hash': {},
                },
                'f:ownerReferences': {
                  '.': {},
                  'k:{"uid":"13955182-e735-488d-9b9a-6410d2686401"}': {
                    '.': {},
                    'f:apiVersion': {},
                    'f:blockOwnerDeletion': {},
                    'f:controller': {},
                    'f:kind': {},
                    'f:name': {},
                    'f:uid': {},
                  },
                },
              },
              'f:spec': {
                'f:containers': {
                  'k:{"name":"cert-manager"}': {
                    '.': {},
                    'f:args': {},
                    'f:env': {
                      '.': {},
                      'k:{"name":"POD_NAMESPACE"}': {
                        '.': {},
                        'f:name': {},
                        'f:valueFrom': {
                          '.': {},
                          'f:fieldRef': {
                            '.': {},
                            'f:apiVersion': {},
                            'f:fieldPath': {},
                          },
                        },
                      },
                    },
                    'f:image': {},
                    'f:imagePullPolicy': {},
                    'f:name': {},
                    'f:ports': {
                      '.': {},
                      'k:{"containerPort":9402,"protocol":"TCP"}': {
                        '.': {},
                        'f:containerPort': {},
                        'f:name': {},
                        'f:protocol': {},
                      },
                    },
                    'f:resources': {
                      '.': {},
                      'f:limits': { '.': {}, 'f:memory': {} },
                      'f:requests': { '.': {}, 'f:memory': {} },
                    },
                    'f:securityContext': {
                      '.': {},
                      'f:allowPrivilegeEscalation': {},
                    },
                    'f:terminationMessagePath': {},
                    'f:terminationMessagePolicy': {},
                  },
                },
                'f:dnsPolicy': {},
                'f:enableServiceLinks': {},
                'f:nodeSelector': { '.': {}, 'f:kubernetes.io/os': {} },
                'f:restartPolicy': {},
                'f:schedulerName': {},
                'f:securityContext': { '.': {}, 'f:runAsNonRoot': {} },
                'f:serviceAccount': {},
                'f:serviceAccountName': {},
                'f:terminationGracePeriodSeconds': {},
              },
            },
          },
          {
            manager: 'kubelet',
            operation: 'Update',
            apiVersion: 'v1',
            time: '2023-12-21T12:27:16Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:status': {
                'f:conditions': {
                  'k:{"type":"ContainersReady"}': {
                    '.': {},
                    'f:lastProbeTime': {},
                    'f:lastTransitionTime': {},
                    'f:status': {},
                    'f:type': {},
                  },
                  'k:{"type":"Initialized"}': {
                    '.': {},
                    'f:lastProbeTime': {},
                    'f:lastTransitionTime': {},
                    'f:status': {},
                    'f:type': {},
                  },
                  'k:{"type":"Ready"}': {
                    '.': {},
                    'f:lastProbeTime': {},
                    'f:lastTransitionTime': {},
                    'f:status': {},
                    'f:type': {},
                  },
                },
                'f:containerStatuses': {},
                'f:hostIP': {},
                'f:phase': {},
                'f:podIP': {},
                'f:podIPs': {
                  '.': {},
                  'k:{"ip":"100.64.0.29"}': { '.': {}, 'f:ip': {} },
                },
                'f:startTime': {},
              },
            },
          },
        ],
      },
      spec: {
        volumes: [
          {
            name: 'cert-manager-token-cqmzj',
            secret: {
              secretName: 'cert-manager-token-cqmzj',
              defaultMode: 420,
            },
          },
        ],
        containers: [
          {
            name: 'cert-manager',
            image: 'quay.io/jetstack/cert-manager-controller:v1.8.0',
            args: [
              '--v=2',
              '--cluster-resource-namespace=$(POD_NAMESPACE)',
              '--leader-election-namespace=kube-system',
            ],
            ports: [
              {
                name: 'http-metrics',
                containerPort: 9402,
                protocol: 'TCP',
              },
            ],
            env: [
              {
                name: 'POD_NAMESPACE',
                valueFrom: {
                  fieldRef: {
                    apiVersion: 'v1',
                    fieldPath: 'metadata.namespace',
                  },
                },
              },
            ],
            resources: {
              limits: {
                memory: '128Mi',
              },
              requests: {
                memory: '128Mi',
              },
            },
            volumeMounts: [
              {
                name: 'cert-manager-token-cqmzj',
                readOnly: true,
                mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
              },
            ],
            terminationMessagePath: '/dev/termination-log',
            terminationMessagePolicy: 'File',
            imagePullPolicy: 'IfNotPresent',
            securityContext: {
              allowPrivilegeEscalation: false,
            },
          },
        ],
        restartPolicy: 'Always',
        terminationGracePeriodSeconds: 30,
        dnsPolicy: 'ClusterFirst',
        nodeSelector: {
          'kubernetes.io/os': 'linux',
        },
        serviceAccountName: 'cert-manager',
        serviceAccount: 'cert-manager',
        nodeName: 'cloudtower',
        securityContext: {
          runAsNonRoot: true,
        },
        schedulerName: 'default-scheduler',
        tolerations: [
          {
            key: 'node.kubernetes.io/not-ready',
            operator: 'Exists',
            effect: 'NoExecute',
            tolerationSeconds: 300,
          },
          {
            key: 'node.kubernetes.io/unreachable',
            operator: 'Exists',
            effect: 'NoExecute',
            tolerationSeconds: 300,
          },
        ],
        priority: 0,
        enableServiceLinks: true,
        preemptionPolicy: 'PreemptLowerPriority',
      },
      status: {
        phase: 'Running',
        conditions: [
          {
            type: 'Initialized',
            status: 'True',
            lastTransitionTime: '2023-11-29T03:17:29Z',
          },
          {
            type: 'Ready',
            status: 'True',
            lastTransitionTime: '2023-12-21T12:27:12Z',
          },
          {
            type: 'ContainersReady',
            status: 'True',
            lastTransitionTime: '2023-12-21T12:27:12Z',
          },
          {
            type: 'PodScheduled',
            status: 'True',
            lastTransitionTime: '2023-11-29T03:17:29Z',
          },
        ],
        hostIP: '192.168.28.26',
        podIP: '100.64.0.29',
        podIPs: [
          {
            ip: '100.64.0.29',
          },
        ],
        startTime: '2023-11-29T03:17:29Z',
        containerStatuses: [
          {
            name: 'cert-manager',
            state: {
              running: {
                startedAt: '2023-12-21T12:27:11Z',
              },
            },
            lastState: {
              terminated: {
                exitCode: 1,
                reason: 'Error',
                startedAt: '2023-12-21T12:16:40Z',
                finishedAt: '2023-12-21T12:27:10Z',
                containerID:
                  'containerd://3a10205d13e56d44286ffcd29f575bd838259e7767a951fffbe2b7974f6eab53',
              },
            },
            ready: true,
            restartCount: 5,
            image: 'quay.io/jetstack/cert-manager-controller:v1.8.0',
            imageID:
              'sha256:2b8eb1ab5ff98a197834e76db6ca722bd8942b18e37433250fd85fcae8ca0ecb',
            containerID:
              'containerd://f276bb499ddbfb17a2a9809f11dbdd29428e858cd12e0c6a708a4e893014df1a',
            started: true,
          },
        ],
        qosClass: 'Burstable',
      },
    },
    {
      metadata: {
        name: 'everoute-operator-5f4ff97c7b-82p5k',
        generateName: 'everoute-operator-5f4ff97c7b-',
        namespace: 'cloudtower-system',
        uid: '02f87a2a-a638-45b5-9651-91bd9e3643b4',
        resourceVersion: '6070413',
        creationTimestamp: '2023-11-29T03:42:08Z',
        labels: {
          app: 'everoute-operator',
          'pod-template-hash': '5f4ff97c7b',
        },
        ownerReferences: [
          {
            apiVersion: 'apps/v1',
            kind: 'ReplicaSet',
            name: 'everoute-operator-5f4ff97c7b',
            uid: '891bfaf9-4ef1-4c71-8eba-dd43f25b2eb9',
            controller: true,
            blockOwnerDeletion: true,
          },
        ],
        managedFields: [
          {
            manager: 'kube-controller-manager',
            operation: 'Update',
            apiVersion: 'v1',
            time: '2023-11-29T03:42:08Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:metadata': {
                'f:generateName': {},
                'f:labels': { '.': {}, 'f:app': {}, 'f:pod-template-hash': {} },
                'f:ownerReferences': {
                  '.': {},
                  'k:{"uid":"891bfaf9-4ef1-4c71-8eba-dd43f25b2eb9"}': {
                    '.': {},
                    'f:apiVersion': {},
                    'f:blockOwnerDeletion': {},
                    'f:controller': {},
                    'f:kind': {},
                    'f:name': {},
                    'f:uid': {},
                  },
                },
              },
              'f:spec': {
                'f:containers': {
                  'k:{"name":"everoute-operator"}': {
                    '.': {},
                    'f:args': {},
                    'f:command': {},
                    'f:image': {},
                    'f:imagePullPolicy': {},
                    'f:name': {},
                    'f:readinessProbe': {
                      '.': {},
                      'f:failureThreshold': {},
                      'f:httpGet': {
                        '.': {},
                        'f:path': {},
                        'f:port': {},
                        'f:scheme': {},
                      },
                      'f:initialDelaySeconds': {},
                      'f:periodSeconds': {},
                      'f:successThreshold': {},
                      'f:timeoutSeconds': {},
                    },
                    'f:resources': {
                      '.': {},
                      'f:limits': { '.': {}, 'f:memory': {} },
                      'f:requests': { '.': {}, 'f:memory': {} },
                    },
                    'f:terminationMessagePath': {},
                    'f:terminationMessagePolicy': {},
                    'f:volumeMounts': {
                      '.': {},
                      'k:{"mountPath":"/data/"}': {
                        '.': {},
                        'f:mountPath': {},
                        'f:name': {},
                      },
                      'k:{"mountPath":"/etc/everoute-operator/secrets/ca/"}': {
                        '.': {},
                        'f:mountPath': {},
                        'f:name': {},
                      },
                      'k:{"mountPath":"/etc/everoute-operator/secrets/cloudtower/"}': {
                        '.': {},
                        'f:mountPath': {},
                        'f:name': {},
                      },
                      'k:{"mountPath":"/etc/everoute-operator/secrets/containerd/"}': {
                        '.': {},
                        'f:mountPath': {},
                        'f:name': {},
                      },
                      'k:{"mountPath":"/etc/everoute-operator/secrets/ssh/"}': {
                        '.': {},
                        'f:mountPath': {},
                        'f:name': {},
                      },
                    },
                  },
                },
                'f:dnsPolicy': {},
                'f:enableServiceLinks': {},
                'f:nodeSelector': { '.': {}, 'f:kubernetes.io/os': {} },
                'f:restartPolicy': {},
                'f:schedulerName': {},
                'f:securityContext': {},
                'f:serviceAccount': {},
                'f:serviceAccountName': {},
                'f:terminationGracePeriodSeconds': {},
                'f:volumes': {
                  '.': {},
                  'k:{"name":"client-ca-certs"}': {
                    '.': {},
                    'f:name': {},
                    'f:secret': {
                      '.': {},
                      'f:defaultMode': {},
                      'f:secretName': {},
                    },
                  },
                  'k:{"name":"cloudtower-server"}': {
                    '.': {},
                    'f:name': {},
                    'f:secret': {
                      '.': {},
                      'f:defaultMode': {},
                      'f:secretName': {},
                    },
                  },
                  'k:{"name":"containerd-client-certs"}': {
                    '.': {},
                    'f:name': {},
                    'f:secret': {
                      '.': {},
                      'f:defaultMode': {},
                      'f:secretName': {},
                    },
                  },
                  'k:{"name":"everoute-packages"}': {
                    '.': {},
                    'f:name': {},
                    'f:persistentVolumeClaim': { '.': {}, 'f:claimName': {} },
                  },
                  'k:{"name":"ssh-private-key"}': {
                    '.': {},
                    'f:name': {},
                    'f:secret': {
                      '.': {},
                      'f:defaultMode': {},
                      'f:secretName': {},
                    },
                  },
                },
              },
            },
          },
          {
            manager: 'kubelet',
            operation: 'Update',
            apiVersion: 'v1',
            time: '2023-12-21T12:43:24Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:status': {
                'f:conditions': {
                  'k:{"type":"ContainersReady"}': {
                    '.': {},
                    'f:lastProbeTime': {},
                    'f:lastTransitionTime': {},
                    'f:status': {},
                    'f:type': {},
                  },
                  'k:{"type":"Initialized"}': {
                    '.': {},
                    'f:lastProbeTime': {},
                    'f:lastTransitionTime': {},
                    'f:status': {},
                    'f:type': {},
                  },
                  'k:{"type":"Ready"}': {
                    '.': {},
                    'f:lastProbeTime': {},
                    'f:lastTransitionTime': {},
                    'f:status': {},
                    'f:type': {},
                  },
                },
                'f:containerStatuses': {},
                'f:hostIP': {},
                'f:phase': {},
                'f:podIP': {},
                'f:podIPs': {
                  '.': {},
                  'k:{"ip":"100.64.0.70"}': { '.': {}, 'f:ip': {} },
                },
                'f:startTime': {},
              },
            },
          },
        ],
      },
      spec: {
        volumes: [
          {
            name: 'everoute-packages',
            persistentVolumeClaim: {
              claimName: 'everoute-packages',
            },
          },
          {
            name: 'containerd-client-certs',
            secret: {
              secretName: 'containerd-client-certs',
              defaultMode: 420,
            },
          },
          {
            name: 'client-ca-certs',
            secret: {
              secretName: 'client-ca-certs',
              defaultMode: 420,
            },
          },
          {
            name: 'ssh-private-key',
            secret: {
              secretName: 'ssh-private-key',
              defaultMode: 420,
            },
          },
          {
            name: 'cloudtower-server',
            secret: {
              secretName: 'cloudtower-server',
              defaultMode: 420,
            },
          },
          {
            name: 'everoute-operator-token-jpz7d',
            secret: {
              secretName: 'everoute-operator-token-jpz7d',
              defaultMode: 420,
            },
          },
        ],
        containers: [
          {
            name: 'everoute-operator',
            image: 'registry.smtx.io/everoute/operator:2.0.2',
            command: ['everoute-operator'],
            args: ['--package-search-path=/data/sources/'],
            resources: {
              limits: {
                memory: '200Mi',
              },
              requests: {
                memory: '30Mi',
              },
            },
            volumeMounts: [
              {
                name: 'everoute-packages',
                mountPath: '/data/',
              },
              {
                name: 'client-ca-certs',
                mountPath: '/etc/everoute-operator/secrets/ca/',
              },
              {
                name: 'containerd-client-certs',
                mountPath: '/etc/everoute-operator/secrets/containerd/',
              },
              {
                name: 'ssh-private-key',
                mountPath: '/etc/everoute-operator/secrets/ssh/',
              },
              {
                name: 'cloudtower-server',
                mountPath: '/etc/everoute-operator/secrets/cloudtower/',
              },
              {
                name: 'everoute-operator-token-jpz7d',
                readOnly: true,
                mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
              },
            ],
            readinessProbe: {
              httpGet: {
                path: '/healthz',
                port: 9443,
                scheme: 'HTTPS',
              },
              initialDelaySeconds: 5,
              timeoutSeconds: 1,
              periodSeconds: 10,
              successThreshold: 1,
              failureThreshold: 3,
            },
            terminationMessagePath: '/dev/termination-log',
            terminationMessagePolicy: 'File',
            imagePullPolicy: 'IfNotPresent',
          },
        ],
        restartPolicy: 'Always',
        terminationGracePeriodSeconds: 30,
        dnsPolicy: 'ClusterFirst',
        nodeSelector: {
          'kubernetes.io/os': 'linux',
        },
        serviceAccountName: 'everoute-operator',
        serviceAccount: 'everoute-operator',
        nodeName: 'cloudtower',
        securityContext: {},
        schedulerName: 'default-scheduler',
        tolerations: [
          {
            key: 'node.kubernetes.io/not-ready',
            operator: 'Exists',
            effect: 'NoExecute',
            tolerationSeconds: 300,
          },
          {
            key: 'node.kubernetes.io/unreachable',
            operator: 'Exists',
            effect: 'NoExecute',
            tolerationSeconds: 300,
          },
        ],
        priority: 0,
        enableServiceLinks: true,
        preemptionPolicy: 'PreemptLowerPriority',
      },
      status: {
        phase: 'Running',
        conditions: [
          {
            type: 'Initialized',
            status: 'True',
            lastTransitionTime: '2023-11-29T03:42:08Z',
          },
          {
            type: 'Ready',
            status: 'True',
            lastTransitionTime: '2023-12-21T12:43:23Z',
          },
          {
            type: 'ContainersReady',
            status: 'True',
            lastTransitionTime: '2023-12-21T12:43:23Z',
          },
          {
            type: 'PodScheduled',
            status: 'True',
            lastTransitionTime: '2023-11-29T03:42:08Z',
          },
        ],
        hostIP: '192.168.28.26',
        podIP: '100.64.0.70',
        podIPs: [
          {
            ip: '100.64.0.70',
          },
        ],
        startTime: '2023-11-29T03:42:08Z',
        containerStatuses: [
          {
            name: 'everoute-operator',
            state: {
              running: {
                startedAt: '2023-12-21T12:43:17Z',
              },
            },
            lastState: {
              terminated: {
                exitCode: 255,
                reason: 'Error',
                startedAt: '2023-12-21T12:26:45Z',
                finishedAt: '2023-12-21T12:41:37Z',
                containerID:
                  'containerd://0b0758e885447a5efef6749d9bd79eb24f8b27f5bdf83971e9c24320fe3c0427',
              },
            },
            ready: true,
            restartCount: 8,
            image: 'registry.smtx.io/everoute/operator:2.0.2',
            imageID:
              'sha256:45cda51de45e0469dcea8f23bd7890a3ce2de07323e919d03120d015d540149b',
            containerID:
              'containerd://51e516af1d55c18214be3e73f91405716852785ee733b873c776e0eaa9af10c6',
            started: true,
          },
        ],
        qosClass: 'Burstable',
      },
    },
    {
      metadata: {
        name: 'calico-apiserver-bc9d74f4c-g459l',
        generateName: 'calico-apiserver-bc9d74f4c-',
        namespace: 'calico-apiserver',
        uid: '51b62728-b3c6-45fa-8ada-fda86f58569c',
        resourceVersion: '1962255',
        creationTimestamp: '2025-11-19T03:14:10Z',
        labels: {
          apiserver: 'true',
          'app.kubernetes.io/name': 'calico-apiserver',
          'k8s-app': 'calico-apiserver',
          'pod-template-hash': 'bc9d74f4c',
        },
        annotations: {
          'cni.projectcalico.org/containerID':
            '609d199f94a2001cb015f2b022e6302334200695cd1ec4db891bbe160d174f66',
          'cni.projectcalico.org/podIP': '172.16.134.77/32',
          'cni.projectcalico.org/podIPs': '172.16.134.77/32',
          'sks-system.hash.operator.tigera.io/calico-apiserver-certs':
            'cfce08d43050bd86ff9244be2bc2c05e17a4315b',
        },
        ownerReferences: [
          {
            apiVersion: 'apps/v1',
            kind: 'ReplicaSet',
            name: 'calico-apiserver-bc9d74f4c',
            uid: '5de4af98-7605-496c-9b76-04d98fda9285',
            controller: true,
            blockOwnerDeletion: true,
          },
        ],
        managedFields: [
          {
            manager: 'kube-controller-manager',
            operation: 'Update',
            apiVersion: 'v1',
            time: '2025-11-19T03:14:10Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:metadata': {
                'f:annotations': {
                  '.': {},
                  'f:sks-system.hash.operator.tigera.io/calico-apiserver-certs': {},
                },
                'f:generateName': {},
                'f:labels': {
                  '.': {},
                  'f:apiserver': {},
                  'f:app.kubernetes.io/name': {},
                  'f:k8s-app': {},
                  'f:pod-template-hash': {},
                },
                'f:ownerReferences': {
                  '.': {},
                  'k:{"uid":"5de4af98-7605-496c-9b76-04d98fda9285"}': {},
                },
              },
              'f:spec': {
                'f:affinity': {
                  '.': {},
                  'f:podAntiAffinity': {
                    '.': {},
                    'f:preferredDuringSchedulingIgnoredDuringExecution': {},
                  },
                },
                'f:containers': {
                  'k:{"name":"calico-apiserver"}': {
                    '.': {},
                    'f:args': {},
                    'f:env': {
                      '.': {},
                      'k:{"name":"DATASTORE_TYPE"}': {
                        '.': {},
                        'f:name': {},
                        'f:value': {},
                      },
                      'k:{"name":"KUBERNETES_SERVICE_HOST"}': {
                        '.': {},
                        'f:name': {},
                        'f:value': {},
                      },
                      'k:{"name":"KUBERNETES_SERVICE_PORT"}': {
                        '.': {},
                        'f:name': {},
                        'f:value': {},
                      },
                      'k:{"name":"MULTI_INTERFACE_MODE"}': {
                        '.': {},
                        'f:name': {},
                        'f:value': {},
                      },
                    },
                    'f:image': {},
                    'f:imagePullPolicy': {},
                    'f:name': {},
                    'f:readinessProbe': {
                      '.': {},
                      'f:failureThreshold': {},
                      'f:httpGet': {
                        '.': {},
                        'f:path': {},
                        'f:port': {},
                        'f:scheme': {},
                      },
                      'f:periodSeconds': {},
                      'f:successThreshold': {},
                      'f:timeoutSeconds': {},
                    },
                    'f:resources': {},
                    'f:securityContext': {
                      '.': {},
                      'f:allowPrivilegeEscalation': {},
                      'f:capabilities': {
                        '.': {},
                        'f:drop': {},
                      },
                      'f:privileged': {},
                      'f:runAsGroup': {},
                      'f:runAsNonRoot': {},
                      'f:runAsUser': {},
                      'f:seccompProfile': {
                        '.': {},
                        'f:type': {},
                      },
                    },
                    'f:terminationMessagePath': {},
                    'f:terminationMessagePolicy': {},
                    'f:volumeMounts': {
                      '.': {},
                      'k:{"mountPath":"/calico-apiserver-certs"}': {
                        '.': {},
                        'f:mountPath': {},
                        'f:name': {},
                        'f:readOnly': {},
                      },
                    },
                  },
                },
                'f:dnsPolicy': {},
                'f:enableServiceLinks': {},
                'f:nodeSelector': {},
                'f:restartPolicy': {},
                'f:schedulerName': {},
                'f:securityContext': {},
                'f:serviceAccount': {},
                'f:serviceAccountName': {},
                'f:terminationGracePeriodSeconds': {},
                'f:tolerations': {},
                'f:volumes': {
                  '.': {},
                  'k:{"name":"calico-apiserver-certs"}': {
                    '.': {},
                    'f:name': {},
                    'f:secret': {
                      '.': {},
                      'f:defaultMode': {},
                      'f:secretName': {},
                    },
                  },
                },
              },
            },
          },
          {
            manager: 'calico',
            operation: 'Update',
            apiVersion: 'v1',
            time: '2025-11-19T03:14:13Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:metadata': {
                'f:annotations': {
                  'f:cni.projectcalico.org/containerID': {},
                  'f:cni.projectcalico.org/podIP': {},
                  'f:cni.projectcalico.org/podIPs': {},
                },
              },
            },
            subresource: 'status',
          },
          {
            manager: 'kubelet',
            operation: 'Update',
            apiVersion: 'v1',
            time: '2025-11-24T05:16:02Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:status': {
                'f:conditions': {
                  'k:{"type":"ContainersReady"}': {
                    '.': {},
                    'f:lastProbeTime': {},
                    'f:lastTransitionTime': {},
                    'f:status': {},
                    'f:type': {},
                  },
                  'k:{"type":"Initialized"}': {
                    '.': {},
                    'f:lastProbeTime': {},
                    'f:lastTransitionTime': {},
                    'f:status': {},
                    'f:type': {},
                  },
                  'k:{"type":"Ready"}': {
                    '.': {},
                    'f:lastProbeTime': {},
                    'f:lastTransitionTime': {},
                    'f:status': {},
                    'f:type': {},
                  },
                },
                'f:containerStatuses': {},
                'f:hostIP': {},
                'f:phase': {},
                'f:podIP': {},
                'f:podIPs': {
                  '.': {},
                  'k:{"ip":"172.16.134.77"}': {
                    '.': {},
                    'f:ip': {},
                  },
                },
                'f:startTime': {},
              },
            },
            subresource: 'status',
          },
        ],
      },
      spec: {
        volumes: [
          {
            name: 'calico-apiserver-certs',
            secret: {
              secretName: 'calico-apiserver-certs',
              defaultMode: 420,
            },
          },
          {
            name: 'kube-api-access-2fpzt',
            projected: {
              sources: [
                {
                  serviceAccountToken: {
                    expirationSeconds: 3607,
                    path: 'token',
                  },
                },
                {
                  configMap: {
                    name: 'kube-root-ca.crt',
                    items: [
                      {
                        key: 'ca.crt',
                        path: 'ca.crt',
                      },
                    ],
                  },
                },
                {
                  downwardAPI: {
                    items: [
                      {
                        path: 'namespace',
                        fieldRef: {
                          apiVersion: 'v1',
                          fieldPath: 'metadata.namespace',
                        },
                      },
                    ],
                  },
                },
              ],
              defaultMode: 420,
            },
          },
        ],
        containers: [
          {
            name: 'calico-apiserver',
            image: '10.255.233.201/sks/calico/apiserver:v3.29.5',
            args: [
              '--secure-port=5443',
              '--tls-private-key-file=/calico-apiserver-certs/tls.key',
              '--tls-cert-file=/calico-apiserver-certs/tls.crt',
              '--enable-validating-admission-policy=false',
            ],
            env: [
              {
                name: 'DATASTORE_TYPE',
                value: 'kubernetes',
              },
              {
                name: 'KUBERNETES_SERVICE_HOST',
                value: '10.96.0.1',
              },
              {
                name: 'KUBERNETES_SERVICE_PORT',
                value: '443',
              },
              {
                name: 'MULTI_INTERFACE_MODE',
                value: 'none',
              },
            ],
            resources: {},
            volumeMounts: [
              {
                name: 'calico-apiserver-certs',
                readOnly: true,
                mountPath: '/calico-apiserver-certs',
              },
              {
                name: 'kube-api-access-2fpzt',
                readOnly: true,
                mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
              },
            ],
            readinessProbe: {
              httpGet: {
                path: '/readyz',
                port: 5443,
                scheme: 'HTTPS',
              },
              timeoutSeconds: 5,
              periodSeconds: 60,
              successThreshold: 1,
              failureThreshold: 3,
            },
            terminationMessagePath: '/dev/termination-log',
            terminationMessagePolicy: 'File',
            imagePullPolicy: 'IfNotPresent',
            securityContext: {
              capabilities: {
                drop: ['ALL'],
              },
              privileged: false,
              runAsUser: 10001,
              runAsGroup: 10001,
              runAsNonRoot: true,
              allowPrivilegeEscalation: false,
              seccompProfile: {
                type: 'RuntimeDefault',
              },
            },
          },
        ],
        restartPolicy: 'Always',
        terminationGracePeriodSeconds: 30,
        dnsPolicy: 'ClusterFirst',
        nodeSelector: {
          'kubernetes.io/os': 'linux',
        },
        serviceAccountName: 'calico-apiserver',
        serviceAccount: 'calico-apiserver',
        nodeName: 'test-controlplane-z2vkt',
        securityContext: {},
        affinity: {
          podAntiAffinity: {
            preferredDuringSchedulingIgnoredDuringExecution: [
              {
                weight: 100,
                podAffinityTerm: {
                  labelSelector: {
                    matchLabels: {
                      'k8s-app': 'calico-apiserver',
                    },
                  },
                  namespaces: ['calico-apiserver'],
                  topologyKey: 'kubernetes.io/hostname',
                },
              },
              {
                weight: 100,
                podAffinityTerm: {
                  labelSelector: {
                    matchLabels: {
                      'k8s-app': 'calico-apiserver',
                    },
                  },
                  namespaces: ['calico-apiserver'],
                  topologyKey: 'topology.kubernetes.io/zone',
                },
              },
            ],
          },
        },
        schedulerName: 'default-scheduler',
        tolerations: [
          {
            key: 'node-role.kubernetes.io/master',
            effect: 'NoSchedule',
          },
          {
            key: 'node-role.kubernetes.io/control-plane',
            effect: 'NoSchedule',
          },
          {
            key: 'node.kubernetes.io/not-ready',
            effect: 'NoSchedule',
          },
          {
            key: 'node.kubernetes.io/network-unavailable',
            effect: 'NoSchedule',
          },
          {
            key: 'node.kubernetes.io/unreachable',
            effect: 'NoSchedule',
          },
          {
            key: 'node.kubernetes.io/not-ready',
            effect: 'NoExecute',
          },
          {
            key: 'node.kubernetes.io/unreachable',
            effect: 'NoExecute',
            tolerationSeconds: 300,
          },
          {
            key: 'node-role.kubernetes.io/master',
            effect: 'NoSchedule',
          },
          {
            key: 'node-role.kubernetes.io/control-plane',
            effect: 'NoSchedule',
          },
        ],
        priority: 0,
        enableServiceLinks: true,
        preemptionPolicy: 'PreemptLowerPriority',
      },
      status: {
        phase: 'Running',
        conditions: [
          {
            type: 'Initialized',
            status: 'True',
            lastProbeTime: null,
            lastTransitionTime: '2025-11-19T03:14:10Z',
          },
          {
            type: 'Ready',
            status: 'True',
            lastProbeTime: null,
            lastTransitionTime: '2025-11-24T05:16:01Z',
          },
          {
            type: 'ContainersReady',
            status: 'True',
            lastProbeTime: null,
            lastTransitionTime: '2025-11-24T05:16:01Z',
          },
          {
            type: 'PodScheduled',
            status: 'True',
            lastProbeTime: null,
            lastTransitionTime: '2025-11-19T03:14:10Z',
          },
        ],
        hostIP: '10.255.1.39',
        podIP: '172.16.134.77',
        podIPs: [
          {
            ip: '172.16.134.77',
          },
        ],
        startTime: '2025-11-19T03:14:10Z',
        containerStatuses: [
          {
            name: 'calico-apiserver',
            state: {
              running: {
                startedAt: '2025-11-19T03:14:15Z',
              },
            },
            lastState: {},
            ready: true,
            restartCount: 0,
            image: '10.255.233.201/sks/calico/apiserver:v3.29.5',
            imageID:
              '10.255.233.201/sks/calico/apiserver@sha256:a49e68b0b6fff0ab3e2826e6728d46798a04d8031ab405d1f44cd4f26fd0a521',
            containerID:
              'containerd://ed4113066f7370bd2051a6057bd2a95902cb24b53d7aadf9c8fb7dc8fc3ddfa5',
            started: true,
          },
        ],
        qosClass: 'BestEffort',
      },
    },
  ],
};

export const RawDeploymentList: DeploymentList = {
  kind: 'DeploymentList',
  apiVersion: 'apps/v1',
  metadata: {
    resourceVersion: '6238435',
  },
  items: [
    {
      metadata: {
        name: 'cert-manager',
        namespace: 'cert-manager',
        uid: '47692b3f-84a4-45fa-acd9-79b3035f0613',
        resourceVersion: '3020',
        generation: 1,
        creationTimestamp: '2023-11-29T03:17:29Z',
        labels: {
          app: 'cert-manager',
          'app.kubernetes.io/component': 'controller',
          'app.kubernetes.io/instance': 'cert-manager',
          'app.kubernetes.io/managed-by': 'Helm',
          'app.kubernetes.io/name': 'cert-manager',
          'app.kubernetes.io/version': 'v1.8.0',
          'helm.sh/chart': 'cert-manager-v1.8.0',
        },
        annotations: {
          'deployment.kubernetes.io/revision': '1',
          'meta.helm.sh/release-name': 'cert-manager',
          'meta.helm.sh/release-namespace': 'cert-manager',
        },
        managedFields: [
          {
            manager: 'helm',
            operation: 'Update',
            apiVersion: 'apps/v1',
            time: '2023-11-29T03:17:29Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:metadata': {
                'f:annotations': {
                  '.': {},
                  'f:meta.helm.sh/release-name': {},
                  'f:meta.helm.sh/release-namespace': {},
                },
                'f:labels': {
                  '.': {},
                  'f:app': {},
                  'f:app.kubernetes.io/component': {},
                  'f:app.kubernetes.io/instance': {},
                  'f:app.kubernetes.io/managed-by': {},
                  'f:app.kubernetes.io/name': {},
                  'f:app.kubernetes.io/version': {},
                  'f:helm.sh/chart': {},
                },
              },
              'f:spec': {
                'f:progressDeadlineSeconds': {},
                'f:replicas': {},
                'f:revisionHistoryLimit': {},
                'f:selector': {},
                'f:strategy': {
                  'f:rollingUpdate': {
                    '.': {},
                    'f:maxSurge': {},
                    'f:maxUnavailable': {},
                  },
                  'f:type': {},
                },
                'f:template': {
                  'f:metadata': {
                    'f:annotations': {
                      '.': {},
                      'f:prometheus.io/path': {},
                      'f:prometheus.io/port': {},
                      'f:prometheus.io/scrape': {},
                    },
                    'f:labels': {
                      '.': {},
                      'f:app': {},
                      'f:app.kubernetes.io/component': {},
                      'f:app.kubernetes.io/instance': {},
                      'f:app.kubernetes.io/managed-by': {},
                      'f:app.kubernetes.io/name': {},
                      'f:app.kubernetes.io/version': {},
                      'f:helm.sh/chart': {},
                    },
                  },
                  'f:spec': {
                    'f:containers': {
                      'k:{"name":"cert-manager"}': {
                        '.': {},
                        'f:args': {},
                        'f:env': {
                          '.': {},
                          'k:{"name":"POD_NAMESPACE"}': {
                            '.': {},
                            'f:name': {},
                            'f:valueFrom': {
                              '.': {},
                              'f:fieldRef': {
                                '.': {},
                                'f:apiVersion': {},
                                'f:fieldPath': {},
                              },
                            },
                          },
                        },
                        'f:image': {},
                        'f:imagePullPolicy': {},
                        'f:name': {},
                        'f:ports': {
                          '.': {},
                          'k:{"containerPort":9402,"protocol":"TCP"}': {
                            '.': {},
                            'f:containerPort': {},
                            'f:name': {},
                            'f:protocol': {},
                          },
                        },
                        'f:resources': {
                          '.': {},
                          'f:limits': { '.': {}, 'f:memory': {} },
                          'f:requests': { '.': {}, 'f:memory': {} },
                        },
                        'f:securityContext': {
                          '.': {},
                          'f:allowPrivilegeEscalation': {},
                        },
                        'f:terminationMessagePath': {},
                        'f:terminationMessagePolicy': {},
                      },
                    },
                    'f:dnsPolicy': {},
                    'f:nodeSelector': { '.': {}, 'f:kubernetes.io/os': {} },
                    'f:restartPolicy': {},
                    'f:schedulerName': {},
                    'f:securityContext': { '.': {}, 'f:runAsNonRoot': {} },
                    'f:serviceAccount': {},
                    'f:serviceAccountName': {},
                    'f:terminationGracePeriodSeconds': {},
                  },
                },
              },
            },
          },
          {
            manager: 'kube-controller-manager',
            operation: 'Update',
            apiVersion: 'apps/v1',
            time: '2023-11-29T03:17:31Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:metadata': {
                'f:annotations': { 'f:deployment.kubernetes.io/revision': {} },
              },
              'f:status': {
                'f:availableReplicas': {},
                'f:conditions': {
                  '.': {},
                  'k:{"type":"Available"}': {
                    '.': {},
                    'f:lastTransitionTime': {},
                    'f:lastUpdateTime': {},
                    'f:message': {},
                    'f:reason': {},
                    'f:status': {},
                    'f:type': {},
                  },
                  'k:{"type":"Progressing"}': {
                    '.': {},
                    'f:lastTransitionTime': {},
                    'f:lastUpdateTime': {},
                    'f:message': {},
                    'f:reason': {},
                    'f:status': {},
                    'f:type': {},
                  },
                },
                'f:observedGeneration': {},
                'f:readyReplicas': {},
                'f:replicas': {},
                'f:updatedReplicas': {},
              },
            },
          },
        ],
      },
      spec: {
        replicas: 1,
        selector: {
          matchLabels: {
            'app.kubernetes.io/component': 'controller',
            'app.kubernetes.io/instance': 'cert-manager',
            'app.kubernetes.io/name': 'cert-manager',
          },
        },
        template: {
          metadata: {
            creationTimestamp: undefined,
            labels: {
              app: 'cert-manager',
              'app.kubernetes.io/component': 'controller',
              'app.kubernetes.io/instance': 'cert-manager',
              'app.kubernetes.io/managed-by': 'Helm',
              'app.kubernetes.io/name': 'cert-manager',
              'app.kubernetes.io/version': 'v1.8.0',
              'helm.sh/chart': 'cert-manager-v1.8.0',
            },
            annotations: {
              'prometheus.io/path': '/metrics',
              'prometheus.io/port': '9402',
              'prometheus.io/scrape': 'true',
            },
          },
          spec: {
            containers: [
              {
                name: 'cert-manager',
                image: 'quay.io/jetstack/cert-manager-controller:v1.8.0',
                args: [
                  '--v=2',
                  '--cluster-resource-namespace=$(POD_NAMESPACE)',
                  '--leader-election-namespace=kube-system',
                ],
                ports: [
                  {
                    name: 'http-metrics',
                    containerPort: 9402,
                    protocol: 'TCP',
                  },
                ],
                env: [
                  {
                    name: 'POD_NAMESPACE',
                    valueFrom: {
                      fieldRef: {
                        apiVersion: 'v1',
                        fieldPath: 'metadata.namespace',
                      },
                    },
                  },
                ],
                resources: {
                  limits: {
                    memory: '128Mi',
                  },
                  requests: {
                    memory: '128Mi',
                  },
                },
                terminationMessagePath: '/dev/termination-log',
                terminationMessagePolicy: 'File',
                imagePullPolicy: 'IfNotPresent',
                securityContext: {
                  allowPrivilegeEscalation: false,
                },
              },
            ],
            restartPolicy: 'Always',
            terminationGracePeriodSeconds: 30,
            dnsPolicy: 'ClusterFirst',
            nodeSelector: {
              'kubernetes.io/os': 'linux',
            },
            serviceAccountName: 'cert-manager',
            serviceAccount: 'cert-manager',
            securityContext: {
              runAsNonRoot: true,
            },
            schedulerName: 'default-scheduler',
          },
        },
        strategy: {
          type: 'RollingUpdate',
          rollingUpdate: {
            maxUnavailable: '25%',
            maxSurge: '25%',
          },
        },
        revisionHistoryLimit: 10,
        progressDeadlineSeconds: 600,
      },
      status: {
        observedGeneration: 1,
        replicas: 1,
        updatedReplicas: 1,
        readyReplicas: 1,
        availableReplicas: 1,
        conditions: [
          {
            type: 'Available',
            status: 'True',
            lastUpdateTime: '2023-11-29T03:17:31Z',
            lastTransitionTime: '2023-11-29T03:17:31Z',
            reason: 'MinimumReplicasAvailable',
            message: 'Deployment has minimum availability.',
          },
          {
            type: 'Progressing',
            status: 'True',
            lastUpdateTime: '2023-11-29T03:17:31Z',
            lastTransitionTime: '2023-11-29T03:17:29Z',
            reason: 'NewReplicaSetAvailable',
            message: 'ReplicaSet "cert-manager-7d6d974dbf" has successfully progressed.',
          },
        ],
      },
    },
    {
      metadata: {
        name: 'everoute-operator',
        namespace: 'cloudtower-system',
        uid: '5be30bf1-49f1-45eb-8998-c9dfe7333e5c',
        resourceVersion: '6067247',
        generation: 2,
        creationTimestamp: '2023-11-29T03:21:01Z',
        labels: {
          'app.kubernetes.io/managed-by': 'Helm',
        },
        annotations: {
          'deployment.kubernetes.io/revision': '2',
          'meta.helm.sh/release-name': 'everoute-operator',
          'meta.helm.sh/release-namespace': 'cloudtower-system',
        },
        managedFields: [
          {
            manager: 'helm',
            operation: 'Update',
            apiVersion: 'apps/v1',
            time: '2023-11-29T03:21:01Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:metadata': {
                'f:annotations': {
                  '.': {},
                  'f:meta.helm.sh/release-name': {},
                  'f:meta.helm.sh/release-namespace': {},
                },
                'f:labels': { '.': {}, 'f:app.kubernetes.io/managed-by': {} },
              },
              'f:spec': {
                'f:progressDeadlineSeconds': {},
                'f:replicas': {},
                'f:revisionHistoryLimit': {},
                'f:selector': {},
                'f:strategy': {
                  'f:rollingUpdate': {
                    '.': {},
                    'f:maxSurge': {},
                    'f:maxUnavailable': {},
                  },
                  'f:type': {},
                },
                'f:template': {
                  'f:metadata': { 'f:labels': { '.': {}, 'f:app': {} } },
                  'f:spec': {
                    'f:containers': {
                      'k:{"name":"everoute-operator"}': {
                        '.': {},
                        'f:args': {},
                        'f:command': {},
                        'f:image': {},
                        'f:imagePullPolicy': {},
                        'f:name': {},
                        'f:readinessProbe': {
                          '.': {},
                          'f:failureThreshold': {},
                          'f:httpGet': {
                            '.': {},
                            'f:path': {},
                            'f:port': {},
                            'f:scheme': {},
                          },
                          'f:initialDelaySeconds': {},
                          'f:periodSeconds': {},
                          'f:successThreshold': {},
                          'f:timeoutSeconds': {},
                        },
                        'f:resources': {
                          '.': {},
                          'f:limits': { '.': {}, 'f:memory': {} },
                          'f:requests': { '.': {}, 'f:memory': {} },
                        },
                        'f:terminationMessagePath': {},
                        'f:terminationMessagePolicy': {},
                        'f:volumeMounts': {
                          '.': {},
                          'k:{"mountPath":"/data/"}': {
                            '.': {},
                            'f:mountPath': {},
                            'f:name': {},
                          },
                          'k:{"mountPath":"/etc/everoute-operator/secrets/ca/"}': {
                            '.': {},
                            'f:mountPath': {},
                            'f:name': {},
                          },
                          'k:{"mountPath":"/etc/everoute-operator/secrets/cloudtower/"}':
                            {
                              '.': {},
                              'f:mountPath': {},
                              'f:name': {},
                            },
                          'k:{"mountPath":"/etc/everoute-operator/secrets/containerd/"}':
                            {
                              '.': {},
                              'f:mountPath': {},
                              'f:name': {},
                            },
                          'k:{"mountPath":"/etc/everoute-operator/secrets/ssh/"}': {
                            '.': {},
                            'f:mountPath': {},
                            'f:name': {},
                          },
                        },
                      },
                    },
                    'f:dnsPolicy': {},
                    'f:nodeSelector': { '.': {}, 'f:kubernetes.io/os': {} },
                    'f:restartPolicy': {},
                    'f:schedulerName': {},
                    'f:securityContext': {},
                    'f:serviceAccount': {},
                    'f:serviceAccountName': {},
                    'f:terminationGracePeriodSeconds': {},
                    'f:volumes': {
                      '.': {},
                      'k:{"name":"client-ca-certs"}': {
                        '.': {},
                        'f:name': {},
                        'f:secret': {
                          '.': {},
                          'f:defaultMode': {},
                          'f:secretName': {},
                        },
                      },
                      'k:{"name":"cloudtower-server"}': {
                        '.': {},
                        'f:name': {},
                        'f:secret': {
                          '.': {},
                          'f:defaultMode': {},
                          'f:secretName': {},
                        },
                      },
                      'k:{"name":"containerd-client-certs"}': {
                        '.': {},
                        'f:name': {},
                        'f:secret': {
                          '.': {},
                          'f:defaultMode': {},
                          'f:secretName': {},
                        },
                      },
                      'k:{"name":"everoute-packages"}': {
                        '.': {},
                        'f:name': {},
                        'f:persistentVolumeClaim': {
                          '.': {},
                          'f:claimName': {},
                        },
                      },
                      'k:{"name":"ssh-private-key"}': {
                        '.': {},
                        'f:name': {},
                        'f:secret': {
                          '.': {},
                          'f:defaultMode': {},
                          'f:secretName': {},
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          {
            manager: 'kube-controller-manager',
            operation: 'Update',
            apiVersion: 'apps/v1',
            time: '2023-12-21T12:22:48Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:metadata': {
                'f:annotations': { 'f:deployment.kubernetes.io/revision': {} },
              },
              'f:status': {
                'f:availableReplicas': {},
                'f:conditions': {
                  '.': {},
                  'k:{"type":"Available"}': {
                    '.': {},
                    'f:lastTransitionTime': {},
                    'f:lastUpdateTime': {},
                    'f:message': {},
                    'f:reason': {},
                    'f:status': {},
                    'f:type': {},
                  },
                  'k:{"type":"Progressing"}': {
                    '.': {},
                    'f:lastTransitionTime': {},
                    'f:lastUpdateTime': {},
                    'f:message': {},
                    'f:reason': {},
                    'f:status': {},
                    'f:type': {},
                  },
                },
                'f:observedGeneration': {},
                'f:readyReplicas': {},
                'f:replicas': {},
                'f:updatedReplicas': {},
              },
            },
          },
        ],
      },
      spec: {
        replicas: 2,
        selector: {
          matchLabels: {
            app: 'everoute-operator',
          },
        },
        template: {
          metadata: {
            creationTimestamp: '2023-11-29T03:17:29Z',
            labels: {
              app: 'everoute-operator',
            },
          },
          spec: {
            volumes: [
              {
                name: 'everoute-packages',
                persistentVolumeClaim: {
                  claimName: 'everoute-packages',
                },
              },
              {
                name: 'containerd-client-certs',
                secret: {
                  secretName: 'containerd-client-certs',
                  defaultMode: 420,
                },
              },
              {
                name: 'client-ca-certs',
                secret: {
                  secretName: 'client-ca-certs',
                  defaultMode: 420,
                },
              },
              {
                name: 'ssh-private-key',
                secret: {
                  secretName: 'ssh-private-key',
                  defaultMode: 420,
                },
              },
              {
                name: 'cloudtower-server',
                secret: {
                  secretName: 'cloudtower-server',
                  defaultMode: 420,
                },
              },
            ],
            containers: [
              {
                name: 'everoute-operator',
                image: 'registry.smtx.io/everoute/operator:2.0.2',
                command: ['everoute-operator'],
                args: ['--package-search-path=/data/sources/'],
                resources: {
                  limits: {
                    memory: '200Mi',
                  },
                  requests: {
                    memory: '30Mi',
                  },
                },
                volumeMounts: [
                  {
                    name: 'everoute-packages',
                    mountPath: '/data/',
                  },
                  {
                    name: 'client-ca-certs',
                    mountPath: '/etc/everoute-operator/secrets/ca/',
                  },
                  {
                    name: 'containerd-client-certs',
                    mountPath: '/etc/everoute-operator/secrets/containerd/',
                  },
                  {
                    name: 'ssh-private-key',
                    mountPath: '/etc/everoute-operator/secrets/ssh/',
                  },
                  {
                    name: 'cloudtower-server',
                    mountPath: '/etc/everoute-operator/secrets/cloudtower/',
                  },
                ],
                readinessProbe: {
                  httpGet: {
                    path: '/healthz',
                    port: 9443,
                    scheme: 'HTTPS',
                  },
                  initialDelaySeconds: 5,
                  timeoutSeconds: 1,
                  periodSeconds: 10,
                  successThreshold: 1,
                  failureThreshold: 3,
                },
                terminationMessagePath: '/dev/termination-log',
                terminationMessagePolicy: 'File',
                imagePullPolicy: 'IfNotPresent',
              },
            ],
            restartPolicy: 'Always',
            terminationGracePeriodSeconds: 30,
            dnsPolicy: 'ClusterFirst',
            nodeSelector: {
              'kubernetes.io/os': 'linux',
            },
            serviceAccountName: 'everoute-operator',
            serviceAccount: 'everoute-operator',
            securityContext: {},
            schedulerName: 'default-scheduler',
          },
        },
        strategy: {
          type: 'RollingUpdate',
          rollingUpdate: {
            maxUnavailable: '25%',
            maxSurge: '25%',
          },
        },
        revisionHistoryLimit: 10,
        progressDeadlineSeconds: 600,
      },
      status: {
        observedGeneration: 2,
        replicas: 2,
        updatedReplicas: 2,
        readyReplicas: 2,
        availableReplicas: 2,
        conditions: [
          {
            type: 'Progressing',
            status: 'True',
            lastUpdateTime: '2023-11-29T03:42:24Z',
            lastTransitionTime: '2023-11-29T03:21:01Z',
            reason: 'NewReplicaSetAvailable',
            message:
              'ReplicaSet "everoute-operator-5f4ff97c7b" has successfully progressed.',
          },
          {
            type: 'Available',
            status: 'True',
            lastUpdateTime: '2023-12-21T12:22:48Z',
            lastTransitionTime: '2023-12-21T12:22:48Z',
            reason: 'MinimumReplicasAvailable',
            message: 'Deployment has minimum availability.',
          },
        ],
      },
    },
    {
      metadata: {
        name: 'calico-apiserver',
        namespace: 'calico-apiserver',
        uid: 'f24292d6-1323-4f94-be3a-c624b06bcbd7',
        resourceVersion: '2124',
        generation: 1,
        creationTimestamp: '2025-11-18T05:54:42Z',
        labels: {
          apiserver: 'true',
          'app.kubernetes.io/name': 'calico-apiserver',
          'k8s-app': 'calico-apiserver',
        },
        annotations: {
          'deployment.kubernetes.io/revision': '1',
        },
        ownerReferences: [
          {
            apiVersion: 'operator.tigera.io/v1',
            kind: 'APIServer',
            name: 'default',
            uid: '0b3450e6-73df-4b9c-9aab-1d3cf0907f75',
            controller: true,
            blockOwnerDeletion: true,
          },
        ],
        managedFields: [
          {
            manager: 'operator',
            operation: 'Update',
            apiVersion: 'apps/v1',
            time: '2025-11-18T05:54:42Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:metadata': {
                'f:labels': {
                  '.': {},
                  'f:apiserver': {},
                  'f:app.kubernetes.io/name': {},
                  'f:k8s-app': {},
                },
                'f:ownerReferences': {
                  '.': {},
                  'k:{"uid":"0b3450e6-73df-4b9c-9aab-1d3cf0907f75"}': {},
                },
              },
              'f:spec': {
                'f:progressDeadlineSeconds': {},
                'f:replicas': {},
                'f:revisionHistoryLimit': {},
                'f:selector': {},
                'f:strategy': {
                  'f:rollingUpdate': {
                    '.': {},
                    'f:maxSurge': {},
                    'f:maxUnavailable': {},
                  },
                  'f:type': {},
                },
                'f:template': {
                  'f:metadata': {
                    'f:annotations': {
                      '.': {},
                      'f:sks-system.hash.operator.tigera.io/calico-apiserver-certs': {},
                    },
                    'f:labels': {
                      '.': {},
                      'f:apiserver': {},
                      'f:app.kubernetes.io/name': {},
                      'f:k8s-app': {},
                    },
                    'f:name': {},
                    'f:namespace': {},
                  },
                  'f:spec': {
                    'f:affinity': {
                      '.': {},
                      'f:podAntiAffinity': {
                        '.': {},
                        'f:preferredDuringSchedulingIgnoredDuringExecution': {},
                      },
                    },
                    'f:containers': {
                      'k:{"name":"calico-apiserver"}': {
                        '.': {},
                        'f:args': {},
                        'f:env': {
                          '.': {},
                          'k:{"name":"DATASTORE_TYPE"}': {
                            '.': {},
                            'f:name': {},
                            'f:value': {},
                          },
                          'k:{"name":"KUBERNETES_SERVICE_HOST"}': {
                            '.': {},
                            'f:name': {},
                            'f:value': {},
                          },
                          'k:{"name":"KUBERNETES_SERVICE_PORT"}': {
                            '.': {},
                            'f:name': {},
                            'f:value': {},
                          },
                          'k:{"name":"MULTI_INTERFACE_MODE"}': {
                            '.': {},
                            'f:name': {},
                            'f:value': {},
                          },
                        },
                        'f:image': {},
                        'f:imagePullPolicy': {},
                        'f:name': {},
                        'f:readinessProbe': {
                          '.': {},
                          'f:failureThreshold': {},
                          'f:httpGet': {
                            '.': {},
                            'f:path': {},
                            'f:port': {},
                            'f:scheme': {},
                          },
                          'f:periodSeconds': {},
                          'f:successThreshold': {},
                          'f:timeoutSeconds': {},
                        },
                        'f:resources': {},
                        'f:securityContext': {
                          '.': {},
                          'f:allowPrivilegeEscalation': {},
                          'f:capabilities': {
                            '.': {},
                            'f:drop': {},
                          },
                          'f:privileged': {},
                          'f:runAsGroup': {},
                          'f:runAsNonRoot': {},
                          'f:runAsUser': {},
                          'f:seccompProfile': {
                            '.': {},
                            'f:type': {},
                          },
                        },
                        'f:terminationMessagePath': {},
                        'f:terminationMessagePolicy': {},
                        'f:volumeMounts': {
                          '.': {},
                          'k:{"mountPath":"/calico-apiserver-certs"}': {
                            '.': {},
                            'f:mountPath': {},
                            'f:name': {},
                            'f:readOnly': {},
                          },
                        },
                      },
                    },
                    'f:dnsPolicy': {},
                    'f:nodeSelector': {},
                    'f:restartPolicy': {},
                    'f:schedulerName': {},
                    'f:securityContext': {},
                    'f:serviceAccount': {},
                    'f:serviceAccountName': {},
                    'f:terminationGracePeriodSeconds': {},
                    'f:tolerations': {},
                    'f:volumes': {
                      '.': {},
                      'k:{"name":"calico-apiserver-certs"}': {
                        '.': {},
                        'f:name': {},
                        'f:secret': {
                          '.': {},
                          'f:defaultMode': {},
                          'f:secretName': {},
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          {
            manager: 'kube-controller-manager',
            operation: 'Update',
            apiVersion: 'apps/v1',
            time: '2025-11-18T05:55:20Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:metadata': {
                'f:annotations': {
                  '.': {},
                  'f:deployment.kubernetes.io/revision': {},
                },
              },
              'f:status': {
                'f:availableReplicas': {},
                'f:conditions': {
                  '.': {},
                  'k:{"type":"Available"}': {
                    '.': {},
                    'f:lastTransitionTime': {},
                    'f:lastUpdateTime': {},
                    'f:message': {},
                    'f:reason': {},
                    'f:status': {},
                    'f:type': {},
                  },
                  'k:{"type":"Progressing"}': {
                    '.': {},
                    'f:lastTransitionTime': {},
                    'f:lastUpdateTime': {},
                    'f:message': {},
                    'f:reason': {},
                    'f:status': {},
                    'f:type': {},
                  },
                },
                'f:observedGeneration': {},
                'f:readyReplicas': {},
                'f:replicas': {},
                'f:updatedReplicas': {},
              },
            },
            subresource: 'status',
          },
        ],
      },
      spec: {
        replicas: 2,
        selector: {
          matchLabels: {
            apiserver: 'true',
          },
        },
        template: {
          metadata: {
            name: 'calico-apiserver',
            namespace: 'calico-apiserver',
            creationTimestamp: null,
            labels: {
              apiserver: 'true',
              'app.kubernetes.io/name': 'calico-apiserver',
              'k8s-app': 'calico-apiserver',
            },
            annotations: {
              'sks-system.hash.operator.tigera.io/calico-apiserver-certs':
                'ee83409424d1e7323ad90ae7e6d828cf8517b8ea',
            },
          },
          spec: {
            volumes: [
              {
                name: 'calico-apiserver-certs',
                secret: {
                  secretName: 'calico-apiserver-certs',
                  defaultMode: 420,
                },
              },
            ],
            containers: [
              {
                name: 'calico-apiserver',
                image: '10.255.233.201/sks/calico/apiserver:v3.29.5',
                args: [
                  '--secure-port=5443',
                  '--tls-private-key-file=/calico-apiserver-certs/tls.key',
                  '--tls-cert-file=/calico-apiserver-certs/tls.crt',
                  '--enable-validating-admission-policy=false',
                ],
                env: [
                  {
                    name: 'DATASTORE_TYPE',
                    value: 'kubernetes',
                  },
                  {
                    name: 'KUBERNETES_SERVICE_HOST',
                    value: '10.96.0.1',
                  },
                  {
                    name: 'KUBERNETES_SERVICE_PORT',
                    value: '443',
                  },
                  {
                    name: 'MULTI_INTERFACE_MODE',
                    value: 'none',
                  },
                ],
                resources: {},
                volumeMounts: [
                  {
                    name: 'calico-apiserver-certs',
                    readOnly: true,
                    mountPath: '/calico-apiserver-certs',
                  },
                ],
                readinessProbe: {
                  httpGet: {
                    path: '/readyz',
                    port: 5443,
                    scheme: 'HTTPS',
                  },
                  timeoutSeconds: 5,
                  periodSeconds: 60,
                  successThreshold: 1,
                  failureThreshold: 3,
                },
                terminationMessagePath: '/dev/termination-log',
                terminationMessagePolicy: 'File',
                imagePullPolicy: 'IfNotPresent',
                securityContext: {
                  capabilities: {
                    drop: ['ALL'],
                  },
                  privileged: false,
                  runAsUser: 10001,
                  runAsGroup: 10001,
                  runAsNonRoot: true,
                  allowPrivilegeEscalation: false,
                  seccompProfile: {
                    type: 'RuntimeDefault',
                  },
                },
              },
            ],
            restartPolicy: 'Always',
            terminationGracePeriodSeconds: 30,
            dnsPolicy: 'ClusterFirst',
            nodeSelector: {
              'kubernetes.io/os': 'linux',
            },
            serviceAccountName: 'calico-apiserver',
            serviceAccount: 'calico-apiserver',
            securityContext: {},
            affinity: {
              podAntiAffinity: {
                preferredDuringSchedulingIgnoredDuringExecution: [
                  {
                    weight: 100,
                    podAffinityTerm: {
                      labelSelector: {
                        matchLabels: {
                          'k8s-app': 'calico-apiserver',
                        },
                      },
                      namespaces: ['calico-apiserver'],
                      topologyKey: 'kubernetes.io/hostname',
                    },
                  },
                  {
                    weight: 100,
                    podAffinityTerm: {
                      labelSelector: {
                        matchLabels: {
                          'k8s-app': 'calico-apiserver',
                        },
                      },
                      namespaces: ['calico-apiserver'],
                      topologyKey: 'topology.kubernetes.io/zone',
                    },
                  },
                ],
              },
            },
            schedulerName: 'default-scheduler',
            tolerations: [
              {
                key: 'node-role.kubernetes.io/master',
                effect: 'NoSchedule',
              },
              {
                key: 'node-role.kubernetes.io/control-plane',
                effect: 'NoSchedule',
              },
              {
                key: 'node.kubernetes.io/not-ready',
                effect: 'NoSchedule',
              },
              {
                key: 'node.kubernetes.io/network-unavailable',
                effect: 'NoSchedule',
              },
              {
                key: 'node.kubernetes.io/unreachable',
                effect: 'NoSchedule',
              },
              {
                key: 'node.kubernetes.io/not-ready',
                effect: 'NoExecute',
              },
              {
                key: 'node.kubernetes.io/unreachable',
                effect: 'NoExecute',
                tolerationSeconds: 300,
              },
              {
                key: 'node-role.kubernetes.io/master',
                effect: 'NoSchedule',
              },
              {
                key: 'node-role.kubernetes.io/control-plane',
                effect: 'NoSchedule',
              },
            ],
          },
        },
        strategy: {
          type: 'RollingUpdate',
          rollingUpdate: {
            maxUnavailable: '25%',
            maxSurge: '25%',
          },
        },
        revisionHistoryLimit: 10,
        progressDeadlineSeconds: 600,
      },
      status: {
        observedGeneration: 1,
        replicas: 2,
        updatedReplicas: 2,
        readyReplicas: 2,
        availableReplicas: 2,
        conditions: [
          {
            type: 'Available',
            status: 'True',
            lastUpdateTime: '2025-11-18T05:55:20Z',
            lastTransitionTime: '2025-11-18T05:55:20Z',
            reason: 'MinimumReplicasAvailable',
            message: 'Deployment has minimum availability.',
          },
          {
            type: 'Progressing',
            status: 'True',
            lastUpdateTime: '2025-11-18T05:55:20Z',
            lastTransitionTime: '2025-11-18T05:54:42Z',
            reason: 'NewReplicaSetAvailable',
            message:
              'ReplicaSet "calico-apiserver-848d547c9c" has successfully progressed.',
          },
        ],
      },
    },
  ],
};

export const RawServiceList: ServiceList = {
  kind: 'ServiceList',
  apiVersion: 'v1',
  metadata: {
    resourceVersion: '6238435',
  },
  items: [
    {
      metadata: {
        name: 'calico-api',
        namespace: 'calico-apiserver',
        uid: '86f79b36-40ee-4e6e-9a48-d0f5a560f8b2',
        resourceVersion: '1114',
        creationTimestamp: '2025-11-19T03:13:32Z',
        labels: {
          'k8s-app': 'tigera-api',
          apiserver: 'true',
        },
        ownerReferences: [
          {
            apiVersion: 'operator.tigera.io/v1',
            kind: 'APIServer',
            name: 'default',
            uid: '1e7e788e-79f5-414b-8072-edd21c63315b',
            controller: true,
            blockOwnerDeletion: true,
          },
        ],
        managedFields: [
          {
            manager: 'operator',
            operation: 'Update',
            apiVersion: 'v1',
            time: '2025-11-19T03:13:32Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:metadata': {
                'f:labels': {
                  '.': {},
                  'f:k8s-app': {},
                },
                'f:ownerReferences': {
                  '.': {},
                  'k:{"uid":"1e7e788e-79f5-414b-8072-edd21c63315b"}': {},
                },
              },
              'f:spec': {
                'f:internalTrafficPolicy': {},
                'f:ports': {
                  '.': {},
                  'k:{"port":443,"protocol":"TCP"}': {
                    '.': {},
                    'f:name': {},
                    'f:port': {},
                    'f:protocol': {},
                    'f:targetPort': {},
                  },
                },
                'f:selector': {},
                'f:sessionAffinity': {},
                'f:type': {},
              },
            },
          },
        ],
      },
      spec: {
        ports: [
          {
            name: 'apiserver',
            protocol: 'TCP',
            port: 443,
            targetPort: 5443,
          },
        ],
        selector: {
          apiserver: 'true',
        },
        clusterIP: '10.96.1.85',
        clusterIPs: ['10.96.1.85'],
        type: 'ClusterIP',
        sessionAffinity: 'None',
        ipFamilies: ['IPv4'],
        ipFamilyPolicy: 'SingleStack',
        internalTrafficPolicy: 'Cluster',
      },
      status: {
        loadBalancer: {},
      },
    },
  ],
};

export const RawIngressList: IngressList = {
  kind: 'IngressList',
  apiVersion: 'networking.k8s.io/v1',
  metadata: {
    resourceVersion: '6238435',
  },
  items: [
    {
      kind: 'Ingress',
      apiVersion: 'networking.k8s.io/v1',
      metadata: {
        name: 'calico-api',
        namespace: 'calico-apiserver',
        uid: '07c8ca63-4ef3-44a3-9f94-6afae175ea39',
        resourceVersion: '4620706',
        generation: 1,
        creationTimestamp: '2025-11-27T09:43:04Z',
        managedFields: [
          {
            manager: 'refine',
            operation: 'Update',
            apiVersion: 'networking.k8s.io/v1',
            time: '2025-11-27T09:43:04Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:spec': {
                'f:rules': {},
              },
            },
          },
        ],
      },
      spec: {
        ingressClassName: '',
        rules: [
          {
            http: {
              paths: [
                {
                  path: '/api',
                  pathType: 'Prefix',
                  backend: {
                    service: {
                      name: 'calico-api',
                      port: {
                        number: 443,
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      status: {
        loadBalancer: {},
      },
    },
  ],
};

export const RawReplicaSetList: ReplicaSetList = {
  kind: 'ReplicaSetList',
  apiVersion: 'apps/v1',
  metadata: {
    resourceVersion: '6238435',
  },
  items: [
    {
      metadata: {
        name: 'calico-apiserver-848d547c9c',
        namespace: 'calico-apiserver',
        uid: '832853e5-f664-49f8-b28a-91b6f048021f',
        resourceVersion: '2120',
        generation: 1,
        creationTimestamp: '2025-11-18T05:54:42Z',
        labels: {
          apiserver: 'true',
          'app.kubernetes.io/name': 'calico-apiserver',
          'k8s-app': 'calico-apiserver',
          'pod-template-hash': '848d547c9c',
        },
        annotations: {
          'deployment.kubernetes.io/desired-replicas': '2',
          'deployment.kubernetes.io/max-replicas': '3',
          'deployment.kubernetes.io/revision': '1',
        },
        ownerReferences: [
          {
            apiVersion: 'apps/v1',
            kind: 'Deployment',
            name: 'calico-apiserver',
            uid: 'f24292d6-1323-4f94-be3a-c624b06bcbd7',
            controller: true,
            blockOwnerDeletion: true,
          },
        ],
        managedFields: [
          {
            manager: 'kube-controller-manager',
            operation: 'Update',
            apiVersion: 'apps/v1',
            time: '2025-11-18T05:54:42Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:metadata': {
                'f:annotations': {
                  '.': {},
                  'f:deployment.kubernetes.io/desired-replicas': {},
                  'f:deployment.kubernetes.io/max-replicas': {},
                  'f:deployment.kubernetes.io/revision': {},
                },
                'f:labels': {
                  '.': {},
                  'f:apiserver': {},
                  'f:app.kubernetes.io/name': {},
                  'f:k8s-app': {},
                  'f:pod-template-hash': {},
                },
                'f:ownerReferences': {
                  '.': {},
                  'k:{"uid":"f24292d6-1323-4f94-be3a-c624b06bcbd7"}': {},
                },
              },
              'f:spec': {
                'f:replicas': {},
                'f:selector': {},
                'f:template': {
                  'f:metadata': {
                    'f:annotations': {
                      '.': {},
                      'f:sks-system.hash.operator.tigera.io/calico-apiserver-certs': {},
                    },
                    'f:labels': {
                      '.': {},
                      'f:apiserver': {},
                      'f:app.kubernetes.io/name': {},
                      'f:k8s-app': {},
                      'f:pod-template-hash': {},
                    },
                    'f:name': {},
                    'f:namespace': {},
                  },
                  'f:spec': {
                    'f:affinity': {
                      '.': {},
                      'f:podAntiAffinity': {
                        '.': {},
                        'f:preferredDuringSchedulingIgnoredDuringExecution': {},
                      },
                    },
                    'f:containers': {
                      'k:{"name":"calico-apiserver"}': {
                        '.': {},
                        'f:args': {},
                        'f:env': {
                          '.': {},
                          'k:{"name":"DATASTORE_TYPE"}': {
                            '.': {},
                            'f:name': {},
                            'f:value': {},
                          },
                          'k:{"name":"KUBERNETES_SERVICE_HOST"}': {
                            '.': {},
                            'f:name': {},
                            'f:value': {},
                          },
                          'k:{"name":"KUBERNETES_SERVICE_PORT"}': {
                            '.': {},
                            'f:name': {},
                            'f:value': {},
                          },
                          'k:{"name":"MULTI_INTERFACE_MODE"}': {
                            '.': {},
                            'f:name': {},
                            'f:value': {},
                          },
                        },
                        'f:image': {},
                        'f:imagePullPolicy': {},
                        'f:name': {},
                        'f:readinessProbe': {
                          '.': {},
                          'f:failureThreshold': {},
                          'f:httpGet': {
                            '.': {},
                            'f:path': {},
                            'f:port': {},
                            'f:scheme': {},
                          },
                          'f:periodSeconds': {},
                          'f:successThreshold': {},
                          'f:timeoutSeconds': {},
                        },
                        'f:resources': {},
                        'f:securityContext': {
                          '.': {},
                          'f:allowPrivilegeEscalation': {},
                          'f:capabilities': {
                            '.': {},
                            'f:drop': {},
                          },
                          'f:privileged': {},
                          'f:runAsGroup': {},
                          'f:runAsNonRoot': {},
                          'f:runAsUser': {},
                          'f:seccompProfile': {
                            '.': {},
                            'f:type': {},
                          },
                        },
                        'f:terminationMessagePath': {},
                        'f:terminationMessagePolicy': {},
                        'f:volumeMounts': {
                          '.': {},
                          'k:{"mountPath":"/calico-apiserver-certs"}': {
                            '.': {},
                            'f:mountPath': {},
                            'f:name': {},
                            'f:readOnly': {},
                          },
                        },
                      },
                    },
                    'f:dnsPolicy': {},
                    'f:nodeSelector': {},
                    'f:restartPolicy': {},
                    'f:schedulerName': {},
                    'f:securityContext': {},
                    'f:serviceAccount': {},
                    'f:serviceAccountName': {},
                    'f:terminationGracePeriodSeconds': {},
                    'f:tolerations': {},
                    'f:volumes': {
                      '.': {},
                      'k:{"name":"calico-apiserver-certs"}': {
                        '.': {},
                        'f:name': {},
                        'f:secret': {
                          '.': {},
                          'f:defaultMode': {},
                          'f:secretName': {},
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          {
            manager: 'kube-controller-manager',
            operation: 'Update',
            apiVersion: 'apps/v1',
            time: '2025-11-18T05:55:20Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:status': {
                'f:availableReplicas': {},
                'f:fullyLabeledReplicas': {},
                'f:observedGeneration': {},
                'f:readyReplicas': {},
                'f:replicas': {},
              },
            },
            subresource: 'status',
          },
        ],
      },
      spec: {
        replicas: 2,
        selector: {
          matchLabels: {
            apiserver: 'true',
            'pod-template-hash': '848d547c9c',
          },
        },
        template: {
          metadata: {
            name: 'calico-apiserver',
            namespace: 'calico-apiserver',
            creationTimestamp: null,
            labels: {
              apiserver: 'true',
              'app.kubernetes.io/name': 'calico-apiserver',
              'k8s-app': 'calico-apiserver',
              'pod-template-hash': '848d547c9c',
            },
            annotations: {
              'sks-system.hash.operator.tigera.io/calico-apiserver-certs':
                'ee83409424d1e7323ad90ae7e6d828cf8517b8ea',
            },
          },
          spec: {
            volumes: [
              {
                name: 'calico-apiserver-certs',
                secret: {
                  secretName: 'calico-apiserver-certs',
                  defaultMode: 420,
                },
              },
            ],
            containers: [
              {
                name: 'calico-apiserver',
                image: '10.255.233.201/sks/calico/apiserver:v3.29.5',
                args: [
                  '--secure-port=5443',
                  '--tls-private-key-file=/calico-apiserver-certs/tls.key',
                  '--tls-cert-file=/calico-apiserver-certs/tls.crt',
                  '--enable-validating-admission-policy=false',
                ],
                env: [
                  {
                    name: 'DATASTORE_TYPE',
                    value: 'kubernetes',
                  },
                  {
                    name: 'KUBERNETES_SERVICE_HOST',
                    value: '10.96.0.1',
                  },
                  {
                    name: 'KUBERNETES_SERVICE_PORT',
                    value: '443',
                  },
                  {
                    name: 'MULTI_INTERFACE_MODE',
                    value: 'none',
                  },
                ],
                resources: {},
                volumeMounts: [
                  {
                    name: 'calico-apiserver-certs',
                    readOnly: true,
                    mountPath: '/calico-apiserver-certs',
                  },
                ],
                readinessProbe: {
                  httpGet: {
                    path: '/readyz',
                    port: 5443,
                    scheme: 'HTTPS',
                  },
                  timeoutSeconds: 5,
                  periodSeconds: 60,
                  successThreshold: 1,
                  failureThreshold: 3,
                },
                terminationMessagePath: '/dev/termination-log',
                terminationMessagePolicy: 'File',
                imagePullPolicy: 'IfNotPresent',
                securityContext: {
                  capabilities: {
                    drop: ['ALL'],
                  },
                  privileged: false,
                  runAsUser: 10001,
                  runAsGroup: 10001,
                  runAsNonRoot: true,
                  allowPrivilegeEscalation: false,
                  seccompProfile: {
                    type: 'RuntimeDefault',
                  },
                },
              },
            ],
            restartPolicy: 'Always',
            terminationGracePeriodSeconds: 30,
            dnsPolicy: 'ClusterFirst',
            nodeSelector: {
              'kubernetes.io/os': 'linux',
            },
            serviceAccountName: 'calico-apiserver',
            serviceAccount: 'calico-apiserver',
            securityContext: {},
            affinity: {
              podAntiAffinity: {
                preferredDuringSchedulingIgnoredDuringExecution: [
                  {
                    weight: 100,
                    podAffinityTerm: {
                      labelSelector: {
                        matchLabels: {
                          'k8s-app': 'calico-apiserver',
                        },
                      },
                      namespaces: ['calico-apiserver'],
                      topologyKey: 'kubernetes.io/hostname',
                    },
                  },
                  {
                    weight: 100,
                    podAffinityTerm: {
                      labelSelector: {
                        matchLabels: {
                          'k8s-app': 'calico-apiserver',
                        },
                      },
                      namespaces: ['calico-apiserver'],
                      topologyKey: 'topology.kubernetes.io/zone',
                    },
                  },
                ],
              },
            },
            schedulerName: 'default-scheduler',
            tolerations: [
              {
                key: 'node-role.kubernetes.io/master',
                effect: 'NoSchedule',
              },
              {
                key: 'node-role.kubernetes.io/control-plane',
                effect: 'NoSchedule',
              },
              {
                key: 'node.kubernetes.io/not-ready',
                effect: 'NoSchedule',
              },
              {
                key: 'node.kubernetes.io/network-unavailable',
                effect: 'NoSchedule',
              },
              {
                key: 'node.kubernetes.io/unreachable',
                effect: 'NoSchedule',
              },
              {
                key: 'node.kubernetes.io/not-ready',
                effect: 'NoExecute',
              },
              {
                key: 'node.kubernetes.io/unreachable',
                effect: 'NoExecute',
                tolerationSeconds: 300,
              },
              {
                key: 'node-role.kubernetes.io/master',
                effect: 'NoSchedule',
              },
              {
                key: 'node-role.kubernetes.io/control-plane',
                effect: 'NoSchedule',
              },
            ],
          },
        },
      },
      status: {
        replicas: 2,
        fullyLabeledReplicas: 2,
        readyReplicas: 2,
        availableReplicas: 2,
        observedGeneration: 1,
      },
    },
  ],
};
