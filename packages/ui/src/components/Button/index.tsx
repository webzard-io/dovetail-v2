import React, { PropsWithChildren } from 'react';
import { useUIKit, ButtonProps as BaseButtonProps } from '@cloudtower/eagle';

type ButtonProps = PropsWithChildren<{
  /** the size of button */
  size: BaseButtonProps['size'];
}>;

function Button (props: ButtonProps) {
  const kit = useUIKit();

  return <kit.button {...props}>{props.children}</kit.button>
}

export default Button;
