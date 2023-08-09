"use client";

import { useSelectState } from "react-stately";
import { AriaSelectProps, HiddenSelect, useSelect } from "react-aria";
import Button from "./Button";
import Popover from "./Popover";
import ListBox from "./ListBox";
import React from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function Select(props: AriaSelectProps<object>) {
  let state = useSelectState(props);

  let ref = React.useRef(null);
  let { labelProps, triggerProps, valueProps, menuProps } = useSelect(
    props,
    state,
    ref
  );

  return (
    <div className="flex flex-col gap-2">
      <div {...labelProps}>{props.label}</div>
      <HiddenSelect
        isDisabled={props.isDisabled}
        state={state}
        triggerRef={ref}
        label={props.label}
        name={props.name}
      />
      <Button
        {...triggerProps}
        ref={ref}
        className="flex justify-between gap-2 py-2 px-4 border rounded border-gray-300 min-w-[150px]"
      >
        <span {...valueProps}>
          {state.selectedItem
            ? state.selectedItem.rendered
            : "Select an option"}
        </span>
        <span aria-hidden="true">
          <ChevronDownIcon className="w-6 h-6" />
        </span>
      </Button>
      {state.isOpen && (
        <Popover state={state} triggerRef={ref} placement="bottom start">
          <ListBox {...menuProps} state={state} />
        </Popover>
      )}
    </div>
  );
}
