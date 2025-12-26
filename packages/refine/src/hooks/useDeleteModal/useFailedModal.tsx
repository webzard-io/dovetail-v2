import {
  RejectDialog,
  usePushModal,
  RejectDialogType,
  usePopModal,
  Tag,
} from '@cloudtower/eagle';
import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import ConfigsContext from 'src/contexts/configs';
import { NameTagStyle } from 'src/styles/tag';
import { transformResourceKindInSentence } from 'src/utils/string';

export const useFailedModal = (props: { resource: string; displayName?: string }) => {
  const { resource, displayName: displayNameFromProps } = props;
  const configs = useContext(ConfigsContext);
  const config = configs[resource];
  const { t, i18n } = useTranslation();
  const pushModal = usePushModal();
  const popModal = usePopModal();
  const displayName = displayNameFromProps || config?.displayName || config?.kind;
  const resourceDisplayName = transformResourceKindInSentence(displayName, i18n.language);

  function openFailedModal(id: string, errorMsgs: string[]) {
    pushModal<'RejectDialog'>({
      component: RejectDialog,
      props: {
        title: t('dovetail.cant_delete_resource', {
          resource: resourceDisplayName,
        }),
        description: (
          <Trans
            i18nKey="dovetail.cant_delete_resource_with_name"
            tOptions={{
              name: id,
              resource: resourceDisplayName,
            }}
            shouldUnescape={true}
          >
            <Tag color="gray" className={NameTagStyle} />
          </Trans>
        ),
        type: RejectDialogType.Single,
        content: errorMsgs,
        cancelText: t('dovetail.close'),
      },
    });
  }

  function closeFailedModal() {
    popModal();
  }

  return { openFailedModal, closeFailedModal };
};
