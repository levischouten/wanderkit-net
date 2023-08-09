"use client";

import { useProgressBar } from "react-aria";

type ProgressBarProps = {
  label?: string;
  showValueLabel?: boolean;
  value: number;
  minValue?: number;
  maxValue?: number;
};

export default function ProgressBar(props: ProgressBarProps) {
  const {
    label,
    showValueLabel = !!label,
    value,
    minValue = 0,
    maxValue = 100,
  } = props;

  const { progressBarProps, labelProps } = useProgressBar(props);

  const percentage = (value - minValue) / (maxValue - minValue);
  const barWidth = `${Math.round(percentage * 100)}%`;

  return (
    <div {...progressBarProps} className="w-full rounded-md">
      <div className="flex justify-between rounded-md">
        {label && <span {...labelProps}>{label}</span>}
        {showValueLabel && <span>{progressBarProps["aria-valuetext"]}</span>}
      </div>
      <div className="h-5 bg-gray-200 rounded-md">
        <div
          className="h-5 bg-indigo-500 rounded-md transition-all"
          style={{ width: barWidth }}
        />
      </div>
    </div>
  );
}
