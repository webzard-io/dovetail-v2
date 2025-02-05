import { css } from '@linaria/core';

export const StateTagStyle = css`
  &.ant-tag {
    padding: 3px 16px;
    height: 24px;
  }

  &.no-background {
    background-color: transparent !important;
    padding: 0;
  }
`;

export const NameTagStyle = css`
  &.ant-tag.ant-tag-gray {
    background-color: rgba(237, 241, 250, .6);
    border: 1px solid rgba(211, 218, 235, .6);
    color: #00122e;
    word-break: break-all;
    white-space: normal;
    display: inline;
    font-weight: bold;
  }
`;
