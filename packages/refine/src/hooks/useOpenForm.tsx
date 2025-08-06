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
import ConfigsContext from 'src/contexts/configs';
import { useEdit } from 'src/hooks/useEdit';
import { FormContainerType } from 'src/types';
import { getInitialValues } from 'src/utils/form';
import { FormModal } from '../components';

interface OpenFormOptions {
  id?: string;
  resourceName?: string;
  onSuccess?: (data: UpdateResponse<BaseRecord> | CreateResponse<BaseRecord>) => void;
}

export function useOpenForm() {
  const { resource } = useResource();
  const configs = useContext(ConfigsContext);
  const { edit } = useEdit();
  const navigation = useNavigation();
  const pushModal = usePushModal();
  const go = useGo();

  return function openForm(options?: OpenFormOptions) {
    const finalResourceName = options?.resourceName || resource?.name;

    if (finalResourceName) {
      const config = configs[finalResourceName];
      const formType = config.formConfig?.formContainerType;

      if (formType === undefined || formType === FormContainerType.MODAL) {
        pushModal<'FormModal'>({
          component: () => {
            const ModalComponent = config.formConfig?.CustomFormModal || FormModal;

            return (
              <ModalComponent
                resource={finalResourceName}
                id={options?.id}
                yamlFormProps={{
                  config,
                  initialValuesForCreate: getInitialValues(config),
                }}
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
          to: navigation.createUrl(finalResourceName),
          options: {
            keepQuery: true,
          },
        });
      }
    }
  };
}
