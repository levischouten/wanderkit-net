"use client";

import {
  StateMachineProvider,
  createStore,
  useStateMachine,
} from "little-state-machine";
import React from "react";
import { destination } from "./destination/components/Form";

type LayoutProps = {
  children: React.ReactNode;
};

createStore({
  destination,
});

export default function Layout({ children }: LayoutProps) {
  return <StateMachineProvider>{children}</StateMachineProvider>;
}
