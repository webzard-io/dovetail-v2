import { useUIKit } from '@cloudtower/eagle';
import type { IngressRule } from 'kubernetes-types/networking/v1';
import React from 'react';
import { ResourceLink } from '../ResourceLink';

export const IngressRulesComponent: React.FC<{
  rules: IngressRule[];
  namespace: string;
}> = ({ rules, namespace }) => {
  const result = rules.map(r => {
    return <IngressRuleComponent key={r.host} rule={r} namespace={namespace} />;
  });
  return <>{result}</>;
};

const IngressRuleComponent: React.FC<{ rule: IngressRule; namespace: string }> = ({
  rule,
  namespace,
}) => {
  const domain = rule.host ? `http://${rule.host}` : '';
  const kit = useUIKit();

  const result = rule.http?.paths.map(p => {
    const fullPath = `${domain}${p.path}`;
    const service = p.backend.service?.name;
    const divider = ' > ';

    return (
      <div key={p.path}>
        <kit.Link disabled={!rule.host} href={fullPath}>
          {fullPath}
        </kit.Link>
        <span>{divider}</span>
        <ResourceLink name="services" namespace={namespace} resourceId={service || ''} />
      </div>
    );
  });

  return <>{result}</>;
};
