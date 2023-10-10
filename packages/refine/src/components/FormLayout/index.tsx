import { useUIKit, Typo } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useResource } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

const WrapperStyle = css`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

function FormLayout(props: React.PropsWithChildren<Record<string, unknown>>) {
  const kit = useUIKit();
  const { resource, action } = useResource();
  const { t } = useTranslation();

  return (
    <div className={WrapperStyle}>
      <span className={Typo.Display.d2_bold_title}>{resource?.meta?.kind}: {action === 'create' ? t('dovetail.create') : t('dovetail.edit')}</span>
      <kit.divider />
      {props.children}
    </div>
  );
}

export default FormLayout;
