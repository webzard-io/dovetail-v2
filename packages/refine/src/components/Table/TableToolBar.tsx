import { useUIKit, Typo } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import React from 'react';
import { CreateButton } from '../CreateButton';
import { DeleteManyButton } from '../DeleteManyButton';

type Props = {
  title: string;
  selectedKeys: string[];
  hideCreate?: boolean;
};

const ToolbarStyle = css`
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;
`;

export const TableToolBar: React.FC<Props> = ({ title, selectedKeys, hideCreate }) => {
  const kit = useUIKit();

  return (
    <kit.space className={cx(ToolbarStyle, 'table-toolbar')}>
      <span className={Typo.Display.d2_bold_title}>{title}</span>
      <kit.space>
        {selectedKeys.length > 0 ? <DeleteManyButton ids={selectedKeys} /> : undefined}
        {!hideCreate ? <CreateButton /> : null}
      </kit.space>
    </kit.space>
  );
};
