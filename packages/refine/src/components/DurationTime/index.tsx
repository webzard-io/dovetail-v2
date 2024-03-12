import React from 'react';
import { useTranslation } from 'react-i18next';
import ValueDisplay from 'src/components/ValueDisplay';
import { elapsedTime } from 'src/utils/time';

interface DurationTimeProps {
  value: number;
}

function DurationTime(props: DurationTimeProps) {
  const { value } = props;
  const { i18n } = useTranslation();
  const i18nMap = {
    sec: i18n.t('dovetail.sec'),
    day: i18n.t('dovetail.day'),
    min: i18n.t('dovetail.min'),
    hr: i18n.t('dovetail.hr'),
  };

  return <span>{elapsedTime(value, i18nMap).label || <ValueDisplay value="" />}</span>;
}

export { DurationTime };
