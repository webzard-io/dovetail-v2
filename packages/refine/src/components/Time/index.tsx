// TODO: use ui-kit
import { Tooltip } from '@cloudtower/eagle';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

dayjs.extend(relativeTime);

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
      <span className={className}>{text}</span>
    </Tooltip>
  );
};

export default Time;
