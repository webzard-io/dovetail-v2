import React from 'react';

type Props = {
  value?: Record<string, string>;
};

export const TextTags: React.FC<Props> = props => {
  const { value } = props;

  if (!value) {
    return <span>-</span>;
  }
  const tags = Object.keys(value).map(key => {
    return (
      <li key={key}>
        {key}={value[key]}
      </li>
    );
  });

  return <ul>{tags}</ul>;
};
