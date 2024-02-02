import { useUIKit, Typo, ButtonProps } from '@cloudtower/eagle';
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

type FormLayoutProps = {
  saveButtonProps?: ButtonProps;
}

function FormLayout(props: React.PropsWithChildren<FormLayoutProps>) {
  const { saveButtonProps } = props;
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
      <kit.form.Item>
        <kit.button type="primary" {...saveButtonProps}>
          {t('dovetail.save')}
        </kit.button>
      </kit.form.Item>
    </div>
  );
}

export default FormLayout;
