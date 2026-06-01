import { usePushModal } from '@cloudtower/eagle';
import {
  useResource,
  useGo,
  useNavigation,
  CreateResponse,
  UpdateResponse,
  BaseRecord,
} from '@refinedev/core';
import { useContext } from 'react';
import React from 'react';
import { RawYamlFormModal } from 'src/components/Form/RawYamlFormModal';
import ConfigsContext from 'src/contexts/configs';
import { useEdit } from 'src/hooks/useEdit';
import { FormContainerType, FormType } from 'src/types';
import { ResourceConfig } from 'src/types';
import { FormModal } from '../components';

interface OpenFormOptions {
  id?: string;
  resourceConfig?: Pick<
    ResourceConfig,
    | 'name'
    | 'displayName'
    | 'kind'
    | 'initValue'
    | 'apiVersion'
    | 'basePath'
    | 'formConfig'
    | 'dataProviderName'
  >;
  resourceName?: string;
  initialValues?: Record<string, unknown>;
  customOptions?: Record<string, unknown>;
  onSuccess?: (data: UpdateResponse<BaseRecord> | CreateResponse<BaseRecord>) => void;
  useYamlEditor?: boolean;
}

export function useOpenForm() {
  const { resource } = useResource();
  const configs = useContext(ConfigsContext);
  const { edit } = useEdit();
  const navigation = useNavigation();
  const pushModal = usePushModal();
  const go = useGo();

  return function openForm(options?: OpenFormOptions) {
    const finalResourceName =
      options?.resourceName || options?.resourceConfig?.name || resource?.name;

    if (finalResourceName || options?.resourceConfig) {
      const resourceConfig = options?.resourceConfig || configs[finalResourceName || ''];
      const formType = resourceConfig.formConfig?.formContainerType;

      if (formType === undefined || formType === FormContainerType.MODAL) {
        pushModal({
          component: () => {
            // YAML-only 资源没有结构化表单，默认编辑入口也应复用专门的 YAML 全屏弹窗。
            const isYamlOnlyForm =
              resourceConfig.formConfig?.formType !== FormType.FORM &&
              !resourceConfig.formConfig?.CustomFormModal;

            if (options?.useYamlEditor || isYamlOnlyForm) {
              return (
                <RawYamlFormModal
                  id={options?.id}
                  resourceConfig={resourceConfig}
                  yamlFormProps={{
                    resourceConfig: resourceConfig,
                  }}
                  onSuccess={options?.onSuccess}
                />
              );
            }
            const ModalComponent =
              resourceConfig.formConfig?.CustomFormModal || FormModal;

            return (
              <ModalComponent
                id={options?.id}
                resourceConfig={resourceConfig}
                yamlFormProps={{
                  resourceConfig: resourceConfig,
                }}
                options={options}
                onSuccess={options?.onSuccess}
              />
            );
          },
          props: {},
        });
      } else if (options?.id) {
        edit(options.id);
      } else {
        go({
          to: navigation.createUrl(finalResourceName || ''),
          options: {
            keepQuery: true,
          },
        });
      }
    }
  };
}
