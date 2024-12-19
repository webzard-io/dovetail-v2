import { AntdTable, Button, Popover, Typo } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const PodLabelFormatRulePopoverStyle = css`
  .ant-popover-inner {
    border-radius: 8px;
  }

  .ant-popover-innerntent {
    padding: 12px;
  }

  .ant-popover-content {
    & > .ant-popover-arrow {
      display: none;
    }
  }

  td.ant-table-cell {
    vertical-align: middle;
  }

  .rule-list {
    list-style: disc;
    list-style-position: inside;
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
    }

    li {
      text-indent: 8px;
    }
  }
`;

export const LabelFormatPopover: React.FC<{
  noValueValidation?: boolean;
}> = ({ noValueValidation }) => {
  const { t } = useTranslation();

  const data = [
    {
      object: t('dovetail.key'),
      contains: t('dovetail.prefix'),
      optional: t('dovetail.no'),
      rule: [
        t('dovetail.prefix_format_rule_1'),
        t('dovetail.prefix_format_rule_2'),
        t('dovetail.prefix_format_rule_3'),
      ],
    },
    {
      object: t('dovetail.key'),
      contains: t('dovetail.name'),
      optional: t('dovetail.yes'),
      rule: [
        t('dovetail.name_format_rule_1'),
        t('dovetail.name_format_rule_2'),
        t('dovetail.name_format_rule_3'),
      ],
    },
  ];

  if (!noValueValidation) {
    data.push({
      object: t('dovetail.value'),
      contains: t('dovetail.name'),
      optional: t('dovetail.no'),
      rule: [
        t('dovetail.name_format_rule_1'),
        t('dovetail.name_format_rule_2'),
        t('dovetail.name_format_rule_3'),
      ],
    });
  } else {
    data.push({
      object: t('dovetail.value'),
      contains: t('dovetail.name'),
      optional: t('dovetail.no'),
      rule: [t('dovetail.no_limitation_rule')],
    });
  }

  return (
    <Popover
      trigger="click"
      overlayClassName={PodLabelFormatRulePopoverStyle}
      placement="bottomRight"
      content={
        <AntdTable
          bordered
          dataSource={data}
          columns={[
            {
              key: 'object',
              title: t('dovetail.object'),
              dataIndex: 'object',
              render: (cell, record, index) => {
                return {
                  children: <span className={Typo.Label.l4_bold}>{cell}</span>,
                  props: {
                    rowSpan: index === 0 ? 2 : index === 1 ? 0 : 1,
                  },
                };
              },
            },
            {
              key: 'contains',
              title: t('dovetail.contains'),
              dataIndex: 'contains',
            },
            {
              key: 'optional',
              title: t('dovetail.optional'),
              dataIndex: 'optional',
            },
            {
              key: 'rule',
              title: t('dovetail.format_requirements'),
              dataIndex: 'rule',
              render: (cell: string[]) => {
                return (
                  <ul className="rule-list">
                    {cell.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                );
              },
            },
          ]}
          pagination={false}
        />
      }
    >
      <Button size="small" type="link">
        {t('dovetail.look_format_requirement')}
      </Button>
    </Popover>
  );
};
