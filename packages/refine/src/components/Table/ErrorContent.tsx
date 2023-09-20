import { kitContext } from '@cloudtower/eagle';
import { Typo } from '@cloudtower/eagle';
import { cx, css } from '@linaria/core';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

export const ErrorWrapper = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const ErrorContent = css`
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    margin-bottom: 8px;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-image: linear-gradient(211.41deg, #929dad 0%, #d3dbe3 100%);
  }
`;

export type WidgetErrorContentProps = {
  errorText?: string;
  style?: React.CSSProperties;
  refetch?: () => void;
};

const WidgetErrorContent: React.FunctionComponent<WidgetErrorContentProps> = props => {
  const { refetch } = props;
  const kit = useContext(kitContext);
  const { t } = useTranslation();

  return (
    <div className={ErrorWrapper} style={props.style}>
      <div className={ErrorContent}>
        <p className={cx(Typo.Label.l1_regular_title, 'title')}>
          {props.errorText || t('dovetail.obtain_data_error')}
        </p>
        {refetch ? (
          <kit.button
            type="ordinary"
            onClick={e => {
              e.stopPropagation();
              refetch?.();
            }}
          >
            {t('dovetail.retry')}
          </kit.button>
        ) : null}
      </div>
    </div>
  );
};

export default WidgetErrorContent;
