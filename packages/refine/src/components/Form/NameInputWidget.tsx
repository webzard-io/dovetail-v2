import { useUIKit, AntdInputProps } from '@cloudtower/eagle';
import { useResource } from '@refinedev/core';
import React from 'react';

export function NameInputWidget(props: AntdInputProps) {
  const kit = useUIKit();
  const { action } = useResource();

  return <kit.input {...props} disabled={action === 'edit'} />;
}

export const dnsSubDomainRules = [
  {
    required: true,
    message: '名称不能为空',
  },
  {
    pattern: /^[a-z0-9]([-.a-z0-9]*[a-z0-9])?$/,
    message: "名称只能包含小写字母、数字，以及 '-' 和 '.'，且必须以字母或数字开头和结束",
  },
  {
    max: 253,
    message: '名称长度不能超过253个字符',
  },
];

export const rfc1123LabelRules = [
  {
    required: true,
    message: '名称不能为空',
  },
  {
    pattern: /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/,
    message: "名称只能包含小写字母、数字，以及 '-'，且以字母或数字开头和结束",
  },
  {
    max: 63,
    message: '名称长度不能超过63个字符',
  },
];

export const rfc1035LabelRules = [
  {
    required: true,
    message: '名称不能为空',
  },
  {
    pattern: /^[a-z]([-a-z0-9]*[a-z0-9])?$/,
    message: "名称只能包含小写字母、数字，以及 '-'，且以字母开头，字母或数字结束",
  },
  {
    max: 63,
    message: '名称长度不能超过63个字符',
  },
];
