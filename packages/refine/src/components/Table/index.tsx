import { Button } from '@cloudtower/eagle';
import { cx } from '@linaria/core';
import { useParsed } from '@refinedev/core';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { WidgetErrorContentProps } from 'src/components/ErrorContent';
import ErrorContent from 'src/components/ErrorContent';
import { InternalTableProps } from 'src/components/InternalBaseTable';
import InternalBaseTable from 'src/components/InternalBaseTable';
import { ComponentContext } from 'src/contexts';
import { NAME_KEYWORD_PARAM } from 'src/hooks';
import { ResourceModel } from 'src/models';
import { transformResourceKindInSentence } from 'src/utils/string';

interface TableProps<Model extends ResourceModel> {
  tableProps: InternalTableProps<Model>;
  displayName: string;
  errorContentProps?: WidgetErrorContentProps;
  isSearching?: boolean;
}

export function Table<Model extends ResourceModel>(props: TableProps<Model>) {
  const { tableProps, displayName, errorContentProps, isSearching } = props;
  const { Table: TableComponent } = useContext(ComponentContext);
  const Table = TableComponent || InternalBaseTable;
  const { params } = useParsed();
  const { i18n } = useTranslation();
  const resourceType = transformResourceKindInSentence(displayName, i18n.language);
  if (!tableProps.data?.length && !tableProps.loading) {
    const nameKeyword = (params?.[NAME_KEYWORD_PARAM] as string) || '';
    // 若url中存在name_keyword参数，则显示清空搜索条件的按钮
    if (nameKeyword || isSearching) {
      const onClear = () => {
        tableProps.onClearSearchKeyword?.();
      };
      return (
        <ErrorContent errorText={i18n.t('dovetail.no_search_result')}>
          <Button onClick={onClear} type="ordinary">
            {i18n.t('dovetail.clear_search_condition')}
          </Button>
        </ErrorContent>
      );
    }
    return (
      <ErrorContent
        errorText={
          tableProps.empty || i18n.t('dovetail.no_resource', { kind: resourceType })
        }
        {...errorContentProps}
      />
    );
  }

  return (
    <Table
      {...tableProps}
      empty={tableProps.empty || i18n.t('dovetail.no_resource', { kind: resourceType })}
      className={cx(tableProps.className)}
    />
  );
}
