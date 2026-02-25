"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const MapInner = dynamic(() => import("@/components/map/MapInner"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full min-h-[400px]" />,
});

export default function MapComponent() {
  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-slate-200 shadow-sm relative">
      <MapInner />
    </div>
  );
}
