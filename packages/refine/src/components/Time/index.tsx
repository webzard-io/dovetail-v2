// TODO: use ui-kit
import dayjs from 'dayjs';
import React from 'react';

const Time: React.FunctionComponent<{
  className?: string;
  date?: string | number | Date | null;
  dateTemplate?: string | null;
  timeTemplate?: string | null;
  plainText?: boolean;
}> = props => {
  const {
    className,
    date,
    dateTemplate = 'YYYY-MM-DD',
    timeTemplate = 'HH:mm',
    plainText,
  } = props;
  if (!date) return <>-</>;
  const time = dayjs(date);
  if (plainText) {
    return (
      <>
        {dateTemplate !== null && time.format(dateTemplate)}{' '}
        {timeTemplate !== null && time.format(timeTemplate)}
      </>
    );
  }
  return (
    <span className={`time-wrapper ${className || ''}`}>
      {dateTemplate !== null && (
        <span className="date"> {time.format(dateTemplate)}</span>
      )}
      {timeTemplate !== null && (
        <span className="time"> {time.format(timeTemplate)}</span>
      )}
    </span>
  );
};

export default Time;
