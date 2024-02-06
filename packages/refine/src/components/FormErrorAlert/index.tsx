import { useUIKit } from '@cloudtower/eagle';
import { first } from 'lodash-es';
import React from 'react';

interface FormErrorAlertProps {
  errorMsgs: string[];
  style?: React.CSSProperties;
  className?: string;
}

export function FormErrorAlert(props: FormErrorAlertProps) {
  const { errorMsgs, style, className } = props;
  const kit = useUIKit();

  return errorMsgs.length ? (
    <kit.alert
      message={
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
      type="error"
      style={style}
      className={className}
    />
  ) : null;
}
