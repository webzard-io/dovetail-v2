import { InputGroup, Select, Fields } from '@cloudtower/eagle';
import React from 'react';
import { useTranslation } from 'react-i18next';

export enum NodePortMode {
  Auto = 'auto',
  Manual = 'manual',
}

interface NodePortProps {
  value: number | undefined;
  mode: NodePortMode;
  onChange: (value: number | undefined, mode: NodePortMode) => void;
}

export function NodePort({ value, mode, onChange }: NodePortProps) {
  const { t } = useTranslation();

  return (
    <InputGroup size="small" compact>
      <Select
        style={{ width: mode === NodePortMode.Manual ? 100 : 200 }}
        input={{
          value: mode,
          onChange: newMode => {
            onChange(value, newMode as NodePortMode);
          },
        }}
        options={[
          { label: t('dovetail.auto_generate'), value: NodePortMode.Auto },
          { label: t('dovetail.specify_port'), value: NodePortMode.Manual },
        ]}
        size="small"
      />
      {mode === NodePortMode.Manual ? (
        <Fields.Int
          input={{
            value: value || undefined,
            onChange: newValue => {
              onChange(Number(newValue), mode);
            },
            onBlur: () => undefined,
            onFocus: () => undefined,
            name: 'nodePort',
          }}
          meta={{}}
          style={{ width: 100 }}
          size="small"
          placeholder="30000-32767"
          minimum={30000}
          maximum={32767}
        />
      ) : null}
    </InputGroup>
  );
}
