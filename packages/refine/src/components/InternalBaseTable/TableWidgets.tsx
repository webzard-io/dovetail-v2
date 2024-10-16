import { ArrowChevronUp16BoldSecondaryIcon } from '@cloudtower/icons-react';
import { cx } from '@linaria/core';
import { styled } from '@linaria/react';
import React from 'react';

export const ColumnTitle: React.FC<{
  sortOrder?: 'descend' | 'ascend' | null;
  title: React.ReactNode;
}> = props => {
  const { title, sortOrder } = props;
  return (
    <>
      {title}
      {<ArrowChevronUp16BoldSecondaryIcon className={cx('order-icon', sortOrder)} />}
    </>
  );
};

export const AuxiliaryLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 1px;
  background: $blue-60;
  transform: translateX(-9999px);
  z-index: 999;

  &::before {
    content: '';
    position: absolute;
    height: 34px;
    width: 3px;
    top: 0;
    left: -1px;
    background: $blue-60;
  }
`;
