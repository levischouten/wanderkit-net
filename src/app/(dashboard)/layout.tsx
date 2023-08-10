"use client";

import { StateMachineProvider, createStore } from "little-state-machine";
import Header from "./components/Header";

type LayoutProps = {
  children: React.ReactNode;
};

createStore({
  destination: {
    description: "",
    destination: "",
  },
  duration: {
    arrival: "morning",
    endDate: "",
    startDate: "",
  },
});

export default function Layout({ children }: LayoutProps) {
  return (
    <StateMachineProvider>
      <div className="h-screen flex flex-col">
        <Header />
        <main className="bg-gray-100 flex-1">{children}</main>
      </div>
    </StateMachineProvider>
  );
}
