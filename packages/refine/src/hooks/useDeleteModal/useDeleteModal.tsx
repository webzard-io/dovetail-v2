import { ModalProps, Typo, Tag } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import { useDelete, useNavigation } from '@refinedev/core';
import React, { useState, useContext } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import ConfigsContext from 'src/contexts/configs';
import { SmallModalStyle } from 'src/styles/modal';
import { NameTagStyle } from 'src/styles/tag';
import { transformResourceKindInSentence } from 'src/utils/string';

const TextStyle = css`
  margin-bottom: 4px;
`;
const TipStyle = css`
  color: rgba(44, 56, 82, 0.60);
`;

export const useDeleteModal = (resource: string, { deleteTip, onError }: { deleteTip?: React.ReactNode, onError?: (error: any) => void } = {}) => {
  const configs = useContext(ConfigsContext);
  const config = configs[resource];
  const { mutateAsync } = useDelete();
  const [deleting, setDeleting] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [id, setId] = useState<string>('');
  const { t, i18n } = useTranslation();
  const displayName = config.displayName || config.kind;
  const resourceDisplayName = transformResourceKindInSentence(displayName, i18n.language);

  const modalProps: ModalProps = {
    className: SmallModalStyle,
    title: t('dovetail.delete_resource', {
      resource: resourceDisplayName,
    }),
    okText: t('dovetail.delete'),
    okButtonProps: {
      danger: true,
      loading: deleting
    },
    cancelText: t('dovetail.cancel'),
    children: (
      <>
        <div className={cx(Typo.Label.l2_regular, TextStyle)}>
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
        </div>
        <div className={cx(Typo.Label.l4_regular, TipStyle)}>
          {deleteTip || t('dovetail.delete_tip')}
        </div>
      </>
    ),
    async onOk() {
      try {
        setDeleting(true);
        await mutateAsync({
          resource,
          id,
          successNotification() {
            return {
              message: t('dovetail.delete_success_toast', {
                name: id,
                kind: resourceDisplayName,
                interpolation: {
                  escapeValue: false
                }
              }).trim(),
              type: 'success'
            };
          },
          errorNotification(error) {
            onError?.(error);

            return false;
          },
        });
        setVisible(false);
        navigation.list(resource);
      } finally {
        setDeleting(false);
      }
    },
    onCancel() {
      setVisible(false);
    },
  };

  function openDeleteConfirmModal(id: string) {
    setId(id);
    setVisible(true);
  }

  return { modalProps, visible, setVisible, openDeleteConfirmModal };
};
