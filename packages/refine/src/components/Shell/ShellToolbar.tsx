import { SearchInput, Icon, Tooltip, DropdownMenu } from '@cloudtower/eagle';
import {
  FontSize16GrayIcon,
  FontSize16BlueIcon,
  LogCollection16GrayIcon,
  LogCollection16GradientBlueIcon,
  TrashBinDeletePermanently16GrayIcon,
  TrashBinDeletePermanently16BlueIcon,
} from '@cloudtower/icons-react';
import { css, cx } from '@linaria/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ToolbarStyle = css`
  display: flex;
  justify-content: space-between;
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
  className?: string;
  leftSlot?: React.ReactNode;
  operations?: (OperationType | React.ReactNode)[];
  searchMatchedTotal: number;
  onSearchNext: (search: string) => void;
  onSearchPre: (search: string) => void;
  onSetFontSize?: (size: number) => void;
  onDownFontSize?: () => void;
  onDownloadLog?: () => void;
  onClear?: () => void;
}


function ShellToolbar(props: ShellToolbarProps) {
  const {
    className,
    leftSlot,
    operations = ['fontSize', 'downloadLog', 'clear'],
    searchMatchedTotal,
    onSetFontSize,
    onSearchNext,
    onSearchPre,
    onDownloadLog,
    onClear,
  } = props;
  const { t } = useTranslation();
  const fontSizeOptions = [12, 13, 14, 16, 20];
  const operationMap: Record<string, React.ReactNode> = {
    fontSize: (
      <DropdownMenu
        trigger={['click']}
        items={fontSizeOptions.map(size => ({
          key: `${size}`,
          title: `${size}px`,
          text: `${size}px`,
          onClick: () => { onSetFontSize?.(size); }
        }))}
        slotsElements={{
          trigger: () => (
            <Tooltip title={t('dovetail.font_size')}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon
                  className={IconStyle}
                  src={FontSize16GrayIcon}
                  hoverSrc={FontSize16BlueIcon}
                />
              </div>
            </Tooltip>
          )
        }}
      />
    ),
    downloadLog: (
      <Tooltip title={t('dovetail.download_shell_content')}>
        <Icon
          className={IconStyle}
          src={LogCollection16GrayIcon}
          hoverSrc={LogCollection16GradientBlueIcon}
          onClick={onDownloadLog}
        />
      </Tooltip>
    ),
    clear: (
      <Tooltip title={t('dovetail.clear_shell')}>
        <Icon
          className={IconStyle}
          src={TrashBinDeletePermanently16GrayIcon}
          hoverSrc={TrashBinDeletePermanently16BlueIcon}
          onClick={onClear}
        />
      </Tooltip>
    )
  };

  return (
    <div className={cx(ToolbarStyle, className)}>
      <div className={ToolbarAreaStyle}>
        {leftSlot}
      </div>
      <div className={ToolbarAreaStyle}>
        <SearchInput
          placeholder="Search..."
          size="small"
          total={searchMatchedTotal}
          onChange={(str) => {
            onSearchNext(str);
          }}
          onSearchNext={(str) => {
            onSearchNext(str);
          }}
          onSearchPrev={(str) => {
            onSearchPre(str);
          }}
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
