import { css, cx } from '@linaria/core';
import { useBreadcrumb } from '@refinedev/core';
import React from 'react';
import { Link } from 'react-router-dom';

const BreadcrumbStyle = css`
  display: flex;

  .breadcrumb-item {
    &:not(:last-of-type):after {
      content: ">";
      margin: 0 8px;
    }
  }
`;

interface BreadcrumbProps {
  className?: string;
}

export function Breadcrumb(props: BreadcrumbProps) {
  const { breadcrumbs } = useBreadcrumb();

  return (
    <ul className={cx(BreadcrumbStyle, props.className)}>
      {breadcrumbs.map((breadcrumb) => {
        return (
          <li className='breadcrumb-item' key={`breadcrumb-${breadcrumb.label}`}>
            {breadcrumb.href ? (
              <Link to={breadcrumb.href}>{breadcrumb.label}</Link>
            ) : (
              <span>{breadcrumb.label}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
