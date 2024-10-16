import React from 'react';
import { useTranslation } from 'react-i18next';

interface PVVolumeModeDisplayProps {
  value: string;
}

export function PVVolumeModeDisplay(props: PVVolumeModeDisplayProps) {
  const { value } = props;
  const i18n = useTranslation();

  const map = {
    Block: i18n.t('dovetail.block'),
    Filesystem: i18n.t('dovetail.file_system'),
  };

  return <div>{map[value as keyof typeof map] || value}</div>;
}

