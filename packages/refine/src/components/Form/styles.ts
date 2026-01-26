import { css } from '@linaria/core';

export const SpaceStyle = css`
  flex-basis: 58%;
  width: 100%;
  margin: 0 auto;
`;

export const VerticalFormItemStyle = css`
  &.ant-form-item {
    flex-direction: column !important;
    gap: 8px;

    .ant-form-item-label > label {
      min-height: auto;
    }

    .ant-form-item-control-input {
      min-height: auto;
    }
  }
`;

export const IntegerStyle = css`
  max-width: 144px;
`;

export const ContentWrapper = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
