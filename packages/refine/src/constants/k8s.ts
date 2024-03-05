export const BASE_INIT_VALUE = {
  metadata: {
    name: '',
    namespace: 'default',
    annotations: {},
    labels: {},
  },
};

export const DEPLOYMENT_INIT_VALUE = {
  'apiVersion': 'apps/v1',
  'kind': 'Deployment',
  'metadata': {
    'name': 'example',
    'namespace': 'default'
  },
  'spec': {
    'selector': {
      'matchLabels': {
        'app': 'deployment-example'
      }
    },
    'replicas': 3,
    'template': {
      'metadata': {
        'labels': {
          'app': 'deployment-example'
        }
      },
      'spec': {
        'containers': [
          {
            'name': 'deployment-example',
            'image': 'registry.smtx.io/kubesmart/bitnami/nginx:1.25.2-debian-11-r2',
            'ports': [
              {
                'containerPort': 8080,
                'protocol': 'TCP'
              }
            ]
          }
        ]
      }
    },
    'strategy': {
      'type': 'RollingUpdate',
      'rollingUpdate': {
        'maxSurge': '25%',
        'maxUnavailable': '25%'
      }
    }
  }
};

export const CRONJOB_INIT_VALUE = {
  'apiVersion': 'batch/v1',
  'kind': 'CronJob',
  'metadata': {
    'name': 'example',
    'namespace': 'default'
  },
  'spec': {
    'schedule': '@daily',
    'jobTemplate': {
      'spec': {
        'template': {
          'spec': {
            'containers': [
              {
                'name': 'example',
                'image': 'registry.smtx.io/kubesmart/alpine:3',
                'args': [
                  '/bin/sh',
                  '-c',
                  'date; echo Hello from the Kubernetes cluster'
                ]
              }
            ],
            'restartPolicy': 'OnFailure'
          }
        }
      }
    }
  }
};

export const DAEMONSET_INIT_VALUE = {
  'apiVersion': 'apps/v1',
  'kind': 'DaemonSet',
  'metadata': {
    'name': 'example',
    'namespace': 'default'
  },
  'spec': {
    'selector': {
      'matchLabels': {
        'app': 'daemonset-example'
      }
    },
    'template': {
      'metadata': {
        'labels': {
          'app': 'daemonset-example'
        }
      },
      'spec': {
        'containers': [
          {
            'name': 'daemonset-example',
            'image': 'registry.smtx.io/kubesmart/bitnami/nginx:1.25.2-debian-11-r2',
            'ports': [
              {
                'containerPort': 8080
              }
            ]
          }
        ]
      }
    }
  }
};

export const JOB_INIT_VALUE = {
  'apiVersion': 'batch/v1',
  'kind': 'Job',
  'metadata': {
    'name': 'example',
    'namespace': 'default'
  },
  'spec': {
    'selector': {},
    'template': {
      'metadata': {
        'name': 'job-example'
      },
      'spec': {
        'containers': [
          {
            'name': 'job-example',
            'image': 'registry.smtx.io/kubesmart/alpine:3',
            'command': [
              '/bin/sh',
              '-c',
              'date; echo Hello from the Kubernetes cluster'
            ]
          }
        ],
        'restartPolicy': 'Never'
      }
    }
  }
};

export const STATEFULSET_INIT_VALUE = {
  'apiVersion': 'apps/v1',
  'kind': 'StatefulSet',
  'metadata': {
    'name': 'example',
    'namespace': 'default'
  },
  'spec': {
    'serviceName': 'statefulset-example',
    'replicas': 3,
    'selector': {
      'matchLabels': {
        'app': 'statefulset-example'
      }
    },
    'template': {
      'metadata': {
        'labels': {
          'app': 'statefulset-example'
        }
      },
      'spec': {
        'terminationGracePeriodSeconds': 10,
        'containers': [
          {
            'name': 'statefulset-example',
            'image': 'registry.smtx.io/kubesmart/fileserver:v1.0.0',
            'command': [
              'dufs'
            ],
            'args': [
              '-A',
              '--render-try-index',
              '/data'
            ],
            'ports': [
              {
                'containerPort': 5000,
                'name': 'http'
              }
            ],
            'volumeMounts': [
              {
                'name': 'file',
                'mountPath': '/data'
              }
            ]
          }
        ]
      }
    },
    'volumeClaimTemplates': [
      {
        'metadata': {
          'name': 'file'
        },
        'spec': {
          'accessModes': [
            'ReadWriteOnce'
          ],
          'resources': {
            'requests': {
              'storage': '1Gi'
            }
          }
        }
      }
    ]
  }
};

export const POD_INIT_VALUE = {
  'apiVersion': 'v1',
  'kind': 'Pod',
  'metadata': {
    'name': 'example',
    'namespace': 'default',
    'labels': {
      'app': 'example'
    }
  },
  'spec': {
    'securityContext': {
      'runAsNonRoot': true,
      'seccompProfile': {
        'type': 'RuntimeDefault'
      }
    },
    'containers': [
      {
        'name': 'example',
        'image': 'registry.smtx.io/kubesmart/bitnami/nginx:1.25.2-debian-11-r2',
        'ports': [
          {
            'containerPort': 8080
          }
        ],
        'securityContext': {
          'allowPrivilegeEscalation': false,
          'capabilities': {
            'drop': [
              'ALL'
            ]
          }
        }
      }
    ]
  }
};

