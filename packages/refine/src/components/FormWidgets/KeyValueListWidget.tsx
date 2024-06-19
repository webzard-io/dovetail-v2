import { Space, Input, TextArea, Form, Button } from '@cloudtower/eagle';
import React, { useCallback, useMemo } from 'react';
import type { FormWidgetProps } from './widget';

type Item = {
  key: string;
  value: string;
};

type KeyValueInputProps = React.PropsWithChildren<{
  item: Item;
  onChange?: (item: Item) => void;
}>;

function KeyValueInput(props: KeyValueInputProps) {
  const { children, item } = props;

  const onKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const key = event.target.value;

      props.onChange?.({
        ...item,
        key,
      });
    },
    [item, props]
  );
  const onValueChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value;

      props.onChange?.({
        ...item,
        value,
      });
    },
    [item, props]
  );

  return (
    <Space>
      <Input value={item.key} onChange={onKeyChange} />
      <TextArea value={item.value} onChange={onValueChange} />
      {children}
    </Space>
  );
}

export type KeyValueListWidgetProps = FormWidgetProps<Record<string, string>> & {
  disabled?: boolean;
};

export function KeyValueListWidget(props: KeyValueListWidgetProps) {
  const { value } = props;

  const items: Item[] = useMemo(() => {
    return Object.entries(value || {}).map(([key, value]) => ({
      key,
      value,
    }));
  }, [value]);

  const onChange = useCallback(
    (newItems: { key: string; value: string }[]) => {
      const newValue = newItems.reduce((result, item) => {
        result[item.key] = item.value;

        return result;
      }, {} as Record<string, string>);

      props.onChange?.(newValue);
    },
    [props]
  );
  const onRemove = useCallback(
    (index: number) => {
      const result = [...items];

      result.splice(index, 1);
      onChange(result);
    },
    [onChange, items]
  );
  const onAdd = useCallback(() => {
    onChange([...items, { key: '', value: '' }]);
  }, [onChange, items]);

  return (
    <>
      {items.map((item, index) => {
        return (
          <KeyValueInput
            key={index}
            item={item}
            onChange={newItem => {
              const temp = [...items];

              temp.splice(index, 1, newItem);
              onChange(temp);
            }}
          >
            <Button
              onClick={() => {
                onRemove(index);
              }}
              danger
            >
              Remove
            </Button>
          </KeyValueInput>
        );
      })}
      <Form.Item>
        <Button type="primary" onClick={onAdd}>
          Add
        </Button>
      </Form.Item>
    </>
  );
}
