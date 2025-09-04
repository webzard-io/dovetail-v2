import React, { useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyValueTableForm,
  KeyValueTableFormHandle,
  KeyValuePair,
} from 'src/components/KeyValueTableForm';
import { SelectMatchLabelButton } from './SelectMatchLabelButton';

interface MatchLabelSelectorProps {
  value: KeyValuePair[];
  namespace: string;
  onChange: (value: KeyValuePair[]) => void;
}

export const MatchLabelSelector = React.forwardRef<
  KeyValueTableFormHandle,
  MatchLabelSelectorProps
>(function MatchLabelSelector(props, ref) {
  const { value, namespace, onChange } = props;
  const keyValueTableFormRef = useRef<KeyValueTableFormHandle>(null);
  const { t } = useTranslation();

  useImperativeHandle(
    ref,
    () => ({
      validate: () => keyValueTableFormRef.current?.validate() || Promise.resolve(true),
      submit: () => keyValueTableFormRef.current?.submit(),
      setValue: (value: KeyValuePair[]) => keyValueTableFormRef.current?.setValue(value),
    }),
    []
  );

  return (
    <KeyValueTableForm
      ref={keyValueTableFormRef}
      value={value || []}
      defaultValue={value || []}
      addButtonText={t('dovetail.add_label')}
      extraAction={<SelectMatchLabelButton namespace={namespace} onChange={onChange} />}
      onChange={onChange}
      isValueOptional={false}
      minSize={1}
      isHideLabelFormatPopover
    />
  );
});
