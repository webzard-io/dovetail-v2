import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  value: string;
}

export function PVPhaseDisplay(props: Props) {
  const {value} = props;
  const i18n = useTranslation();

  const map = {
    Available: i18n.t('dovetail.pv_phase_available'),
    Bound: i18n.t('dovetail.pv_phase_bound'),
    Failed: i18n.t('dovetail.pv_phase_released'),
    Pending: i18n.t('dovetail.pv_phase_failed'),
    Released: i18n.t('dovetail.pv_phase_pending'),
  };

  return <div>{map[value as keyof typeof map] || value}</div>;
}

export function PVVolumeModeDisplay(props: Props) {
  const {value} = props;
  const i18n = useTranslation();
 
  const map = {
    Block: i18n.t('dovetail.block'),
    Filesystem: i18n.t('dovetail.file_system'), 
  };

  return <div>{map[value as keyof typeof map] || value}</div>;
}
 
