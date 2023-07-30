import { AriaButtonProps, useButton } from "react-aria";
import { useRef } from "react";

type ButtonProps = {
  className?: string;
} & AriaButtonProps;

export default function Button(props: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);
  const { children } = props;

  return (
    <button {...props} {...buttonProps} ref={ref}>
      {children}
    </button>
  );
}
