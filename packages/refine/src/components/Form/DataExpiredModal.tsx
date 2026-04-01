import { SmallDialog, Typo } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { WarningButtonStyle } from 'src/styles/button';

const NoteStyle = css`
  margin-top: 8px;
  color: $gray-80;
`;

export interface DataExpiredModalProps {
  onAbandon: () => void;
}

export function DataExpiredModal({ onAbandon }: DataExpiredModalProps) {
  const { t } = useTranslation();

  return (
    <SmallDialog
      title={t('dovetail.data_expired')}
      closable={false}
      maskClosable={false}
      cancelButtonProps={{ style: { display: 'none' } }}
      okText={t('dovetail.abandon_edit')}
      okButtonProps={{ className: WarningButtonStyle }}
      onOk={(popModal) => {
        popModal();
        onAbandon();
      }}
    >
      <div className={Typo.Label.l2_regular}>
        {t('dovetail.data_expired_body')}
      </div>
      <div className={`${Typo.Label.l2_regular} ${NoteStyle}`}>
        {t('dovetail.data_expired_note')}
      </div>
    </SmallDialog>
  );
}
