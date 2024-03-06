import { useUIKit } from '@cloudtower/eagle';
import { first } from 'lodash-es';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface FormErrorAlertProps {
  errorMsgs: string[];
  style?: React.CSSProperties;
  className?: string;
  isEdit?: boolean;
}

export function FormErrorAlert(props: FormErrorAlertProps) {
  const { errorMsgs, style, className, isEdit } = props;
  const { i18n } = useTranslation();
  const kit = useUIKit();

  return errorMsgs.length ? (
    <kit.alert
      message={
        (
          <>
            <div>{i18n.t(isEdit ? 'dovetail.save_failed_tip' : 'dovetail.create_failed_tip')}</div>
            {
              errorMsgs.length > 1 ? (
                <ul>
                  {errorMsgs.map((errorMsg, index) => (
                    <li key={errorMsg}>
                      {index + 1 + '. '} {errorMsg}
                    </li>
                  ))}
                </ul>
              ) : (
                first(errorMsgs)
              )
            }
          </>
        )
      }
      type="error"
      style={style}
      className={className}
    />
  ) : null;
}
