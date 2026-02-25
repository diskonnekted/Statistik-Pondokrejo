"use client";

import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface ChartInnerProps {
  type: "line" | "area" | "bar" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap" | "candlestick" | "boxPlot" | "radar" | "polarArea" | "rangeBar" | "rangeArea" | "treemap";
  series: NonNullable<ApexOptions['series']>;
  options: ApexOptions;
  height?: number | string;
}

export default function ChartInner({ type, series, options, height = 350 }: ChartInnerProps) {
  return (
    <ReactApexChart
      options={options}
      series={series}
      type={type}
      height={height}
      width="100%"
    />
  );
}
