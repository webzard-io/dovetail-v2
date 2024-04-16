import { Link, OverflowTooltip, Typo } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ValueDisplay from 'src/components/ValueDisplay';
import { ServiceModel, ServiceTypeEnum } from '../../models';

type Props = {
  service: ServiceModel;
};

export const ServiceInClusterAccessComponent: React.FC<Props> = ({ service }) => {
  const spec = service._rawYaml.spec;

  switch (service.displayType) {
    case ServiceTypeEnum.ExternalName:
      return <ValueDisplay value={service.dnsRecord} />;
    case ServiceTypeEnum.Headless:
      return <ValueDisplay value="" />;
    default:
      return <ValueDisplay value={spec.clusterIP} />;
  }
};

const BreakLineStyle = css`
  &.ant-btn.ant-btn-link {
    display: block;
  }
`;
const LinkStyle = css`
  &.ant-btn.ant-btn-link {
    line-height: 18px;
    height: 18px;
  }
`;

export const ServiceOutClusterAccessComponent: React.FC<
  Props & { clusterVip: string; breakLine?: boolean; }
> = ({ service, clusterVip, breakLine = true }) => {
  const { i18n } = useTranslation();
  const spec = service._rawYaml.spec;
  const status = service._rawYaml.status;
  let content: React.ReactNode | React.ReactNode[] | undefined = '-';

  switch (spec.type) {
    case ServiceTypeEnum.NodePort:
      content = spec.ports
        ?.filter(v => !!v)
        .map((p, index) => (
          <Link
            target="_blank"
            href={`http://${clusterVip}:${p.nodePort}`}
            className={cx(breakLine ? BreakLineStyle : '', LinkStyle)}
            key={p.nodePort}
          >
            <OverflowTooltip
              content={(
                <span className={Typo.Label.l4_regular_title}>
                  {clusterVip}:{p.nodePort}
                  {!breakLine && index !== ((spec.ports || []).length - 1) ? ', ' : ''}
                </span>
              )}
              tooltip={`${clusterVip}:${p.nodePort}`}
            >
            </OverflowTooltip>
          </Link >
        ));
      return <ul>{content}</ul>;
    case ServiceTypeEnum.ExternalName:
      content = <ValueDisplay value={spec.externalIPs?.join(breakLine ? '\n' : ', ')}></ValueDisplay>;
      break;
    case ServiceTypeEnum.LoadBalancer:
      content = <ValueDisplay value={status.loadBalancer?.ingress?.map(({ ip }) => ip).join(breakLine ? '\n' : ', ')}></ValueDisplay>;
      break;
    case ServiceTypeEnum.ClusterIP:
      content = i18n.t('dovetail.not_support');
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
