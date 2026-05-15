import { Typo } from '@cloudtower/eagle';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormatRulePopover } from '../KeyValueTableForm/FormatRulePopover';

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
    <FormatRulePopover
      buttonText={t('dovetail.look_format_requirement')}
      dataSource={data}
      columns={[
        {
          key: 'object',
          title: t('dovetail.object'),
          dataIndex: 'object',
          render: (cell: string, _record: unknown, index: number) => ({
            children: <span className={Typo.Label.l4_bold}>{cell}</span>,
            props: {
              rowSpan: index === 0 ? 2 : index === 1 ? 0 : 1,
            },
          }),
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
          render: (cell: string[]) => (
            <ul style={{ listStyle: 'disc', listStylePosition: 'inside' }}>
              {cell.map((rule, i) => (
                <li key={i} style={{ textIndent: 8 }}>{rule}</li>
              ))}
            </ul>
          ),
        },
      ]}
    />
  );
};
