import { IResourceComponentsProps, useGo, useResource } from "@refinedev/core";
import { HeadlessListInferencer } from "@refinedev/inferencer/headless";
import { useCallback } from 'react';
import { useUIKit } from '@cloudtower/eagle';
import { useList, HttpError } from "@refinedev/core";
import { Unstructured } from '../../../providers/k8s-data-provider/kube-api';
import { CreateButton } from '../../../components/CreateButton';

export const ConfigmapList: React.FC<IResourceComponentsProps> = () => {
  const kit = useUIKit();
  const { resource } = useResource();
  const go = useGo();
  const { data, isLoading, isError } = useList<Unstructured, HttpError>({});

  const onClick = useCallback((record: Unstructured) => {
    go({
      to: `/configmaps/edit`,
      query: {
        id: `${record.metadata.namespace}/${record.metadata.name}`,
      }
    });
  }, []);

  return (
    <>
      <CreateButton />
      <kit.table
        loading={isLoading}
        dataSource={data?.data}
        columns={[
          {
            key: 'name',
            dataIndex: ['metadata', 'name'],
            title: 'Name'
          },
          {
            key: '_action_',
            title: 'Action',
            dataIndex: '',
            render(_, record) {
              return (
                <>
                  <kit.button onClick={()=> onClick(record)}>Edit</kit.button>
                </>
              )
            }
          }
        ]}
        scroll={{
          y: '500px'
        }}
      ></kit.table>
    </>
  );
};
