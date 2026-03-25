import { Tooltip, Typo, Link } from '@cloudtower/eagle';
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
    height: 18px;
  }
`;
const ShowLinkStyle = css`
  &.ant-btn-link.ant-btn {
    padding: 0;
    height: 18px;
    color: var(--blue-60) !important;
    &:hover {
      color: var(--blue-50) !important;
    }
  }
`;
const DashedUnderlineSpanStyle = css`
  display: inline-block;
  width: auto !important;
  height: 18px;
  line-height: 18px;
  border-bottom: 1px dashed rgba(107, 128, 167, 0.6);
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
          .map(p => [
            <Link
              key={p.name}
              href={`http://${clusterVip}:${p.nodePort}`}
              target="_blank"
              className={cx(ShowLinkStyle, Typo.Label.l4_regular_title)}
            >
              <Tooltip title={i18n.t('dovetail.default_http_protocol_tooltip')}>
                <span
                  className={DashedUnderlineSpanStyle}
                >{`${clusterVip}:${p.nodePort}`}</span>
              </Tooltip>
            </Link>,
          ]);

        if (content && content instanceof Array) {
          const result = [];

          for (let i = 0; i < content.length; i++) {
            result.push(content[i]);
            if (i < content.length - 1) {
              result.push(', ');
            }
          }

          content = result;
        }
        break;
      }

      content = spec.ports
        ?.filter(v => !!v)
        .map(p => (
          <Link
            key={p.nodePort}
            href={`http://${clusterVip}:${p.nodePort}`}
            target="_blank"
            className={cx(Typo.Label.l4_regular_title, BreakLineStyle, LinkStyle)}
          >
            <Tooltip title={i18n.t('dovetail.default_http_protocol_tooltip')}>
              <span className={DashedUnderlineSpanStyle}>
                {clusterVip}:{p.nodePort}
              </span>
            </Tooltip>
          </Link>
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
      content = (
        <span style={{ color: '#00122e' }}>{i18n.t('dovetail.not_support')}</span>
      );
      break;
    default:
      content = <ValueDisplay useOverflow={false} value="" />;
      break;
  }

  return <div style={{ whiteSpace: 'pre-wrap' }}>{content || '-'}</div>;
};
