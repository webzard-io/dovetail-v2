export type ResourceType = {
  id: string;
  metadata: {
    name: string;
    namespace: string;
    labels: Record<string, string>;
    annotations: Record<string, string>;
  } & Record<string, any>;
  spec: Record<string, any>;
  status: Record<string, any>;
};
