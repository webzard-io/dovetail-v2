import { useUIKit } from '@cloudtower/eagle';
import { pushModal } from '@cloudtower/eagle';
import { useResource, useNavigation, useGo } from '@refinedev/core';
import React, { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import FormModal from 'src/components/FormModal';
import { ModalContext } from 'src/components/ModalContextProvider';
import { FormType } from 'src/types';

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
  const modal = useContext(ModalContext);

  const onClick = useCallback(() => {
    if (resource?.name) {
      if (type === FormType.MODAL) {
        modal.open({
          resource: resource.name
        });
        pushModal({
          // @ts-ignore
          component: FormModal,
          props: {
            resource: resource.name
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
  }, [resource?.name, modal, go, navigation, type]);

  return (
    <kit.button type="primary" onClick={onClick}>
      {t('dovetail.create')}
    </kit.button>
  );
}
