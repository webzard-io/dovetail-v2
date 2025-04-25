import {
  Tag,
  DeleteDialog,
  usePopModal,
  usePushModal,
  DeleteDialogProps,
} from '@cloudtower/eagle';
import { HttpError, useDelete, useNavigation } from '@refinedev/core';
import React, { useContext } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import ConfigsContext from 'src/contexts/configs';
import { NameTagStyle } from 'src/styles/tag';
import { transformResourceKindInSentence } from 'src/utils/string';

type useDeleteModalOnlyProps = {
  resource: string;
  onError?: (resourceId: string, error?: HttpError) => void;
  deleteDialogProps?: Partial<DeleteDialogProps>;
};

export const useDeleteModalOnly = ({
  resource,
  deleteDialogProps,
  onError,
}: useDeleteModalOnlyProps) => {
  const configs = useContext(ConfigsContext);
  const config = configs[resource];
  const { mutateAsync } = useDelete();
  // const [deleting, setDeleting] = useState<boolean>(false);
  const pushModal = usePushModal();
  const popModal = usePopModal();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const displayName = config.displayName || config.kind;
  const resourceDisplayName = transformResourceKindInSentence(displayName, i18n.language);

  function openDeleteConfirmModal(id: string) {
    pushModal<'DeleteDialog'>({
      component: DeleteDialog,
      props: {
        title: t('dovetail.delete_resource', {
          resource: resourceDisplayName,
        }),
        description: (
          <Trans
            i18nKey="dovetail.confirm_delete_text"
            tOptions={{
              target: id,
              kind: resourceDisplayName,
            }}
            shouldUnescape={true}
          >
            <Tag color="gray" className={NameTagStyle}></Tag>
          </Trans>
        ),
        secondaryDesc: t('dovetail.delete_tip'),
        okText: t('dovetail.delete'),
        onOk: async popModal => {
          try {
            // setDeleting(true);
            await mutateAsync({
              resource,
              id,
              successNotification() {
                return {
                  message: t('dovetail.delete_success_toast', {
                    name: id,
                    kind: resourceDisplayName,
                    interpolation: {
                      escapeValue: false,
                    },
                  }).trim(),
                  type: 'success',
                };
              },
              errorNotification(error) {
                onError?.(id, error);

                return false;
              },
            });
            navigation.list(resource);
            popModal();
          } finally {
            // setDeleting(false);
          }
        },
        ...deleteDialogProps,
      },
    });
  }

  return { openDeleteConfirmModal, closeDeleteConfirmModal: popModal };
};
