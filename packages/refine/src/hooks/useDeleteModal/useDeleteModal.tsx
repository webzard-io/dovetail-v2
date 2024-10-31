import { ModalProps, Typo, Tag } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import { useDelete, useNavigation } from '@refinedev/core';
import React, { useState, useContext } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import ConfigsContext from 'src/contexts/configs';
import { SmallModalStyle } from 'src/styles/modal';
import { addSpaceBeforeLetter } from 'src/utils/string';

const TextStyle = css`
  margin-bottom: 4px;
`;
const TipStyle = css`
  color: rgba(44, 56, 82, 0.60);
`;
const NameStyle = css`
  &.ant-tag.ant-tag-gray {
    background-color: rgba(237, 241, 250, .6);
    border: 1px solid rgba(211, 218, 235, .6);
    color: #00122e;
    word-break: break-all;
    white-space: normal;
    display: inline;
    font-weight: bold;
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
  const displayName = config.displayName || config.kind;
  const resourceDisplayName = addSpaceBeforeLetter(displayName);

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
            <Tag color="gray" className={NameStyle}></Tag>
          </Trans>
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
                kind: resourceDisplayName,
                interpolation: {
                  escapeValue: false
                }
              }).trim(),
              type: 'success'
            };
          },
          errorNotification() {
            return {
              message: t('dovetail.delete_failed_toast', {
                name: id,
                kind: resourceDisplayName,
                interpolation: {
                  escapeValue: false
                }
              }).trim(),
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
