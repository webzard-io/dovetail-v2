import { Divider, Form, Button, Typo, ButtonProps } from '@cloudtower/eagle';
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
  const { resource, action } = useResource();
  const { t } = useTranslation();

  return (
    <div className={WrapperStyle}>
      <span className={cx(Typo.Display.d2_bold_title, TitleStyle)}>
        {resource?.meta?.kind}:{' '}
        {action === 'create' ? t('dovetail.create') : t('dovetail.edit')}
      </span>
      <Divider />
      {props.children}
      <Form.Item>
        <Button type="primary" {...saveButtonProps}>
          {t('dovetail.save')}
        </Button>
      </Form.Item>
    </div>
  );
}

export default FormLayout;
