export function getSecondsDiff(startDate: string, endDate: string) {
  return Math.round(Math.abs(Date.parse(endDate) - Date.parse(startDate)) / 1000);
}

export function elapsedTime(
  seconds: number,
  i18nMap: {
    min: string;
    sec: string;
    hr: string;
    day: string;
  }
) {
  const { min, sec, hr, day } = i18nMap;
  if (!seconds) {
    return {};
  }

  if (seconds < 120) {
    return {
      diff: 1,
      label: `${seconds} ${sec}`,
    };
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 10) {
    return {
      diff: 1,
      label: `${minutes} ${min} ${seconds - minutes * 60} ${sec}`,
    };
  }

  const hours = Math.floor(seconds / 3600);

  if (hours < 3) {
    return {
      diff: 60,
      label: `${minutes} ${min}`,
    };
  }

  const days = Math.floor(seconds / (3600 * 24));

  if (days > 1) {
    return {
      diff: 60,
      label: `${days} ${day} ${hours - days * 24} ${hr}`,
    };
  }

  if (hours > 7) {
    return {
      diff: 60,
      label: `${hours} ${hr}`,
    };
  }

  return {
    diff: 60,
    label: `${hours} ${hr} ${minutes - hours * 60} ${min}`,
  };
}
