import { useUIKit } from '@cloudtower/eagle';
import React from 'react';
import { KeyValueListWidget } from './KeyValueListWidget';
import { NameInputWidget, rfc1123LabelRules } from './NameInputWidget';
import { NamespaceSelectWidget, namespaceRules } from './NamespaceSelectWidget';

export function MetadataWidget() {
  const kit = useUIKit();

  return (
    <>
      <kit.form.Item
        label="Name"
        name={['metadata', 'name']}
        rules={rfc1123LabelRules}
      >
        <NameInputWidget />
      </kit.form.Item>
      <kit.form.Item
        label="Namespace"
        name={['metadata', 'namespace']}
        rules={namespaceRules}
      >
        <NamespaceSelectWidget />
      </kit.form.Item>
      <kit.form.Item name={['metadata', 'labels']} label="Labels">
        <KeyValueListWidget />
      </kit.form.Item>
      <kit.form.Item name={['metadata', 'annotations']} label="Annotations">
        <KeyValueListWidget />
      </kit.form.Item>
    </>
  );
}
