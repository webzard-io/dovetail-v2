import { useUIKit } from '@cloudtower/eagle';
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
  const kit = useUIKit();

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
      console.log(event);
      const value = event.target.value;

      props.onChange?.({
        ...item,
        value,
      });
    },
    [item, props]
  );

  return (
    <kit.space>
      <kit.input value={item.key} onChange={onKeyChange} />
      <kit.textArea value={item.value} onChange={onValueChange} />
      {children}
    </kit.space>
  );
}

export type KeyValueListWidgetProps = FormWidgetProps<Record<string, string>> & {
  disabled?: boolean;
};

export function KeyValueListWidget(props: KeyValueListWidgetProps) {
  const kit = useUIKit();
  const { value } = props;

  const items: Item[] = useMemo(() => {
    return Object.entries(value || {}).map(([key, value]) => ({
      key,
      value,
    }));
  }, [value]);

  const onChange = useCallback(
    (newItems: { key: string; value: string }[]) => {
      const newValue = newItems.reduce(
        (result, item) => {
          result[item.key] = item.value;

          return result;
        },
        {} as Record<string, string>
      );

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
              console.log(newItem);
              const temp = [...items];

              temp.splice(index, 1, newItem);
              onChange(temp);
            }}
          >
            <kit.button
              onClick={() => {
                onRemove(index);
              }}
              danger
            >
              Remove
            </kit.button>
          </KeyValueInput>
        );
      })}
      <kit.form.Item>
        <kit.button type="primary" onClick={onAdd}>
          Add
        </kit.button>
      </kit.form.Item>
    </>
  );
}
