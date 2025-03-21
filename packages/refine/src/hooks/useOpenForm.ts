import { usePushModal } from '@cloudtower/eagle';
import { useResource, useGo, useNavigation } from '@refinedev/core';
import { useContext } from 'react';
import ConfigsContext from 'src/contexts/configs';
import { useEdit } from 'src/hooks/useEdit';
import { FormContainerType } from 'src/types';
import { getInitialValues } from 'src/utils/form';
import { FormModal } from '../components';

interface UseOpenFormOptions {
  id?: string;
}

export function useOpenForm(options?: UseOpenFormOptions) {
  const { resource } = useResource();
  const configs = useContext(ConfigsContext);
  const { edit } = useEdit();
  const navigation = useNavigation();
  const pushModal = usePushModal();
  const go = useGo();

  return function openForm() {
    if (resource?.name) {
      const config = configs[resource.name];
      const formType = config.formConfig?.formContainerType;

      if (formType === undefined || formType === FormContainerType.MODAL) {
        pushModal<'FormModal'>({
          component: config.formConfig?.CustomFormModal || FormModal,
          props: {
            resource: resource.name,
            id: options?.id,
            formProps: {
              initialValues: getInitialValues(config),
            },
          },
        });
      } else if (options?.id) {
        edit(options.id);
      } else {
        go({
          to: navigation.createUrl(resource.name),
          options: {
            keepQuery: true,
          },
        });
      }
    }
  };
}
