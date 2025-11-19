import { Typo } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';

export const SmallSectionTitleStyle = cx(
  Typo.Label.l4_bold,
  css`
    color: $gray-120;
  `
);

export const DashedTitleStyle = css`
  border-bottom: 1px dashed rgba(107, 128, 167, 0.6);
  padding-bottom: 1px;
`;
