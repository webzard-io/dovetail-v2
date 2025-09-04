import { InputGroup, Select, InputInteger } from '@cloudtower/eagle';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface NodePortProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

export function NodePort({ value, onChange }: NodePortProps) {
  const [mode, setMode] = useState<'auto' | 'manual'>(value ? 'manual' : 'auto');
  const { t } = useTranslation();

  return (
    <InputGroup size="small" compact>
      <Select
        style={{ width: mode === 'manual' ? 100 : 200 }}
        input={{
          value: mode,
          onChange: newValue => {
            setMode(newValue as 'auto' | 'manual');
            onChange(null);
          },
        }}
        options={[
          { label: t('dovetail.auto_generate'), value: 'auto' },
          { label: t('dovetail.specify_port'), value: 'manual' },
        ]}
        size="small"
      />
      {mode === 'manual' ? (
        <InputInteger
          style={{ width: 100 }}
          value={value || undefined}
          size="small"
          placeholder="30000-32767"
          onChange={newValue => {
            onChange(Number(newValue));
          }}
        />
      ) : null}
    </InputGroup>
  );
}
