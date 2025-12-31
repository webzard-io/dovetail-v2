import { OverflowTooltip, Typo, Link } from '@cloudtower/eagle';
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
  &.ant-btn-link.ant-btn {
    padding: 0;
    height: 22px;
  }
`;

export const ServiceOutClusterAccessComponent: React.FC<
  Props & {
    breakLine?: boolean;
    clusterVip: string;
  }
> = ({ service, breakLine = true, clusterVip }) => {
  const { i18n } = useTranslation();
  const spec = service._rawYaml.spec;
  const status = service._rawYaml.status;
  let content: React.ReactNode | React.ReactNode[] | undefined = '-';

  switch (spec.type) {
    case ServiceTypeEnum.NodePort:
      if (!breakLine) {
        content = spec.ports
          ?.filter(v => !!v)
          .map(p => ([
            <Link
              href={`http://${clusterVip}:${p.nodePort}`}
              target="_blank"
              key={p.name}
              className={cx(LinkStyle, Typo.Label.l4_regular_title)}
            >
              {`${clusterVip}:${p.nodePort}`}
            </Link>
          ]));

        if (content && content instanceof Array) {
          const result = [];

          for (let i = 0; i < content.length; i++) {
            result.push(content[i]);
            if (i < content.length - 1) {
              result.push(',');
            }
          }

          content = result;
        }
        break;
      }

      content = spec.ports
        ?.filter(v => !!v)
        .map(p => (
          <OverflowTooltip
            key={p.nodePort}
            content={
              <Link
                href={`http://${clusterVip}:${p.nodePort}`}
                target="_blank"
                className={cx(Typo.Label.l4_regular_title, BreakLineStyle, LinkStyle)}
              >
                {clusterVip}:{p.nodePort}
              </Link>
            }
            tooltip={`${i18n.t('dovetail.any_node_ip')}:${p.nodePort}`}
          />
        ));
      return <ul>{content}</ul>;
    case ServiceTypeEnum.ExternalName:
      content = (
        <ValueDisplay
          useOverflow={false}
          value={spec.externalIPs?.join(breakLine ? '\n' : ', ')}
        />
      );
      break;
    case ServiceTypeEnum.LoadBalancer:
      content = (
        <ValueDisplay
          useOverflow={false}
          value={status.loadBalancer?.ingress
            ?.map(({ ip }) => ip)
            .join(breakLine ? '\n' : ', ')}
        />
      );
      break;
    case ServiceTypeEnum.ClusterIP:
      content = i18n.t('dovetail.not_support');
      break;
    default:
      content = <ValueDisplay useOverflow={false} value="" />;
      break;
  }

  return <div style={{ whiteSpace: 'pre-wrap', color: '#0080ff' }}>{content || '-'}</div>;
};
