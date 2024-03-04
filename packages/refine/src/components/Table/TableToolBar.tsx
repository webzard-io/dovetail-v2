import { useUIKit, Typo } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import React from 'react';
import { CreateButton } from '../CreateButton';
import { DeleteManyButton } from '../DeleteManyButton';

type Props = {
  resourceName: string;
  description?: string;
  selectedKeys: string[];
  hideCreate?: boolean;
};

const ToolbarStyle = css`
  justify-content: space-between;
  width: 100%;
  padding: 12px 24px;
`;
const TitleStyle = css`
  color: #00122E;
`;
const DescriptionStyle = css`
  color: rgba(44, 56, 82, 0.75);
`;

export const TableToolBar: React.FC<Props> = ({ resourceName, description, selectedKeys, hideCreate }) => {
  const kit = useUIKit();

  return (
    <kit.space className={cx(ToolbarStyle, 'table-toolbar')}>
      <span className={cx(Typo.Display.d2_regular_title, TitleStyle)}>{resourceName}</span>
      <kit.space>
        {selectedKeys.length > 0 ? <DeleteManyButton ids={selectedKeys} /> : undefined}
        {!hideCreate ? <CreateButton resourceName={resourceName} /> : null}
      </kit.space>
      {description ? <span className={DescriptionStyle}></span> : null}
    </kit.space>
  );
};
