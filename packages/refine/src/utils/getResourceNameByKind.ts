import { ResourceConfig } from 'src/types';

export function getResourceNameByKind(
  kind: string,
  configs: Record<string, ResourceConfig>
) {
  return Object.values(configs).find(config => config.kind === kind)?.name;
}
