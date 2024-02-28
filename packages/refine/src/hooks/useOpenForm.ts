import { pushModal } from '@cloudtower/eagle';
import { useResource, useGo, useNavigation } from '@refinedev/core';
import { useContext } from 'react';
import FormModal from 'src/components/FormModal';
import ConfigsContext from 'src/contexts/configs';
import { useEdit } from 'src/hooks/useEdit';
import { FormType } from 'src/types';
import { getInitialValues } from 'src/utils/form';
import { RefineFormModal } from '../components';

interface UseOpenFormOptions {
  id?: string;
}

export function useOpenForm(options?: UseOpenFormOptions) {
  const { resource } = useResource();
  const configs = useContext(ConfigsContext);
  const { edit } = useEdit();
  const navigation = useNavigation();
  const go = useGo();

  return function openForm() {
    if (resource?.name) {
      const config = configs[resource.name];

      if (config.formType === undefined || config.formType === FormType.MODAL) {
        if (config.formConfig?.fields) {
          pushModal({
            component: RefineFormModal,
            props: {
              config,
              id: options?.id,
            },
          });
        } else {
          pushModal({
            component: config.FormModal || FormModal,
            props: {
              resource: resource.name,
              id: options?.id,
              formProps: {
                initialValues: getInitialValues(config),
              },
            },
          });
        }
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
