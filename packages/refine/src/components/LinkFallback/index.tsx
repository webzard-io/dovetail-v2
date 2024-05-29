import { Link } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import React from 'react';


const LinkStyle = css`
  padding: 0 !important;
`;

export function LinkFallback({ fullPath }: { fullPath: string }) {
  if (fullPath.includes('http') && !fullPath.includes('*')) {
    return (
      <Link className={LinkStyle} href={fullPath} target="_blank">
        {fullPath}
      </Link>
    );
  }

  return <span>{fullPath}</span>;
}
