import { Button, type ButtonProps } from "antd";
import type { FC } from "react";

interface EDAButtonProps {
  title: string;
  color: ButtonProps["color"];
  variant: ButtonProps["variant"];
  handleClick: ButtonProps["onClick"];
  size: ButtonProps["size"];
  className: string;
}

export const EDAButton: FC<EDAButtonProps> = ({
  title,
  color,
  variant,
  handleClick,
  size,
  className,
  ...rest
}) => {
  return (
    <Button
      onClick={handleClick}
      color={color}
      variant={variant}
      size={size}
      className={className}
      {...rest}
    >
      {title}
    </Button>
  );
};
