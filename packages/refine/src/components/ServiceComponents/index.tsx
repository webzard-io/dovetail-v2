import { Link, OverflowTooltip } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import React from 'react';
import ValueDisplay from 'src/components/ValueDisplay';
import { ServiceModel, ServiceTypeEnum } from '../../models';

type Props = {
  service: ServiceModel;
};

export const ServiceInClusterAccessComponent: React.FC<Props> = ({ service }) => {
  const spec = service._rawYaml.spec;
  switch (spec.type) {
    case ServiceTypeEnum.ExternalName:
      return <div>{spec.externalName}</div>;
    default:
      return <ValueDisplay value={spec.clusterIP} />;
  }
};

const BreakLineStyle = css`
  &.ant-btn.ant-btn-link {
    display: block;
  }
`;

export const ServiceOutClusterAccessComponent: React.FC<
  Props & { clusterVip: string; breakLine?: boolean; }
> = ({ service, clusterVip, breakLine = true }) => {
  const spec = service._rawYaml.spec;
  let content: React.ReactNode | React.ReactNode[] | undefined = '-';

  switch (spec.type) {
    case ServiceTypeEnum.NodePort:
      content = spec.ports
        ?.filter(v => !!v)
        .map((p, index) => (
          <Link
            target="_blank"
            href={`http://${clusterVip}:${p.nodePort}`}
            className={breakLine ? BreakLineStyle : ''}
            key={p.nodePort}
          >
            <OverflowTooltip
              content={(
                <>
                  {clusterVip}:{p.nodePort}
                  {!breakLine && index !== ((spec.ports || []).length - 1) ? ', ' : ''}
                </>
              )}
              tooltip={`${clusterVip}:${p.nodePort}`}
            >
            </OverflowTooltip>
          </Link >
        ));
      return <ul>{content}</ul>;
    case ServiceTypeEnum.LoadBalancer:
      content = spec.externalIPs?.join(breakLine ? '\n' : ', ');
      break;
    default:
      content = <ValueDisplay value=""></ValueDisplay>;
      break;
  }

  return (
    <div style={{ whiteSpace: 'pre-wrap' }}>
      {content || '-'}
    </div>
  );
};
