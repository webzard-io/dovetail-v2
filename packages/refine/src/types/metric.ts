import { Resource } from './resource';

type Quantity = string;

export type ContainerMetrics = {
  name: string;
  usage: {
    cpu?: Quantity;
    memory?: Quantity;
  };
};

export type PodMetrics = {
  timestamp: string;
  window: string;
  containers: ContainerMetrics[];
} & Resource;

export type ResourceQuantity = {
  cpu: {
    si: string;
    value: number;
  };
  memory: {
    si: string;
    value: number;
  };
};
