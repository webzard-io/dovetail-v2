import { Typo, Space } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import { useResource, CanAccess } from '@refinedev/core';
import React from 'react';
import { AccessControlAuth } from 'src/constants/auth';
import { CreateButton } from '../CreateButton';
import { DeleteManyButton } from '../DeleteManyButton';

type Props = {
  title?: string;
  description?: React.ReactNode;
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
  color: $gray-120;
`;
const DescriptionStyle = css`
  color: $gray-a75-8;
  margin-top: 4px;
`;

export const TableToolBar: React.FC<Props> = ({
  title,
  description,
  selectedKeys,
  hideCreate,
}) => {
  const { resource } = useResource();

  return (
    <div className={cx(ToolbarWrapperStyle, 'table-toolbar')}>
      <Space className={ToolbarStyle}>
        <span className={cx(Typo.Display.d2_regular_title, TitleStyle)}>
          {title || resource?.meta?.kind}
        </span>
        <Space>
          {selectedKeys.length > 0 ? <DeleteManyButton ids={selectedKeys} /> : undefined}
          <CanAccess resource={resource?.name} action={AccessControlAuth.Create}>
            {!hideCreate ? <CreateButton label={title} /> : null}
          </CanAccess>
        </Space>
      </Space>
      {description ? <div className={DescriptionStyle}>{description}</div> : null}
    </div>
  );
};
