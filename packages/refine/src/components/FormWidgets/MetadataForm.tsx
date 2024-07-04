import { Form } from '@cloudtower/eagle';
import React from 'react';
import { KeyValueListWidget } from './KeyValueListWidget';
import { NameInputWidget, rfc1123LabelRules } from './NameInputWidget';
import { NamespaceSelectWidget, namespaceRules } from './NamespaceSelectWidget';

export function MetadataForm() {
  return (
    <>
      <Form.Item label="Name" name={['metadata', 'name']} rules={rfc1123LabelRules}>
        <NameInputWidget />
      </Form.Item>
      <Form.Item
        label="Namespace"
        name={['metadata', 'namespace']}
        rules={namespaceRules}
      >
        <NamespaceSelectWidget />
      </Form.Item>
      <Form.Item name={['metadata', 'labels']} label="Labels">
        <KeyValueListWidget />
      </Form.Item>
      <Form.Item name={['metadata', 'annotations']} label="Annotations">
        <KeyValueListWidget />
      </Form.Item>
    </>
  );
}
