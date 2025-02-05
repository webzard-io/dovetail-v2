import { cx } from '@linaria/core';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { WidgetErrorContentProps } from 'src/components/ErrorContent';
import ErrorContent from 'src/components/ErrorContent';
import { InternalTableProps } from 'src/components/InternalBaseTable';
import InternalBaseTable from 'src/components/InternalBaseTable';
import { ComponentContext } from 'src/contexts';
import { ResourceModel } from 'src/models';
import { transformResourceKindInSentence } from 'src/utils/string';

interface TableProps<Model extends ResourceModel> {
  tableProps: InternalTableProps<Model>;
  displayName: string;
  errorContentProps?: WidgetErrorContentProps;
}

export function Table<Model extends ResourceModel>(props: TableProps<Model>) {
  const { tableProps, displayName, errorContentProps } = props;
  const { Table: TableComponent } = useContext(ComponentContext);
  const Table = TableComponent || InternalBaseTable;
  const { i18n } = useTranslation();
  const resourceType = transformResourceKindInSentence(displayName, i18n.language);

  if (!tableProps.data?.length && !tableProps.loading) {
    return <ErrorContent
      errorText={tableProps.empty || i18n.t('dovetail.no_resource', { kind: resourceType })}
      {...errorContentProps}
    />;
  }

  return (
    <Table
      {...tableProps}
      empty={
        tableProps.empty || i18n.t('dovetail.no_resource', { kind: resourceType })
      }
      className={cx(tableProps.className)}
    />
  );
}
