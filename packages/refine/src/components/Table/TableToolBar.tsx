import { useUIKit, Typo } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import { useResource } from '@refinedev/core';
import React from 'react';
import { CreateButton } from '../CreateButton';
import { DeleteManyButton } from '../DeleteManyButton';

type Props = {
  description?: string;
  selectedKeys: string[];
  hideCreate?: boolean;
};

const ToolbarWrapperStyle = css`
  padding: 12px 24px;
`;
const ToolbarStyle = css`
  justify-content: space-between;
  width: 100%;
`;
const TitleStyle = css`
  color: #00122E;
`;
const DescriptionStyle = css`
  color: rgba(44, 56, 82, 0.75);
`;

export const TableToolBar: React.FC<Props> = ({ description, selectedKeys, hideCreate }) => {
  const kit = useUIKit();
  const { resource } = useResource();

  return (
    <div className={cx(ToolbarWrapperStyle, 'table-toolbar')}>
      <kit.space className={ToolbarStyle}>
        <span className={cx(Typo.Display.d2_regular_title, TitleStyle)}>{resource?.meta?.kind}</span>
        <kit.space>
          {selectedKeys.length > 0 ? <DeleteManyButton ids={selectedKeys} /> : undefined}
          {!hideCreate ? <CreateButton /> : null}
        </kit.space>
      </kit.space>
      {description ? <div className={DescriptionStyle}>{description}</div> : null}
    </div>
  );
};
