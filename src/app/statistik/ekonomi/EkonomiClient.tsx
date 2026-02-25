"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Users, 
  TrendingUp, 
  Briefcase, 
  Sprout, 
  Wallet, 
  Landmark, 
  ShoppingBag, 
  Utensils,
  Wheat,
  Building2,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Dynamically import ApexCharts
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Data Constants from data_ekonomi.md
const UMKM_STATS = {
  total: 7489,
  levels: [
    { name: "Usaha Mikro Level 1", value: 6395 },
    { name: "Usaha Mikro Level 2", value: 883 },
    { name: "Usaha Mikro Level 3", value: 139 },
    { name: "Usaha Mikro Level 4", value: 27 },
    { name: "Usaha Mikro Level 5", value: 12 },
    { name: "Usaha Kecil", value: 32 },
    { name: "Usaha Menengah", value: 1 },
  ]
};

const WORKFORCE_STATS = {
  male: 25129,
  female: 24476,
  total: 49605,
  asset: "Rp 31,39 Triliun",
  omset: "Rp 325,51 Miliar"
};

const SECTOR_JOBS = [
  { name: "Buruh Harian Lepas", value: 718, percent: 11.36 },
  { name: "Karyawan Swasta", value: 650, percent: 10.28 },
  { name: "Buruh Tani", value: 563, percent: 8.90 },
  { name: "Wiraswasta", value: 275, percent: 4.35 },
  { name: "Pedagang", value: 109, percent: 1.72 },
  { name: "Petani/Pebun", value: 33, percent: 0.52 },
];

const INCOME_STRUCTURE = [
  { name: "Buruh Harian", value: 20.3 },
  { name: "Belum/Tidak Bekerja", value: 20.9 },
  { name: "Swasta/Karyawan", value: 10.3 },
  { name: "Pertanian/Peternakan", value: 9.4 },
  { name: "Wiraswasta/UMKM", value: 6.1 },
  { name: "Formal (PNS/TNI/BUMN)", value: 3.5 },
];

const POTENTIAL_SECTORS = [
  {
    title: "Pertanian Organik",
    icon: Sprout,
    desc: "Lahan subur, iklim mendukung",
    strategy: "Sertifikasi organik, pemasaran digital",
    color: "text-emerald-600 bg-emerald-50",
    borderColor: "border-emerald-200"
  },
  {
    title: "Peternakan Terintegrasi",
    icon: Wheat,
    desc: "Limbah pertanian untuk pakan",
    strategy: "Kemitraan dengan BUMKal, pasar lokal",
    color: "text-amber-600 bg-amber-50",
    borderColor: "border-amber-200"
  },
  {
    title: "Agroindustri Pangan",
    icon: Utensils,
    desc: "Madu, gula merah, olahan lokal",
    strategy: "SP-PIRT, branding 'Pondokrejo'",
    color: "text-orange-600 bg-orange-50",
    borderColor: "border-orange-200"
  },
  {
    title: "Wisata Edukasi",
    icon: Landmark,
    desc: "Lembah Krasak, budaya lokal",
    strategy: "Pokdarwis, paket wisata sekolah",
    color: "text-blue-600 bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    title: "UMKM Digital",
    icon: ShoppingBag,
    desc: "7.489 unit UMKM di Tempel",
    strategy: "Pelatihan e-commerce, marketplace desa",
    color: "text-indigo-600 bg-indigo-50",
    borderColor: "border-indigo-200"
  },
];

const BUMKAL_INFO = {
  name: 'BUMKal "Migunani"',
  founded: "16 Januari 2025",
  mission: "Memanfaatkan potensi perekonomian & sumber daya alam lokal",
  sectors: ["Perdagangan", "Jasa", "Pertanian", "Peternakan", "Wisata"]
};

