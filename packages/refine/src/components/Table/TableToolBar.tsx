import { useUIKit, Typo } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import React from 'react';
import { CreateButton } from '../CreateButton';
import { DeleteManyButton } from '../DeleteManyButton';

type Props = {
  title: string;
  selectedKeys: string[];
};

const ToolbarStyle = css`
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;
`;

export const TableToolBar: React.FC<Props> = ({ title, selectedKeys }) => {
  const kit = useUIKit();

  return (
    <kit.space className={ToolbarStyle}>
      <span className={Typo.Display.d2_bold_title}>{title}</span>
      <kit.space>
        {selectedKeys.length > 0 ? <DeleteManyButton ids={selectedKeys} /> : undefined}
        <CreateButton />
      </kit.space>
    </kit.space>
  );
};
