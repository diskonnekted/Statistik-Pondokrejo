"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const MapInner = dynamic(() => import("@/components/map/MapInner"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full" />,
});

export default function MapWrapper({ showControls = false }: { showControls?: boolean }) {
  return <MapInner showControls={showControls} />;
}