export default function EkonomiClient() {
  // Chart Options
  
  // UMKM Pie Chart
  const umkmPieOptions: any = {
    chart: { type: 'pie', fontFamily: "inherit" },
    labels: UMKM_STATS.levels.map(l => l.name),
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'],
    legend: { position: 'bottom' },
    dataLabels: { enabled: false },
    tooltip: {
      y: { formatter: (val: number) => `${val} Unit` }
    }
  };
  const umkmPieSeries = UMKM_STATS.levels.map(l => l.value);

  // Workforce Donut Chart
  const workforceDonutOptions: any = {
    chart: { type: 'donut', fontFamily: "inherit" },
    labels: ['Pria', 'Wanita'],
    colors: ['#3b82f6', '#ec4899'],
    legend: { position: 'bottom' },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: () => WORKFORCE_STATS.total.toLocaleString('id-ID')
            }
          }
        }
      }
    }
  };
  const workforceSeries = [WORKFORCE_STATS.male, WORKFORCE_STATS.female];

  // Sector Bar Chart
  const sectorBarOptions: any = {
    chart: { type: 'bar', fontFamily: "inherit", toolbar: { show: false } },
    plotOptions: {
      bar: { borderRadius: 4, horizontal: true, distributed: true }
    },
    dataLabels: { 
      enabled: true,
      textAnchor: 'start',
      style: { colors: ['#fff'] },
      formatter: function (val: number, opt: any) {
        return val + " Jiwa"
      },
      offsetX: 0,
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
    xaxis: { categories: SECTOR_JOBS.map(s => s.name) },
    legend: { show: false }
  };
  const sectorBarSeries = [{ name: 'Jumlah Pekerja', data: SECTOR_JOBS.map(s => s.value) }];

  // Income Structure Radar/Bar Chart
  const incomeBarOptions: any = {
    chart: { type: 'bar', fontFamily: "inherit", toolbar: { show: false } },
    plotOptions: {
      bar: { borderRadius: 4, horizontal: false, columnWidth: '55%' }
    },
    dataLabels: { 
      enabled: true,
      formatter: (val: number) => `${val}%`
    },
    colors: ['#0ea5e9'],
    xaxis: { 
      categories: INCOME_STRUCTURE.map(s => s.name),
      labels: { rotate: -45, style: { fontSize: '10px' } }
    },
    yaxis: { title: { text: 'Persentase (%)' } }
  };
  const incomeBarSeries = [{ name: 'Persentase', data: INCOME_STRUCTURE.map(s => s.value) }];

  return (
    <div className="space-y-8 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Statistik Ekonomi</h1>
        <p className="text-slate-500">
          Gambaran umum potensi ekonomi, UMKM, dan kesejahteraan masyarakat Kalurahan Pondokrejo.
        </p>
      </div>

      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Informasi Data</AlertTitle>
        <AlertDescription>
          Sebagian data statistik UMKM mencakup wilayah Kapanewon Tempel secara keseluruhan, sedangkan data sektor pekerjaan dan potensi adalah spesifik Kalurahan Pondokrejo.
        </AlertDescription>
      </Alert>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total UMKM (Tempel)</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{UMKM_STATS.total.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">Unit usaha terdaftar</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tenaga Kerja UMKM</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{WORKFORCE_STATS.total.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">Orang terlibat di UMKM</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Omset UMKM</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{WORKFORCE_STATS.omset}</div>
            <p className="text-xs text-muted-foreground">Perputaran ekonomi</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BUMKal</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Migunani</div>
            <p className="text-xs text-muted-foreground">Berdiri 2025</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="overview">Ringkasan & UMKM</TabsTrigger>
          <TabsTrigger value="sectors">Sektor & Potensi</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* UMKM Distribution */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle>Distribusi Level UMKM</CardTitle>
                <CardDescription>Berdasarkan klasifikasi skala usaha di Kapanewon Tempel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <Chart options={umkmPieOptions} series={umkmPieSeries} type="pie" height="100%" />
                </div>
              </CardContent>
            </Card>

            {/* Workforce Distribution */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle>Tenaga Kerja UMKM</CardTitle>
                <CardDescription>Perbandingan tenaga kerja pria dan wanita</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <Chart options={workforceDonutOptions} series={workforceSeries} type="donut" height="100%" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* BUMKal Section */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-blue-900">BUMKal "Migunani"</CardTitle>
              </div>
              <CardDescription className="text-blue-700">Badan Usaha Milik Kalurahan Pondokrejo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-white/60 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-sm font-medium text-slate-500">Misi Utama</div>
                  <div className="font-semibold text-slate-800 mt-1">{BUMKAL_INFO.mission}</div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-sm font-medium text-slate-500">Bidang Usaha</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {BUMKAL_INFO.sectors.map(s => (
                      <Badge key={s} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-sm font-medium text-slate-500">Status</div>
                  <div className="font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Aktif (Pendirian 2025)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Employment Sectors */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle>Sektor Pekerjaan Utama</CardTitle>
                <CardDescription>Distribusi mata pencaharian penduduk Pondokrejo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Chart options={sectorBarOptions} series={sectorBarSeries} type="bar" height="100%" />
                </div>
              </CardContent>
            </Card>

            {/* Income Structure */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle>Struktur Pendapatan</CardTitle>
                <CardDescription>Estimasi proporsi sumber pendapatan penduduk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Chart options={incomeBarOptions} series={incomeBarSeries} type="bar" height="100%" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Potential Sectors Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Sprout className="h-5 w-5 text-emerald-600" />
              Potensi Pengembangan Ekonomi
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {POTENTIAL_SECTORS.map((sector, idx) => (
                <Card key={idx} className={`shadow-sm border hover:shadow-md transition-all ${sector.borderColor}`}>
                  <CardHeader className="pb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${sector.color}`}>
                      <sector.icon size={20} />
                    </div>
                    <CardTitle className="text-base">{sector.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Potensi</div>
                      <p className="text-sm text-slate-700">{sector.desc}</p>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Strategi</div>
                      <p className="text-sm text-slate-700">{sector.strategy}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
