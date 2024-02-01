import { useUIKit } from '@cloudtower/eagle';
import { pushModal } from '@cloudtower/eagle';
import { useResource, useNavigation, useGo } from '@refinedev/core';
import React, { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import FormModal from 'src/components/FormModal';
import ConfigsContext from 'src/contexts/configs';
import { FormType } from 'src/types';
import { getInitialValues } from 'src/utils/form';

export interface CreateButtonProps {
  type?: FormType;
}

export function CreateButton(props: CreateButtonProps) {
  const { type } = props;
  const { resource } = useResource();
  const navigation = useNavigation();
  const go = useGo();
  const kit = useUIKit();
  const { t } = useTranslation();
  const configs = useContext(ConfigsContext);

  const onClick = useCallback(() => {
    if (resource?.name) {
      if (type === FormType.MODAL) {
        const config = configs[resource.name];

        pushModal({
          // @ts-ignore
          component: config.FormModal || FormModal,
          props: {
            resource: resource.name,
            formProps: {
              initialValues: getInitialValues(config),
            }
          }
        });
      } else {
        go({
          to: navigation.createUrl(resource.name),
          options: {
            keepQuery: true,
          },
        });
      }
    }
  }, [resource?.name, go, navigation, type, configs]);

  return (
    <kit.button type="primary" onClick={onClick}>
      {t('dovetail.create')}
    </kit.button>
  );
}
