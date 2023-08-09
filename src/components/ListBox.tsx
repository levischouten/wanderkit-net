import React from "react";
import { AriaListBoxOptions, useListBox, useOption } from "react-aria";
import { ListState, Node } from "react-stately";
import cn from "classnames";

type OptionProps = {
  item: Node<unknown>;
  state: ListState<unknown>;
};

function Option({ item, state }: OptionProps) {
  const ref = React.useRef(null);
  const { optionProps, isSelected, isFocused } = useOption(
    { key: item.key },
    state,
    ref
  );

  return (
    <li
      {...optionProps}
      ref={ref}
      className={cn(
        "px-4 py-2 outline-none cursor-pointer flex justify-between gap-2",
        { "bg-gray-200": isFocused, "bg-white": !isFocused }
      )}
    >
      {item.rendered}
    </li>
  );
}

type ListBoxProps = {
  state: ListState<unknown>;
} & AriaListBoxOptions<object>;

export default function ListBox(props: ListBoxProps) {
  const ref = React.useRef(null);
  const { state } = props;
  const { listBoxProps } = useListBox(props, state, ref);

  return (
    <ul
      {...listBoxProps}
      ref={ref}
      className="m-0 p-0 list-none overflow-auto max-h-[200px] min-w-[150px] bg-gray-300"
    >
      {[...state.collection].map((item) => (
        <Option key={item.key} item={item} state={state} />
      ))}
    </ul>
  );
}
