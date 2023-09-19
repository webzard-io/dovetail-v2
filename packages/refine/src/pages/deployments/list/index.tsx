import { IResourceComponentsProps } from "@refinedev/core";
import { HeadlessListInferencer } from "@refinedev/inferencer/headless";
import { useUIKit } from '@cloudtower/eagle';
import { useList, HttpError, useResource } from "@refinedev/core";
import { Unstructured } from '../../../providers/k8s-data-provider/kube-api';
import { CreateButton } from '../../../components/CreateButton';

export const DeploymentList: React.FC<IResourceComponentsProps> = () => {
  const kit = useUIKit();
  const { data, isLoading, isError, } = useList<Unstructured, HttpError>({
    resource: 'deployments'
  });

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
          }
        ]}
        scroll={{
          y: '500px'
        }}
      ></kit.table>
    </>
  );
};
