import { Link, Tooltip, Typo } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CopyButton } from 'src/components/CopyButton';
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
const AccessAddressStyle = css`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  vertical-align: top;
`;
type ServiceAccessAddressProps = {
  /** 访问地址展示内容。 */
  children: React.ReactNode;
  /** 点击复制按钮时写入剪贴板的访问地址。 */
  copyValue: string;
};

const ServiceAccessAddress: React.FC<ServiceAccessAddressProps> = ({
  children,
  copyValue,
}) => {
  return (
    <span className={AccessAddressStyle}>
      {children}
      <CopyButton value={copyValue} />
    </span>
  );
};

/**
 * 渲染 Service 详情页中带复制按钮的外部访问地址列表。
 *
 * @param items 每个可访问地址对应的 React 节点。
 * @param separator 地址之间的分隔符。
 */
function renderAccessItems(items: React.ReactNode[], separator: React.ReactNode) {
  if (!items.length) {
    return undefined;
  }

  const result: React.ReactNode[] = [];

  for (let i = 0; i < items.length; i++) {
    result.push(<React.Fragment key={`item-${i}`}>{items[i]}</React.Fragment>);
    if (i < items.length - 1) {
      result.push(<React.Fragment key={`separator-${i}`}>{separator}</React.Fragment>);
    }
  }

  return result;
}

/**
 * 渲染 Service 集群外访问方式，详情页可通过 showCopyButton 为每个地址添加复制按钮。
 *
 * @param service 当前 Service 资源模型。
 * @param breakLine 是否按换行展示多个访问地址。
 * @param clusterVip NodePort 类型拼接访问地址时使用的集群 VIP。
 * @param showDashedUnderline 是否展示协议提示的虚线下划线。
 * @param showCopyButton 是否在每个访问地址后展示复制按钮。
 */
export const ServiceOutClusterAccessComponent: React.FC<
  Props & {
    breakLine?: boolean;
    clusterVip: string;
    showDashedUnderline?: boolean;
    showCopyButton?: boolean;
  }
> = ({
  service,
  breakLine = true,
  clusterVip,
  showDashedUnderline = true,
  showCopyButton = false,
}) => {
  const { i18n } = useTranslation();
  const spec = service._rawYaml.spec;
  const status = service._rawYaml.status;
  let content: React.ReactNode | React.ReactNode[] | undefined = '-';

  switch (spec.type) {
    case ServiceTypeEnum.NodePort:
      if (!breakLine) {
        content = spec.ports
          ?.filter(v => !!v && v.nodePort)
          .map(p => {
            const address = `${clusterVip}:${p.nodePort}`;
            const link = (
              <Link
                key={p.name || p.nodePort}
                href={`http://${address}`}
                target="_blank"
                className={cx(ShowLinkStyle, Typo.Label.l4_regular_title)}
              >
                <Tooltip title={i18n.t('dovetail.default_http_protocol_tooltip')}>
                  <span
                    className={DashedUnderlineSpanStyle}
                    style={showDashedUnderline ? undefined : { borderBottom: 'none' }}
                  >
                    {address}
                  </span>
                </Tooltip>
              </Link>
            );

            if (!showCopyButton) {
              return link;
            }

            return (
              <ServiceAccessAddress key={p.name || p.nodePort} copyValue={address}>
                {link}
              </ServiceAccessAddress>
            );
          });

        if (content && content instanceof Array) {
          content = renderAccessItems(content, ', ');
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
              <span className={DashedUnderlineSpanStyle}
                  style={showDashedUnderline ? undefined : { borderBottom: 'none' }}>
                {clusterVip}:{p.nodePort}
              </span>
            </Tooltip>
          </Link>
        ));
      return <ul>{content}</ul>;
    case ServiceTypeEnum.ExternalName:
      if (showCopyButton) {
        content = renderAccessItems(
          spec.externalIPs?.map(ip => (
            <ServiceAccessAddress key={ip} copyValue={ip}>
              {ip}
            </ServiceAccessAddress>
          )) || [],
          breakLine ? '\n' : ', '
        );
        break;
      }

      content = (
        <ValueDisplay
          useOverflow={false}
          value={spec.externalIPs?.join(breakLine ? '\n' : ', ')}
        />
      );
      break;
    case ServiceTypeEnum.LoadBalancer:
      if (showCopyButton) {
        content = renderAccessItems(
          status.loadBalancer?.ingress
            ?.map(({ ip }) => ip)
            .filter((ip): ip is string => !!ip)
            .map(ip => (
              <ServiceAccessAddress key={ip} copyValue={ip}>
                {ip}
              </ServiceAccessAddress>
            )) || [],
          breakLine ? '\n' : ', '
        );
        break;
      }

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
