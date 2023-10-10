import React from 'react';

export type ShowField = {
  key: string;
  title: string;
  path: string[];
  render?: (val: unknown, record: Record<string, any>) => React.ReactElement;
};
