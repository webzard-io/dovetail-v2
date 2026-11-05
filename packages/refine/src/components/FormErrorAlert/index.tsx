import { Alert } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface FormErrorAlertProps {
  title?: string;
  errorMsgs: string[];
  style?: React.CSSProperties;
  className?: string;
  isEdit?: boolean;
  'data-test-id'?: string;
}

const ContentStyle = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ListStyle = css`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export function FormErrorAlert(props: FormErrorAlertProps) {
  const { title, errorMsgs, style, className, isEdit } = props;
  const { i18n } = useTranslation();

  return errorMsgs.length ? (
    <Alert
      data-test-id={props['data-test-id']}
      message={
        <div className={ContentStyle}>
          <div>
            {title ||
              i18n.t(isEdit ? 'dovetail.save_failed_tip' : 'dovetail.create_failed_tip')}
          </div>
          <ol className={ListStyle}>
            {errorMsgs.map((errorMsg, index) => (
              <li key={errorMsg}>
                {errorMsgs.length > 1 ? `${index + 1}. ${errorMsg}` : errorMsg}
              </li>
            ))}
          </ol>
        </div>
      }
      type="error"
      style={style}
      className={className}
    />
  ) : null;
}
