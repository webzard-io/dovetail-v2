import yaml from 'js-yaml';
import { ResourceModel } from '../model';
import { download } from '../utils/download';

type DownloadYAMLOptions = {
  name: string;
  item: ResourceModel;
};

export function useDownloadYAML() {
  return function (options: DownloadYAMLOptions) {
    const { name, item } = options;
    const content = yaml.dump(item);

    download(`${name}.yaml`, content);
  };
}
