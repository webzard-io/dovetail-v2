// TODO: use ui-kit
import { Tooltip } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

dayjs.extend(relativeTime, {
  thresholds: [
    { l: 's', r: 1 },
    { l: 'm', r: 1 },
    { l: 'mm', r: 59, d: 'minute' },
    { l: 'h', r: 1 },
    { l: 'hh', r: 23, d: 'hour' },
    { l: 'd', r: 1 },
    { l: 'dd', r: Infinity, d: 'day' },
  ],
});
const TimeStyle = css`
  display: inline-block;
  line-height: 18px;
  height: 18px;
  border-bottom: 1px dashed rgba(107, 128, 167, 0.6);
`;

const Time: React.FunctionComponent<{
  className?: string;
  date?: string | number | Date | null;
  dateTemplate?: string;
  timeTemplate?: string;
}> = props => {
  const { className, date, dateTemplate = 'YYYY-MM-DD', timeTemplate = 'HH:mm' } = props;
  const { i18n } = useTranslation();
  const [text, setText] = useState(dayjs(date).fromNow());

  useEffect(() => {
    const onChange = () => {
      setText(dayjs(date).fromNow());
    };

    i18n.on('languageChanged', onChange);

    return () => i18n.off('languageChanged', onChange);
  }, [date, i18n]);

  if (!date) return <>-</>;

  const time = dayjs(date);

  return (
    <Tooltip title={`${time.format(dateTemplate)} ${time.format(timeTemplate)}`}>
      <span className={cx(className, TimeStyle)}>{text}</span>
    </Tooltip>
  );
};

export { Time };