export const SERVICE_CLUSTER_IP_INIT_VALUE = {
  'apiVersion': 'v1',
  'kind': 'Service',
  'metadata': {
    'name': 'example',
    'namespace': 'default'
  },
  'spec': {
    'selector': {
      'app': 'example'
    },
    'ports': [
      {
        'name': 'example',
        'port': 8080,
        'protocol': 'TCP',
        'targetPort': 8080
      }
    ],
    'sessionAffinity': 'None',
    'type': 'ClusterIP'
  }
};

export const SERVICE_NODE_PORT_INIT_VALUE = {
  'apiVersion': 'v1',
  'kind': 'Service',
  'metadata': {
    'name': 'example',
    'namespace': 'default'
  },
  'spec': {
    'selector': {
      'app': 'example'
    },
    'ports': [
      {
        'name': 'example',
        'port': 8080,
        'protocol': 'TCP',
        'targetPort': 8080
      }
    ],
    'sessionAffinity': 'None',
    'type': 'NodePort'
  }
};

export const SERVICE_LOAD_BALANCER_INIT_VALUE = {
  'apiVersion': 'v1',
  'kind': 'Service',
  'metadata': {
    'name': 'example',
    'namespace': 'default'
  },
  'spec': {
    'selector': {
      'app': 'example'
    },
    'ports': [
      {
        'name': 'example',
        'port': 80,
        'protocol': 'TCP',
        'targetPort': 8080
      }
    ],
    'sessionAffinity': 'None',
    'type': 'LoadBalancer'
  }
};

export const SERVICE_EXTERNAL_NAME_INIT_VALUE = {
  'apiVersion': 'v1',
  'kind': 'Service',
  'metadata': {
    'name': 'example',
    'namespace': 'default'
  },
  'spec': {
    'selector': {
      'app': 'example'
    },
    'ports': [
      {
        'name': 'example',
        'port': 8080,
        'protocol': 'TCP',
        'targetPort': 8080
      }
    ],
    'sessionAffinity': 'None',
    'type': 'ExternalName',
    'externalName': 'app.example.com'
  }
};

export const SERVICE_HEADLESS_INIT_VALUE = {
  'apiVersion': 'v1',
  'kind': 'Service',
  'metadata': {
    'name': 'example',
    'namespace': 'default'
  },
  'spec': {
    'selector': {
      'app': 'example'
    },
    'clusterIP': 'None',
    'ports': [
      {
        'name': 'example',
        'port': null,
        'protocol': 'TCP',
        'targetPort': null
      }
    ],
    'sessionAffinity': 'None',
    'type': 'ClusterIP'
  }
};

export const INGRESS_INIT_VALUE = {
  'apiVersion': 'networking.k8s.io/v1',
  'kind': 'Ingress',
  'metadata': {
    'name': 'example',
    'namespace': 'default'
  },
  'spec': {
    'rules': [
      {
        'host': 'example.com',
        'http': {
          'paths': [
            {
              'path': '/testpath',
              'pathType': 'Prefix',
              'backend': {
                'service': {
                  'name': 'test',
                  'port': {
                    'number': 80
                  }
                }
              }
            }
          ]
        }
      }
    ]
  }
};
export const NETWORK_POLICY_INIT_VALUE = {
  'apiVersion': 'networking.k8s.io/v1',
  'kind': 'NetworkPolicy',
  'metadata': {
    'name': 'example',
    'namespace': 'default'
  },
  'spec': {
    'podSelector': {},
    'policyTypes': []
  }
};

export const CONFIG_MAP_INIT_VALUE = {
  'apiVersion': 'v1',
  'kind': 'ConfigMap',
  'metadata': {
    'name': 'example',
    'namespace': 'default'
  },
  'data': {
    'key': 'value'
  },
  'immutable': false
};

export const TIMESTAMP_LABEL = 'sks.user.kubesmart.smtx.io/timestamp';

export const SECRET_OPAQUE_INIT_VALUE = {
  'apiVersion': 'v1',
  'kind': 'Secret',
  'metadata': {
    'name': 'example',
    'namespace': 'default'
  },
  'type': 'Opaque',
  'data': {
    'key': 'value'
  }
};

export const SECRET_IMAGE_REPO_INIT_VALUE = {
  'apiVersion': 'v1',
  'kind': 'Secret',
  'metadata': {
    'name': 'example',
    'namespace': 'default'
  },
  'type': 'kubernetes.io/dockerconfigjson',
  'data': {
    '.dockerconfigjson': ''
  }
};

export const SECRET_BASIC_AUTH_INIT_VALUE = {
  'apiVersion': 'v1',
  'kind': 'Secret',
  'metadata': {
    'name': 'example',
    'namespace': 'default'
  },
  'type': 'kubernetes.io/basic-auth',
  'data': {
    'username': 'example',
    'password': 'example'
  }
};

export const SECRET_SSH_AUTH_INIT_VALUE = {
  'apiVersion': 'v1',
  'kind': 'Secret',
  'metadata': {
    'name': 'example',
    'namespace': 'default'
  },
  'type': 'kubernetes.io/ssh-auth',
  'data': {
    'ssh-publickey': '',
    'ssh-privatekey': ''
  }
};

export const SECRET_TLS_INIT_VALUE = {
  'apiVersion': 'v1',
  'kind': 'Secret',
  'metadata': {
    'name': 'example',
    'namespace': 'default'
  },
  'type': 'kubernetes.io/tls',
  'data': {
    'tls.crt': '',
    'tls.key': ''
  }
};

export const SECRET_CUSTOM_INIT_VALUE = {
  'apiVersion': 'v1',
  'kind': 'Secret',
  'metadata': {
    'name': 'example',
    'namespace': 'default'
  },
  'type': '',
  'data': {}
};
