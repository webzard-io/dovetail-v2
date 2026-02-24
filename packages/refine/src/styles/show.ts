import { Typo } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import { styled } from '@linaria/react';

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

export const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 100%;
  overflow: hidden;
  gap: 8px;
`;
