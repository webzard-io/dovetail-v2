import { css } from '@linaria/core';
import yaml from 'js-yaml';
import type {
  NetworkPolicyIngressRule,
  NetworkPolicyEgressRule,
} from 'kubernetes-types/networking/v1';
import React from 'react';
import { useTranslation } from 'react-i18next';
import MonacoYamlEditor from 'src/components/YamlEditor/MonacoYamlEditor';
import ErrorContent from '../Table/ErrorContent';

const EditorStyle = css`
  border-radius: 8px;
  border: 1px solid rgba(211, 218, 235, 0.60);

  .monaco-editor,
  .monaco-scrollable-element,
  .overflow-guard > .margin {
    border-radius: 8px;
  }
`;

type Props = {
  ingressOrEgress: NetworkPolicyIngressRule[] | NetworkPolicyEgressRule[];
  kind?: string;
};

export const NetworkPolicyRulesViewer: React.FC<Props> = ({ ingressOrEgress, kind }) => {
  const { t } = useTranslation();

  if (!ingressOrEgress) {
    return <ErrorContent errorText={t('dovetail.no_resource', { kind: kind || t('dovetail.rule') })} style={{ padding: '15px 0' }} />;
  }

  return <MonacoYamlEditor
    schema={{}}
    defaultValue={yaml.dump(ingressOrEgress)}
    height="300px"
    className={EditorStyle}
    readOnly
  />;
};
