import { ModalProps, Typo } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import { BaseKey, useDelete, useNavigation } from '@refinedev/core';
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
  const { mutate } = useDelete();
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [id, setId] = useState<BaseKey>('');
  const { t } = useTranslation();
  const modalProps: ModalProps = {
    className: ModalStyle,
    title: t('dovetail.delete_resource', { resource: config.kind }),
    okText: t('dovetail.delete'),
    okButtonProps: {
      danger: true,
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
    onOk() {
      mutate({
        resource,
        id,
      });
      setVisible(false);
      navigation.list(resource);
    },
    onCancel() {
      setVisible(false);
    },
  };

  function openDeleteConfirmModal(id: BaseKey) {
    setId(id);
    setVisible(true);
  }

  return { modalProps, visible, openDeleteConfirmModal };
};
