import { SearchInput, Icon } from '@cloudtower/eagle';
import {
  LogCollection16GrayIcon,
  LogCollection16GradientBlueIcon,
  TrashBinDelete16Icon,
  InfoICircle16GradientGrayIcon,
  InfoICircle16GradientBlueIcon,
} from '@cloudtower/icons-react';
import { css } from '@linaria/core';
import React, { useState, useCallback } from 'react';

const ToolbarStyle = css`
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  height: 32px;
`;
const ToolbarAreaStyle = css`
  display: flex;
  align-items: center;
`;
const IconWrapperStyle = css`
  display: flex;
  gap: 16px;
`;
const IconStyle = css`
  cursor: pointer;
`;
const DividerStyle = css`
  width: 1px;
  height: 100%;
  background: rgba(172, 186, 211, 0.60);
  margin: 0 16px;
`;

type OperationType = ('fontSize' | 'downloadLog' | 'clear');

export interface ShellToolbarProps {
  leftSlot?: React.ReactNode;
  operations?: (OperationType | React.ReactNode)[];
  onSearchNext: (search: string) => void;
  onSearchPre: (search: string) => void;
  onUpFontSize?: () => void;
  onDownFontSize?: () => void;
  onDownloadLog?: () => void;
  onClear?: () => void;
}


function ShellToolbar(props: ShellToolbarProps) {
  const {
    leftSlot,
    operations = ['fontSize', 'downloadLog', 'clear'],
    onSearchNext,
    onSearchPre,
    onDownloadLog,
    onClear,
  } = props;
  const [search, setSearch] = useState('');
  const operationMap: Record<string, React.ReactNode> = {
    fontSize: <Icon
      className={IconStyle}
      src={InfoICircle16GradientGrayIcon}
      hoverSrc={InfoICircle16GradientBlueIcon}
    />,
    downloadLog: <Icon
      className={IconStyle}
      src={LogCollection16GrayIcon}
      hoverSrc={LogCollection16GradientBlueIcon}
      onClick={onDownloadLog}
    />,
    clear: <Icon
      className={IconStyle}
      src={TrashBinDelete16Icon}
      onClick={onClear}
    />
  };

  const onSearch = useCallback((str: string | unknown) => {
    if (typeof str === 'string') {
      setSearch(str);
      onSearchNext(str);
    } else {
      onSearchNext(search);
    }
  }, [search, onSearchNext]);

  return (
    <div className={ToolbarStyle}>
      <div className={ToolbarAreaStyle}>
        {leftSlot}
      </div>
      <div className={ToolbarAreaStyle}>
        <SearchInput
          placeholder="Search..."
          size="small"
          onChange={onSearch}
          onPressEnter={onSearch}
        />
        <div className={DividerStyle}></div>
        <div className={IconWrapperStyle}>
          {
            operations.map(operation => (
              typeof operation === 'string' ? operationMap[operation] || null : operation
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default ShellToolbar;
