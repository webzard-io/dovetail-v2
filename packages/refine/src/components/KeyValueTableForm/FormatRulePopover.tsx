import { AntdTable, Button, Popover } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import React from 'react';

const FormatRulePopoverStyle = css`
  .ant-popover-inner {
    border-radius: 8px;
  }

  .ant-popover-content > .ant-popover-arrow {
    display: none;
  }

  .ant-table {
    font-size: 12px;
    line-height: 18px;

    .ant-table-container {
      border: none !important;
    }

    .ant-table-thead {
      font-weight: 700;
    }

    .ant-table-thead > tr > th {
      background: $white;
    }

    thead > tr > th:last-child,
    tbody > tr > td:last-child {
      border-right: none !important;
    }

    tbody > tr:last-child > td {
      border-bottom: none;
    }

    .ant-table-cell {
      padding: 4px 8px !important;
      vertical-align: middle;
    }
  }
`;

export interface FormatRulePopoverProps {
  buttonText: string;
  // biome-ignore lint/suspicious/noExplicitAny: AntdTable column/data types are generic
  columns: any[];
  // biome-ignore lint/suspicious/noExplicitAny: AntdTable data rows are generic
  dataSource: any[];
}

export const FormatRulePopover: React.FC<FormatRulePopoverProps> = ({
  buttonText,
  columns,
  dataSource,
}) => (
  <Popover
    trigger="click"
    overlayClassName={FormatRulePopoverStyle}
    placement="bottomRight"
    content={
      <AntdTable
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        rowKey={(_, index) => String(index)}
      />
    }
  >
    <Button size="small" type="link">
      {buttonText}
    </Button>
  </Popover>
);
