import {
  Space,
  TableForm,
  TableFormColumn,
  TableFormHandle,
  TextArea,
} from '@cloudtower/eagle';
import { css } from '@linaria/core';
import React, { useState, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { validateLabelKey, validateLabelValue } from '../../utils/validation';
import { EditFieldFormHandler } from '../EditField';
import { LabelFormatPopover } from './LabelFormatPopover';

export type KeyValuePair = {
  key: string;
  value?: string;
};

interface KeyValueTableFormFormProps<T extends KeyValuePair> {
  defaultValue: T[];
  onSubmit: (value: T[]) => Promise<unknown> | undefined;
  extraColumns?: TableFormColumn[];
  addButtonText?: string;
}

function _KeyValueTableFormForm<RowType extends KeyValuePair>(
  props: KeyValueTableFormFormProps<RowType>,
  ref: React.ForwardedRef<EditFieldFormHandler>
) {
  const { defaultValue, onSubmit, extraColumns, addButtonText } = props;
  const { t } = useTranslation();
  const [value, setValue] = useState<RowType[]>([]);
  const tableFormRef = useRef<TableFormHandle>(null);

  useImperativeHandle(
    ref,
    () => ({
      submit: () => {
        return new Promise((res, rej) => {
          tableFormRef.current?.validateWholeFields();
          setTimeout(() => {
            const isValid = tableFormRef.current?.isValid();
            if (isValid) {
              res(onSubmit(value));
            } else {
              rej();
            }
          }, 0);
        });
      },
    }),
    [onSubmit, value]
  );

  const renderTextAreaFunc = ({
    value,
    onChange,
  }: {
    value?: string;
    onChange: (v: string) => void;
  }) => {
    return (
      <TextArea
        autoSize
        className={css`
          min-height: 24px !important;
        `}
        size="small"
        value={value}
        onChange={e => {
          onChange(e.target.value);
        }}
      />
    );
  };

  return (
    <Space
      size={8}
      direction="vertical"
      className={css`
        width: 100%;
      `}
    >
      <TableForm
        ref={tableFormRef}
        onBodyChange={value => {
          setValue(value as RowType[]);
        }}
        columns={[
          {
            key: 'key',
            title: t('dovetail.key'),
            type: 'input',
            validator: ({ value }) => {
              if (!value) return t('dovetail.key_empty_text');
              const { isValid, errorMessage } = validateLabelKey(value || '');
              if (!isValid) return t('dovetail.format_error');
            },
            render: renderTextAreaFunc,
          },
          {
            key: 'value',
            title: t('dovetail.value_optional'),
            type: 'input',
            validator: ({ value }) => {
              const { isValid } = validateLabelValue(value || '');
              if (!isValid) return t('dovetail.format_error');
            },
            render: renderTextAreaFunc,
          },
          ...(extraColumns || []),
        ]}
        disableBatchFilling
        hideEmptyTable
        rowAddConfig={{
          addible: true,
          text: () => addButtonText
        }}
        defaultData={defaultValue}
        row={{
          deletable: true,
        }}
      />
      <LabelFormatPopover />
    </Space>
  );
}

export const KeyValueTableFormForm = React.forwardRef(_KeyValueTableFormForm);
