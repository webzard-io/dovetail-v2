import { SegmentControl } from '@cloudtower/eagle';
import React from 'react';
import i18n from 'src/i18n';
import { CommonFormConfig, RefineFormConfig, FormMode } from 'src/types';

interface FormModeSegmentControlProps {
  formConfig: CommonFormConfig & RefineFormConfig;
  mode: FormMode;
  onChangeMode: (mode: FormMode) => void;
}

function FormModeSegmentControl({
  formConfig,
  mode,
  onChangeMode,
}: FormModeSegmentControlProps) {
  const { isDisabledChangeMode } = formConfig;

  return !isDisabledChangeMode ? (
    <SegmentControl
      style={{ fontWeight: 'normal' }}
      value={mode}
      options={[
        {
          value: FormMode.FORM,
          label: i18n.t('dovetail.form'),
        },
        {
          value: FormMode.YAML,
          label: i18n.t('dovetail.yaml'),
        },
      ]}
      onChange={val => {
        onChangeMode(val as FormMode);
      }}
    />
  ) : null;
}

export default FormModeSegmentControl;
