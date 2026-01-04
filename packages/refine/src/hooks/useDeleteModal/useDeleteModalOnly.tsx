import {
  Tag,
  DeleteDialog,
  usePopModal,
  usePushModal,
  DeleteDialogProps,
} from '@cloudtower/eagle';
import { HttpError, useDelete, useNavigation, useResource } from '@refinedev/core';
import React, { useContext, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import ConfigsContext from 'src/contexts/configs';
import { NameTagStyle } from 'src/styles/tag';
import { transformResourceKindInSentence } from 'src/utils/string';

type useDeleteModalOnlyProps = {
  resource: string;
  displayName?: string;
  meta?: Record<string, string>;
  onError?: (resourceId: string, error?: HttpError) => void;
  deleteDialogProps?: Partial<DeleteDialogProps>;
};

export const useDeleteModalOnly = ({
  resource: resourceFromProps,
  displayName: displayNameFromProps,
  deleteDialogProps,
  meta,
  onError,
}: useDeleteModalOnlyProps) => {
  const { resource } = useResource();
  const configs = useContext(ConfigsContext);
  const config = configs[resourceFromProps];
  const { mutateAsync } = useDelete();
  const [deleting, setDeleting] = useState<boolean>(false);
  const pushModal = usePushModal();
  const popModal = usePopModal();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const displayName =
    displayNameFromProps || config?.displayName || meta?.kind || config?.kind;
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
        confirmLoading: deleting,
        onOk: async popModal => {
          try {
            setDeleting(true);
            await mutateAsync({
              resource: resourceFromProps,
              meta,
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
            if (resource?.name === resourceFromProps) {
              navigation.list(resourceFromProps);
            }
            popModal();
          } finally {
            setDeleting(false);
          }
        },
        ...deleteDialogProps,
      },
    });
  }

  return { openDeleteConfirmModal, closeDeleteConfirmModal: popModal };
};
