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

  &.widget .title {
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-image: linear-gradient(211.41deg, #929dad 0%, #d3dbe3 100%);
  }

  &.list .title {
    color: $gray-a60-8;
  }

  &.card {
    padding: 15px 0;

    .title {
      color: $gray-a30-10;
    }
  }


  &.card .error-content {
    height: 96px;
  }
`;

export const ErrorContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .title {
    margin-bottom: 8px;
  }
`;

export enum ErrorContentType {
  List = 'list',
  Card = 'card',
  Widget = 'widget',
}

export type WidgetErrorContentProps = {
  className?: string;
  style?: React.CSSProperties;
  errorText?: string;
  type?: ErrorContentType;
  refetch?: () => void;
};

const WidgetErrorContent: React.FunctionComponent<WidgetErrorContentProps> = props => {
  const { refetch, errorText, type = ErrorContentType.List } = props;
  const kit = useContext(kitContext);
  const { t } = useTranslation();
  const fontMap = {
    [ErrorContentType.Widget]: Typo.Label.l1_regular_title,
    [ErrorContentType.Card]: Typo.Label.l1_bold,
    [ErrorContentType.List]: Typo.Display.d2_bold_title,
  };

  return (
    <ErrorWrapper className={cx(props.className, type)} style={props.style}>
      <ErrorContent className="error-content">
        <p className={cx(fontMap[type], 'title')}>
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
