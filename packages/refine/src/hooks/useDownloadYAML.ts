import yaml from 'js-yaml';
import { Unstructured } from 'k8s-api-provider';
import { download } from '../utils/download';

type DownloadYAMLOptions = {
  name: string;
  item: Omit<Unstructured, 'id'>;
};

export function useDownloadYAML() {
  return function (options: DownloadYAMLOptions) {
    const { name, item } = options;
    const content = yaml.dump(item);

    download(`${name}.yaml`, content);
  };
}
