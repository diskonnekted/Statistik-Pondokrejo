import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, GraduationCap, Stethoscope, Wifi, Store, Landmark } from "lucide-react";

export const metadata = {
  title: "Fasilitas Umum | Kalurahan Pondokrejo",
  description: "Data Fasilitas Umum di Kalurahan Pondokrejo",
};

export default function FacilitiesPage() {
  // Static data for now - can be replaced with API calls later
  const facilities = {
    pendidikan: [
      { name: "SD Negeri Pondokrejo 1", address: "Jl. Pondokrejo No. 1", type: "Sekolah Dasar" },
      { name: "SD Negeri Pondokrejo 2", address: "Dusun A, Pondokrejo", type: "Sekolah Dasar" },
      { name: "TK Pertiwi", address: "Komp. Balai Desa", type: "Taman Kanak-kanak" },
    ],
    kesehatan: [
      { name: "Puskesmas Pembantu Pondokrejo", address: "Sebelah Balai Desa", type: "Pustu" },
      { name: "Posyandu Mawar", address: "Dusun B", type: "Posyandu" },
    ],
    umum: [
      { name: "Balai Kalurahan Pondokrejo", address: "Jl. Utama No. 1", type: "Kantor Pemerintahan" },
      { name: "Pasar Desa", address: "Jl. Pasar", type: "Pasar Tradisional" },
      { name: "Lapangan Olahraga", address: "Belakang Balai Desa", type: "Fasilitas Olahraga" },
    ],
    ibadah: [
      { name: "Masjid Al-Amin", address: "Dusun A", type: "Masjid" },
      { name: "Mushola Al-Ikhlas", address: "Dusun B", type: "Mushola" },
    ]
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Fasilitas Umum</h1>
        <p className="text-muted-foreground">
          Daftar fasilitas umum yang tersedia di Kalurahan Pondokrejo.
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="pendidikan">Pendidikan</TabsTrigger>
          <TabsTrigger value="kesehatan">Kesehatan</TabsTrigger>
          <TabsTrigger value="umum">Umum & Lainnya</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(facilities).flatMap(([category, items]) => 
              items.map((item, idx) => (
                <FacilityCard key={`${category}-${idx}`} item={item} category={category} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="pendidikan" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {facilities.pendidikan.map((item, idx) => (
              <FacilityCard key={idx} item={item} category="pendidikan" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="kesehatan" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {facilities.kesehatan.map((item, idx) => (
              <FacilityCard key={idx} item={item} category="kesehatan" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="umum" className="space-y-4">
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...facilities.umum, ...facilities.ibadah].map((item, idx) => (
              <FacilityCard key={idx} item={item} category="umum" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FacilityCard({ item, category }: { item: any, category: string }) {
  const getIcon = (cat: string) => {
    switch(cat) {
      case 'pendidikan': return <GraduationCap className="h-5 w-5 text-blue-500" />;
      case 'kesehatan': return <Stethoscope className="h-5 w-5 text-red-500" />;
      case 'ibadah': return <Landmark className="h-5 w-5 text-green-500" />;
      default: return <Building2 className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <div className="p-2 bg-slate-100 rounded-full">
          {getIcon(category)}
        </div>
        <div className="flex flex-col">
          <CardTitle className="text-base font-semibold">{item.name}</CardTitle>
          <CardDescription className="text-xs">{item.type}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-500 mt-2">
          {item.address}
        </p>
      </CardContent>
    </Card>
  );
}
