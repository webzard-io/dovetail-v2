import { Icon, Typo } from '@cloudtower/eagle';
import { Loading24GradientBlueIcon } from '@cloudtower/icons-react';
import { css } from '@linaria/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

const LoadingStyle = css`
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  color: #2c385299;
  background: #f2f5fa;
`;

export const Connecting = () => {
  const { t } = useTranslation();

  return (
    <div className={LoadingStyle}>
      <Icon src={Loading24GradientBlueIcon} iconWidth={24} iconHeight={24} isRotate />
      <span className={Typo.Display.d2_bold_title}>{t('dovetail.connecting')}</span>
    </div>
  );
};
