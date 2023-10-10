import { useUIKit, Typo } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import { useResource } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

const WrapperStyle = css`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TitleStyle = css`
  line-height: 32px !important;
`;

function FormLayout(props: React.PropsWithChildren<Record<string, unknown>>) {
  const kit = useUIKit();
  const { resource, action } = useResource();
  const { t } = useTranslation();

  return (
    <div className={WrapperStyle}>
      <span className={cx(Typo.Display.d2_bold_title, TitleStyle)}>
        {resource?.meta?.kind}:{' '}
        {action === 'create' ? t('dovetail.create') : t('dovetail.edit')}
      </span>
      <kit.divider />
      {props.children}
    </div>
  );
}

export default FormLayout;
