export const BASE_INIT_VALUE = {
  metadata: {
    name: '',
    namespace: 'default',
    annotations: {},
    labels: {},
  },
};

const DEFAULT_MATCH_LABEL = 'sks.user.kubesmart.smtx.io/app';

const BASE_CONTAINER_INIT_VALUE = {
  name: 'container-0',
  imagePullPolicy: 'Always',
  image: '',
};

const BASE_WORKLOAD_SPEC_INIT_VALUE = {
  affinity: {},
  imagePullSecrets: [],
  initContainers: [],
  volumes: [],
};

export const DEPLOYMENT_INIT_VALUE = {
  apiVersion: 'apps/v1',
  kind: 'Deployment',
  ...BASE_INIT_VALUE,
  spec: {
    replicas: 1,
    selector: {
      matchLabels: {
        [DEFAULT_MATCH_LABEL]: '',
      },
    },
    template: {
      metadata: {
        labels: {
          [DEFAULT_MATCH_LABEL]: '',
        },
      },
      spec: {
        containers: [BASE_CONTAINER_INIT_VALUE],
        restartPolicy: 'Always',
        ...BASE_WORKLOAD_SPEC_INIT_VALUE,
      },
    },
  },
};

export const CRONJOB_INIT_VALUE = {
  apiVersion: 'batch/v1beta1',
  kind: 'CronJob',
  ...BASE_INIT_VALUE,
  spec: {
    schedule: '',
    jobTemplate: {
      metadata: {
        labels: {},
      },
      spec: {
        template: {
          spec: {
            containers: [BASE_CONTAINER_INIT_VALUE],
            restartPolicy: 'Never',
            ...BASE_WORKLOAD_SPEC_INIT_VALUE,
          },
        },
      },
    },
  },
};

export const DAEMONSET_INIT_VALUE = {
  apiVersion: 'apps/v1',
  kind: 'DaemonSet',
  ...BASE_INIT_VALUE,
  spec: {
    replicas: 1,
    selector: {
      matchLabels: {
        [DEFAULT_MATCH_LABEL]: '',
      },
    },
    template: {
      metadata: {
        labels: {
          [DEFAULT_MATCH_LABEL]: '',
        },
      },
      spec: {
        containers: [BASE_CONTAINER_INIT_VALUE],
        restartPolicy: 'Always',
        ...BASE_WORKLOAD_SPEC_INIT_VALUE,
      },
    },
  },
};

export const JOB_INIT_VALUE = {
  apiVersion: 'batch/v1',
  kind: 'Job',
  ...BASE_INIT_VALUE,
  spec: {
    replicas: 1,
    selector: {
      matchLabels: {},
    },
    template: {
      metadata: {
        labels: {},
      },
      spec: {
        containers: [BASE_CONTAINER_INIT_VALUE],
        restartPolicy: 'Never',
        ...BASE_WORKLOAD_SPEC_INIT_VALUE,
      },
    },
  },
};

export const STATEFULSET_INIT_VALUE = {
  apiVersion: 'apps/v1',
  kind: 'StatefulSet',
  ...BASE_INIT_VALUE,
  spec: {
    replicas: 1,
    selector: {
      matchLabels: {
        [DEFAULT_MATCH_LABEL]: '',
      },
    },
    template: {
      metadata: {
        labels: {
          [DEFAULT_MATCH_LABEL]: '',
        },
      },
      spec: {
        containers: [BASE_CONTAINER_INIT_VALUE],
        restartPolicy: 'Always',
        ...BASE_WORKLOAD_SPEC_INIT_VALUE,
      },
    },
  },
};

export const POD_INIT_VALUE = {
  apiVersion: 'v1',
  kind: 'Pod',
  ...BASE_INIT_VALUE,
  spec: {
    containers: [BASE_CONTAINER_INIT_VALUE],
  },
};

export const TIMESTAMP_LABEL = 'sks.user.kubesmart.smtx.io/timestamp';
