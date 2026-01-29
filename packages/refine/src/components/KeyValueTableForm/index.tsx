import {
  Space,
  TableForm,
  TableFormColumn,
  TableFormHandle,
  TextArea,
  Button,
  Upload,
  AutoComplete,
} from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { isEqual } from 'lodash-es';
import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { readFileAsBase64 } from 'src/utils/file';
import { validateLabelKey, validateLabelValue } from '../../utils/validation';
import { LabelFormatPopover } from '../EditMetadataForm/LabelFormatPopover';

export type KeyValuePair = {
  key: string;
  value?: string;
};

interface KeyValueTableFormProps<T extends KeyValuePair> {
  value?: T[];
  defaultValue: T[];
  keyOptions?: { label: string; value: string }[];
  onChange?: (value: T[]) => void;
  extraColumns?: TableFormColumn[];
  addButtonText?: string;
  noValueValidation?: boolean;
  isHideLabelFormatPopover?: boolean;
  isValueOptional?: boolean;
  canImportFromFile?: boolean;
  minSize?: number;
  extraAction?: React.ReactNode;
  disabledChagneDefaultValues?: boolean;
  validateKey?: (key: string) => { isValid: boolean; errorMessage?: string };
  validateValue?: (value: string) => { isValid: boolean; errorMessage?: string };
  onSubmit?: (value: T[]) => Promise<unknown> | undefined;
  keyTitle?: string;
}

export type KeyValueTableFormHandle<T extends KeyValuePair = KeyValuePair> = {
  validate: () => Promise<boolean>;
  submit: () => Promise<unknown> | undefined;
  setValue: (value: T[]) => void;
};

function _KeyValueTableForm<RowType extends KeyValuePair>(
  props: KeyValueTableFormProps<RowType>,
  ref: React.ForwardedRef<KeyValueTableFormHandle<RowType>>
) {
  const {
    value,
    defaultValue,
    onChange,
    extraColumns,
    addButtonText,
    noValueValidation,
    isHideLabelFormatPopover,
    isValueOptional = true,
    disabledChagneDefaultValues,
    canImportFromFile,
    minSize,
    extraAction,
    keyOptions,
    validateKey,
    validateValue,
    onSubmit,
    keyTitle,
  } = props;
  const { t, i18n } = useTranslation();
  const tableFormRef = useRef<TableFormHandle>(null);
  const [_value, _setValue] = useState<RowType[]>(value || defaultValue);
  const [forceUpdateCount, setForceUpdateCount] = useState(0);

  const finalExtraAction = useMemo(() => {
    if (extraAction) {
      return extraAction;
    }

    if (canImportFromFile) {
      return (
        <Upload
          multiple={true}
          showUploadList={false}
          onChange={async e => {
            const fileValue = {
              key: e.file.name,
              value: await readFileAsBase64(e.file.originFileObj as File),
            };

            let newValue = [..._value, fileValue] as RowType[];

            if (_value.some(v => v.key === fileValue.key)) {
              newValue = _value.map(v =>
                v.key === fileValue.key ? fileValue : v
              ) as RowType[];
            }

            _setValue(newValue);
            tableFormRef.current?.setData(newValue);
            onChange?.(newValue);
          }}
        >
          <Button type="link" size="small">
            {t('dovetail.import_from_file')}
          </Button>
        </Upload>
      );
    }

    return null;
  }, [canImportFromFile, t, _value, onChange, extraAction]);
  const validate = useCallback(() => {
    return new Promise<boolean>(resolve => {
      tableFormRef.current?.validateWholeFields();
      setForceUpdateCount(forceUpdateCount + 1);

      setTimeout(() => {
        const isValid = tableFormRef.current?.isValid();

        resolve(isValid || false);
      }, 0);
    });
  }, [forceUpdateCount]);

  useImperativeHandle(
    ref,
    () => ({
      validate,
      submit: async () => {
        const isValid = await validate();

        if (isValid) {
          return onSubmit?.(_value);
        }
        return Promise.reject();
      },
      setValue: (value: RowType[]) => {
        _setValue(value);
        tableFormRef.current?.setData(value);
      },
    }),
    [validate, onSubmit, _value]
  );

  useEffect(() => {
    if (value && !isEqual(value, _value)) {
      _setValue(value);
      tableFormRef.current?.setData(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const renderAutoCompleteFunc = ({
    value,
    onChange,
    rowIndex,
    disabled,
  }: {
    value?: string;
    onChange: (v: string) => void;
    rowIndex?: number;
    disabled?: boolean;
  }) => {
    const record = _value[rowIndex || 0];

    return (
      <AutoComplete
        options={keyOptions || []}
        value={value}
        onChange={onChange}
        size="small"
        filterOption={(inputValue, option) =>
          option?.label?.toString().toLowerCase().includes(inputValue.toLowerCase()) ||
          false
        }
        disabled={
          disabled ||
          (disabledChagneDefaultValues && defaultValue.some(row => isEqual(row, record)))
        }
        allowClear
      />
    );
  };
  const renderTextAreaFunc = ({
    value,
    onChange,
    rowIndex,
    disabled,
  }: {
    value?: string;
    onChange: (v: string) => void;
    rowIndex?: number;
    disabled?: boolean;
  }) => {
    const record = _value[rowIndex || 0];

    return (
      <TextArea
        autoSize
        className={css`
          min-height: 24px !important;
        `}
        size="small"
        value={value}
        disabled={
          disabled ||
          (disabledChagneDefaultValues && defaultValue.some(row => isEqual(row, record)))
        }
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
        onBodyChange={newValue => {
          _setValue(newValue as RowType[]);
          onChange?.(newValue as RowType[]);
        }}
        columns={[
          {
            key: 'key',
            title: keyTitle || t('dovetail.key'),
            type: 'input',
            validator: ({ value }) => {
              if (!value) return t('dovetail.key_empty_text');
              const validate = validateKey || validateLabelKey;
              const { isValid, errorMessage } = validate(value || '');
              if (!isValid) return errorMessage || t('dovetail.format_error');
            },
            render: keyOptions?.length ? renderAutoCompleteFunc : renderTextAreaFunc,
          },
          {
            key: 'value',
            title: isValueOptional ? t('dovetail.value_optional') : t('dovetail.value'),
            type: 'input',
            validator: ({ value }) => {
              if (noValueValidation) return;
              const validate = validateValue || validateLabelValue;
              const { isValid, errorMessage } = validate(
                value || '',
                i18n,
                isValueOptional
              );
              if (!isValid) return errorMessage || t('dovetail.format_error');
            },
            render: renderTextAreaFunc,
          },
          ...(extraColumns || []),
        ]}
        rowAddConfig={{
          addible: true,
          text: () => addButtonText,
          extraAction: finalExtraAction,
        }}
        defaultData={_value}
        row={{
          deletable: _value.length > (minSize || 0),
          disableActions(rowIndex, datas) {
            const record = datas[rowIndex];

            if (
              disabledChagneDefaultValues &&
              defaultValue.some(row => isEqual(row, record))
            ) {
              return ['delete'];
            }
          },
        }}
        disableBatchFilling
        hideEmptyTable
      />
      {isHideLabelFormatPopover || _value.length === 0 ? null : (
        <LabelFormatPopover noValueValidation={noValueValidation} />
      )}
    </Space>
  );
}

export const KeyValueTableForm = React.forwardRef(_KeyValueTableForm);
