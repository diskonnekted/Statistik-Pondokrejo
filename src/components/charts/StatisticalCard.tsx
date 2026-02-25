"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { ApexOptions } from "apexcharts";

const ChartInner = dynamic(() => import("./ChartInner"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[350px] rounded-lg" />,
});

interface StatisticalCardProps {
  title: string;
  description?: string;
  type: "line" | "area" | "bar" | "pie" | "donut";
  series: NonNullable<ApexOptions['series']>;
  options?: ApexOptions;
  height?: number | string;
  className?: string;
  formatDataLabel?: "percentage" | "number";
}

export function StatisticalCard({
  title,
  description,
  type,
  series,
  options = {},
  height = 350,
  className,
  formatDataLabel,
}: StatisticalCardProps) {
  const defaultOptions: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
      fontFamily: "Inter, sans-serif",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      labels: {
        style: {
          colors: "#64748b",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#64748b",
        },
      },
    },
    grid: {
      borderColor: "#e2e8f0",
    },
    legend: {
      position: "bottom",
      labels: {
        colors: "#64748b",
      },
    },
    ...options,
  };

  if (formatDataLabel === 'percentage') {
    defaultOptions.dataLabels = {
      ...defaultOptions.dataLabels,
      enabled: true,
      formatter: function (val: number) {
        return typeof val === 'number' ? val.toFixed(1) + "%" : val;
      }
    };
    
    defaultOptions.tooltip = {
      ...defaultOptions.tooltip,
      y: {
        formatter: function (val: number) {
             return typeof val === 'number' ? val.toFixed(1) + "%" : val;
        }
      }
    };
  }

  return (
    <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
      <ChartInner type={type} series={series} options={defaultOptions} height={height} />
    </div>
  );
}
