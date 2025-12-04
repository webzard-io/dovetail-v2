import { Loading } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import yaml from 'js-yaml';
import type {
  NetworkPolicyIngressRule,
  NetworkPolicyEgressRule,
} from 'kubernetes-types/networking/v1';
import React, { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent, { ErrorContentType } from 'src/components/ErrorContent';

const MonacoYamlEditor = lazy(() => import('src/components/YamlEditor/MonacoYamlEditor'));

const EditorStyle = css`
  border-radius: 8px;
  border: 1px solid rgba(211, 218, 235, 0.6);

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
    return (
      <ErrorContent
        errorText={t('dovetail.no_resource', { kind: kind || t('dovetail.rule') })}
        type={ErrorContentType.List}
      />
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <MonacoYamlEditor
        schemas={[]}
        defaultValue={yaml.dump(ingressOrEgress)}
        height="100%"
        className={EditorStyle}
        readOnly
        isScrollOnFocus
      />
    </Suspense>
  );
};
