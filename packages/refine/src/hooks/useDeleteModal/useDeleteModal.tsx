import { ModalProps, Typo } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import { useDelete, useNavigation } from '@refinedev/core';
import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigsContext from 'src/contexts/configs';

const TextStyle = css`
  margin-bottom: 4px;
`;
const TipStyle = css`
  color: rgba(44, 56, 82, 0.60);
`;
const ModalStyle = css`
&.ant-modal {
  .ant-modal-content {
    border-radius: 16px;
  }

  .ant-modal-header {
    border-radius: 16px 16px 0 0;
  }
}

`;

export const useDeleteModal = (resource: string) => {
  const configs = useContext(ConfigsContext);
  const config = configs[resource];
  const { mutateAsync } = useDelete();
  const [deleting, setDeleting] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [id, setId] = useState<string>('');
  const { t } = useTranslation();
  const modalProps: ModalProps = {
    className: ModalStyle,
    title: t('dovetail.delete_resource', { resource: config.kind }),
    okText: t('dovetail.delete'),
    okButtonProps: {
      danger: true,
      loading: deleting
    },
    cancelText: t('dovetail.cancel'),
    children: (
      <>
        <div className={cx(Typo.Label.l2_regular, TextStyle)}>
          {
            t('dovetail.confirm_delete_text', {
              target: id,
              kind: config.kind,
              interpolation: { escapeValue: false },
            })
          }
        </div>
        <div className={cx(Typo.Label.l4_regular, TipStyle)}>
          {t('dovetail.delete_tip')}
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
                kind: config.kind,
                interpolation: {
                  escapeValue: false
                }
              }),
              type: 'success'
            };
          },
          errorNotification() {
            return {
              message: t('dovetail.delete_failed_toast', {
                name: id,
                kind: config.kind,
                interpolation: {
                  escapeValue: false
                }
              }),
              type: 'error'
            };
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

  return { modalProps, visible, openDeleteConfirmModal };
};
