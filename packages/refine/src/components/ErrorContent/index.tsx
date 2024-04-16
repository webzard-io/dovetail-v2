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

    &.widget {
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-image: linear-gradient(211.41deg, #929dad 0%, #d3dbe3 100%);
    }

    &.list {
      color: rgba(44, 56, 82, 0.60);
    }

    &.card {
      display: flex;
      align-items: center;
      height: 60px;
      color: rgba(0, 21, 64, 0.30);
    }
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
    <ErrorWrapper className={props.className} style={props.style}>
      <ErrorContent>
        <p className={cx(fontMap[type], 'title', type)}>
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
