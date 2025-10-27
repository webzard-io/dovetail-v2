import { Select, Tooltip, getOptions, Icon, KitSelectProps } from '@cloudtower/eagle';
import {
  InfoICircleFill16Gray70Icon,
  InfoICircleFill16GrayIcon,
} from '@cloudtower/icons-react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TaintEffectTooltip } from './EditNodeTaintForm';

export enum NodeTaintEffect {
  'NoSchedule' = 'NoSchedule',
  'PreferNoSchedule' = 'PreferNoSchedule',
  'NoExecute' = 'NoExecute',
  'All' = '__none__',
}

interface NodeTaintEffectSelectProps {
  value: string;
  isShowAll?: boolean;
  selectProps?: KitSelectProps;
  onChange: (value: string) => void;
}

export const NodeTaintEffectSelect: React.FC<NodeTaintEffectSelectProps> = ({
  value,
  selectProps,
  isShowAll,
  onChange,
}) => {
  const { t } = useTranslation();

  const options = useMemo(() => {
    const options: {
      value: NodeTaintEffect;
      children: string;
      suffix?: React.ReactNode;
    }[] = [
      {
        value: NodeTaintEffect.NoSchedule,
        children: t(`dovetail.node_taint_${NodeTaintEffect.NoSchedule}`),
        suffix: (
          <Tooltip title={<TaintEffectTooltip effect={NodeTaintEffect.NoSchedule} />}>
            <Icon
              src={InfoICircleFill16GrayIcon}
              hoverSrc={InfoICircleFill16Gray70Icon}
            />
          </Tooltip>
        ),
      },
      {
        value: NodeTaintEffect.PreferNoSchedule,
        children: t(`dovetail.node_taint_${NodeTaintEffect.PreferNoSchedule}`),
        suffix: (
          <Tooltip
            title={<TaintEffectTooltip effect={NodeTaintEffect.PreferNoSchedule} />}
          >
            <Icon
              src={InfoICircleFill16GrayIcon}
              hoverSrc={InfoICircleFill16Gray70Icon}
            />
          </Tooltip>
        ),
      },
      {
        value: NodeTaintEffect.NoExecute,
        children: t(`dovetail.node_taint_${NodeTaintEffect.NoExecute}`),
        suffix: (
          <Tooltip title={<TaintEffectTooltip effect={NodeTaintEffect.NoExecute} />}>
            <Icon
              src={InfoICircleFill16GrayIcon}
              hoverSrc={InfoICircleFill16Gray70Icon}
            />
          </Tooltip>
        ),
      },
    ];

    if (isShowAll) {
      options.unshift({
        value: NodeTaintEffect.All,
        children: t('dovetail.all'),
      });
    }

    return options;
  }, [t, isShowAll]);

  return (
    <Select input={{}} value={value} onChange={onChange} size="small" {...selectProps}>
      {getOptions(options)}
    </Select>
  );
};
