import { Icon, useUIKit } from '@cloudtower/eagle';
import {
  EditPen16PrimaryIcon,
  MoreEllipsis16BlueIcon,
  TrashBinDelete16Icon,
  Download16GradientBlueIcon,
} from '@cloudtower/icons-react';
import { useResource } from '@refinedev/core';
import { Unstructured } from 'k8s-api-provider';
import React from 'react';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { useDownloadYAML } from 'src/hooks/useDownloadYAML';
import { useEdit } from 'src/hooks/useEdit';

interface K8sDropdownProps {
  data: Unstructured & { id: string };
}

function K8sDropdown(props: React.PropsWithChildren<K8sDropdownProps>) {
  const { data } = props;
  const kit = useUIKit();
  const useResourceResult = useResource();
  const resource = useResourceResult.resource;
  const { edit } = useEdit();
  const { showDeleteConfirm } = useDeleteModal();
  const download = useDownloadYAML();

  return (
    <kit.dropdown
      overlay={
        <kit.menu>
          <kit.menuItem
            onClick={() => {
              if (data.id) {
                edit(data.id);
              }
            }}
          >
            <Icon src={EditPen16PrimaryIcon}>Edit</Icon>
          </kit.menuItem>
          <kit.menuItem
            danger={true}
            onClick={() => {
              showDeleteConfirm(resource?.name || '', data.id);
            }}
          >
            <Icon src={TrashBinDelete16Icon}>Delete</Icon>
          </kit.menuItem>
          <kit.menu.Item
            onClick={() => {
              if (data.id) {
                download({
                  name: data.metadata.name || data.kind,
                  item: data,
                });
              }
            }}
          >
            <Icon src={Download16GradientBlueIcon}>
              Download YAML
            </Icon>
          </kit.menu.Item>
          {props.children}
        </kit.menu>
      }
    >
      <kit.button type="tertiary" size="small">
        <MoreEllipsis16BlueIcon />
      </kit.button>
    </kit.dropdown>
  );
}

export default K8sDropdown;
