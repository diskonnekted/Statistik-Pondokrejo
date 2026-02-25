
import MapWrapper from "@/components/map/MapWrapper";

export default function PetaWilayahPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Peta Wilayah</h1>
        <p className="text-muted-foreground">
          Peta interaktif wilayah Kalurahan Pondokrejo dengan lapisan data statistik.
        </p>
      </div>
      
      <div className="h-[600px] w-full border rounded-lg overflow-hidden shadow-sm relative">
        <MapWrapper showControls={true} />
      </div>
    </div>
  );
}
