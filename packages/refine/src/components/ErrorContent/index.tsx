import { kitContext, Typo } from '@cloudtower/eagle';
import { cx } from '@linaria/core';
import { styled } from '@linaria/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

export const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const ErrorContent = styled.div`
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
  className?: string;
  style?: React.CSSProperties;
  errorText?: string;
  refetch?: () => void;
};

const WidgetErrorContent: React.FunctionComponent<WidgetErrorContentProps> = props => {
  const { refetch, errorText } = props;
  const kit = useContext(kitContext);
  const { t } = useTranslation();

  return (
    <ErrorWrapper className={props.className} style={props.style}>
      <ErrorContent>
        <p className={cx(Typo.Label.l1_regular_title, 'title')}>
          {errorText || t('dovetail.obtain_data_error')}
        </p>
        {!refetch ? null : (
          <kit.button
            size="small"
            type="ordinary"
            onClick={e => {
              e.stopPropagation();
              refetch?.();
            }}
          >
            {t('dovetail.retry')}
          </kit.button>
        )}
      </ErrorContent>
    </ErrorWrapper>
  );
};

export default WidgetErrorContent;
