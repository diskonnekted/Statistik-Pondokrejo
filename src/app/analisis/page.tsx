
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { fetchSDGSData, fetchIDMData } from "@/lib/api-helpers";
import { readStandardStatsExcel } from "@/lib/excel-helper";
import { calculateDependencyRatio, calculateSexRatio, analyzeSDGsGap } from "@/lib/analytics-helper";
import { DATA_PADUKUHAN, TOTAL_PENDUDUK } from "@/lib/data-padukuhan";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, AlertTriangle, Activity, BarChart3, PieChart, Map as MapIcon } from "lucide-react";
import ChartInner from "@/components/charts/ChartInner";
import PETA_DATA from "@/lib/pondokrejo.json";

export const metadata = {
  title: "Analisis Data | Kalurahan Pondokrejo",
  description: "Analisis mendalam data kependudukan dan pembangunan Kalurahan Pondokrejo",
};

export default async function AnalisisPage() {
  // 1. Fetch Demographic Data
  const ageData = readStandardStatsExcel("statistik_penduduk_24_02_2026 rentang_umur.xls");
  const dependencyRatio = calculateDependencyRatio(ageData);
  const sexRatio = calculateSexRatio(TOTAL_PENDUDUK.laki, TOTAL_PENDUDUK.perempuan);

  // 2. Fetch SDGs Data
  const sdgsResponse = await fetchSDGSData();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sdgsItems = (sdgsResponse.data as any)?.data || [];
  const sdgsAnalysis = analyzeSDGsGap(sdgsItems);

  // 3. Fetch IDM Data
  const idmResponse = await fetchIDMData();
  const idmRawData = idmResponse.success ? (idmResponse.data as any) : null;
  
  // Extract IDM Indicators
  let iks = 0, ike = 0, ikl = 0;
  let idmScore = 0;
  let idmStatus = "";
  let idmYear = "2024"; // Default fallback
  
  if (idmRawData && idmRawData.data && idmRawData.data.length > 0 && idmRawData.data[0].attributes) {
      const attributes = idmRawData.data[0].attributes;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const indicators = attributes.ROW || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const summaries = attributes.SUMMARIES || {};
      
      if (summaries.TAHUN) {
          idmYear = String(summaries.TAHUN);
      }

      if (Array.isArray(indicators)) {
          // Find scores
          const findScore = (keyword: string) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const item = indicators.find((i: any) => i.INDIKATOR && i.INDIKATOR.includes(keyword));
              return item ? Number(item.SKOR) : 0;
          };

          // IDM Score
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const idmItem = indicators.find((i: any) => i.INDIKATOR && i.INDIKATOR.includes("IDM") && !i.INDIKATOR.includes("STATUS"));
          idmScore = idmItem ? Number(idmItem.SKOR) : (summaries.SKOR_SAAT_INI ? Number(summaries.SKOR_SAAT_INI) : 0);
          
          // IDM Status
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const statusItem = indicators.find((i: any) => i.INDIKATOR && i.INDIKATOR.includes("STATUS IDM"));
          idmStatus = statusItem ? statusItem.SKOR : (summaries.STATUS || "");

          // IKS, IKE, IKL
          iks = findScore("IKS");
          ike = findScore("IKE");
          ikl = findScore("IKL");
          
          // Fallback calculation for IKS if missing but IDM exists
          if (iks === 0 && idmScore > 0 && ike > 0 && ikl > 0) {
              iks = (3 * idmScore) - ike - ikl;
          }
      }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const feature = (PETA_DATA as any).features[0];
  const luasWilayah = feature.properties.luas || 0; // In Hectares
  const populationDensity = luasWilayah > 0 ? (TOTAL_PENDUDUK.total / luasWilayah).toFixed(2) : 0;
  const idmScoreExcel = feature.properties.nilai_idm_2022;
  const idmStatusExcel = feature.properties.status_idm_2022;

  // Prepare Chart Data
  
  // Padukuhan Population Chart
  const padukuhanChartOptions = {
    chart: { type: 'bar' as const },
    xaxis: { categories: DATA_PADUKUHAN.map(p => p.nama.replace("Padukuhan ", "")) },
    colors: ['#3b82f6', '#ec4899'],
    plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
  };
  
  const padukuhanSeries = [
    { name: 'Laki-laki', data: DATA_PADUKUHAN.map(p => p.laki) },
    { name: 'Perempuan', data: DATA_PADUKUHAN.map(p => p.perempuan) }
  ];

  // IDM Radar Chart (Simulated structure if IDM data is complex, typically IKS, IKE, IKL)
  // Assuming idmData has iks, ike, ikl fields. If not, we might need to inspect it.
  // Based on previous knowledge of IDM structure: mapData.skor_iks, etc.
  // Let's be safe and check if data exists, otherwise use placeholder or skip.
  const idmRadarOptions = {
    chart: { 
        type: 'radar' as const,
        toolbar: { show: false }
    },
    xaxis: { 
        categories: ['Ketahanan Sosial (IKS)', 'Ketahanan Ekonomi (IKE)', 'Ketahanan Lingkungan (IKL)'],
        labels: {
            style: {
                colors: ['#64748b', '#64748b', '#64748b'],
                fontSize: '12px',
                fontFamily: 'inherit'
            }
        }
    },
    yaxis: { 
        max: 1, 
        min: 0, 
        tickAmount: 5,
        labels: {
            // formatter removed to avoid serialization error
        }
    },
    fill: { 
        opacity: 0.2,
        colors: ['#3b82f6']
    },
    stroke: { 
        show: true, 
        width: 3, 
        colors: ['#2563eb']
    },
    markers: { 
        size: 5,
        colors: ['#2563eb'],
        strokeWidth: 2,
        strokeColors: '#fff',
        hover: { size: 7 }
    },
    tooltip: {
        y: {
            // formatter removed to avoid serialization error
        }
    }
  };

  const idmSeries = [
    {
      name: 'Indeks IDM',
      data: [iks, ike, ikl]
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Analisis Data Wilayah</h1>
        <p className="text-muted-foreground">
          Insight mendalam mengenai demografi, kinerja pembangunan, dan potensi wilayah.
        </p>
      </div>

      {/* Analisis Geospasial Section (Always Visible) */}
      <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                  <MapIcon className="h-5 w-5 text-blue-500" /> Analisis Geospasial & Wilayah
              </CardTitle>
              <CardDescription>Data Wilayah Terkini (2022) dari Pemetaan Partisipatif</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2">
                  <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Luas Wilayah</p>
                      <p className="text-2xl font-bold">{Number(luasWilayah).toFixed(2)} <span className="text-sm font-normal text-muted-foreground">Ha</span></p>
                  </div>
                  <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Kepadatan</p>
                      <p className="text-2xl font-bold">{populationDensity} <span className="text-sm font-normal text-muted-foreground">jiwa/Ha</span></p>
                  </div>
                  <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Status IDM {idmScore > 0 ? idmYear : '2022'}</p>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-sm px-3 py-1">
                          {idmStatus || idmStatusExcel || "N/A"}
                      </Badge>
                  </div>
                   <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Nilai IDM</p>
                      <p className="text-2xl font-bold">{idmScore > 0 ? idmScore.toFixed(4) : (idmScoreExcel || "-")}</p>
                  </div>
                   <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Kenaikan Skor</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <p className="text-2xl font-bold text-green-600">+{feature.properties.kenaikan || "-"}</p>
                      </div>
                  </div>
              </div>
          </CardContent>
      </Card>

      <Tabs defaultValue="demografi" className="space-y-4">
        <TabsList>
          <TabsTrigger value="demografi">Demografi</TabsTrigger>
          <TabsTrigger value="pembangunan">Pembangunan (IDM & SDGs)</TabsTrigger>
          <TabsTrigger value="wilayah">Sebaran Wilayah</TabsTrigger>
        </TabsList>

        {/* DEMOGRAFI TAB */}
        <TabsContent value="demografi" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Penduduk</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{TOTAL_PENDUDUK.total.toLocaleString('id-ID')}</div>
                <p className="text-xs text-muted-foreground">Jiwa</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rasio Jenis Kelamin</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sexRatio.ratio}</div>
                <p className="text-xs text-muted-foreground">Laki-laki per 100 Perempuan</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rasio Ketergantungan</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dependencyRatio.totalDependency}%</div>
                <p className="text-xs text-muted-foreground">Beban Tanggungan Produktif</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bonus Demografi</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                    {((dependencyRatio.workingAgePopulation / (dependencyRatio.youthPopulation + dependencyRatio.elderlyPopulation + dependencyRatio.workingAgePopulation)) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Persentase Usia Produktif</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sebaran Penduduk per Padukuhan</CardTitle>
                <CardDescription>Perbandingan jumlah penduduk laki-laki dan perempuan</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartInner type="bar" series={padukuhanSeries} options={padukuhanChartOptions} height={350} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Komposisi Usia</CardTitle>
                <CardDescription>Struktur umur penduduk Pondokrejo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">Usia Muda (0-14)</span>
                            <span>{dependencyRatio.youthPopulation.toLocaleString()} ({((dependencyRatio.youthPopulation / (dependencyRatio.youthPopulation + dependencyRatio.elderlyPopulation + dependencyRatio.workingAgePopulation)) * 100).toFixed(1)}%)</span>
                        </div>
                        <Progress value={(dependencyRatio.youthPopulation / (dependencyRatio.youthPopulation + dependencyRatio.elderlyPopulation + dependencyRatio.workingAgePopulation)) * 100} className="h-2" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">Usia Produktif (15-64)</span>
                            <span>{dependencyRatio.workingAgePopulation.toLocaleString()} ({((dependencyRatio.workingAgePopulation / (dependencyRatio.youthPopulation + dependencyRatio.elderlyPopulation + dependencyRatio.workingAgePopulation)) * 100).toFixed(1)}%)</span>
                        </div>
                        <Progress value={(dependencyRatio.workingAgePopulation / (dependencyRatio.youthPopulation + dependencyRatio.elderlyPopulation + dependencyRatio.workingAgePopulation)) * 100} className="h-2 bg-primary/20" indicatorClassName="bg-primary" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">Lansia (65+)</span>
                            <span>{dependencyRatio.elderlyPopulation.toLocaleString()} ({((dependencyRatio.elderlyPopulation / (dependencyRatio.youthPopulation + dependencyRatio.elderlyPopulation + dependencyRatio.workingAgePopulation)) * 100).toFixed(1)}%)</span>
                        </div>
                        <Progress value={(dependencyRatio.elderlyPopulation / (dependencyRatio.youthPopulation + dependencyRatio.elderlyPopulation + dependencyRatio.workingAgePopulation)) * 100} className="h-2 bg-orange-100" indicatorClassName="bg-orange-500" />
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PEMBANGUNAN TAB */}
        <TabsContent value="pembangunan" className="space-y-4">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {/* IDM Analysis */}
                <Card>
                    <CardHeader>
                        <CardTitle>Indeks Desa Membangun (IDM) {idmScore > 0 ? idmYear : ""}</CardTitle>
                        <CardDescription>Keseimbangan 3 pilar pembangunan desa</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {idmScore > 0 ? (
                            <div className="flex flex-col items-center">
                                <div className="w-full h-[450px]">
                                    <ChartInner type="radar" series={idmSeries} options={idmRadarOptions} height={450} />
                                </div>
                                <div className="grid grid-cols-3 gap-4 w-full text-center mt-4">
                                    <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg">
                                        <div className="text-xs text-blue-600 font-medium">Sosial (IKS)</div>
                                        <div className="font-bold text-blue-900">{iks.toFixed(4)}</div>
                                    </div>
                                    <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg">
                                        <div className="text-xs text-blue-600 font-medium">Ekonomi (IKE)</div>
                                        <div className="font-bold text-blue-900">{ike.toFixed(4)}</div>
                                    </div>
                                    <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg">
                                        <div className="text-xs text-blue-600 font-medium">Lingkungan (IKL)</div>
                                        <div className="font-bold text-blue-900">{ikl.toFixed(4)}</div>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg w-full flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-600">Skor IDM {idmYear} {idmStatus ? `(${idmStatus})` : ''}</span>
                                    <span className="text-xl font-bold text-slate-900">{idmScore.toFixed(4)}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-[450px] items-center justify-center text-muted-foreground flex-col gap-2">
                                <p>Data IDM tidak tersedia dari server.</p>
                                {idmScoreExcel && (
                                    <p className="text-sm">Data Excel 2022: {idmScoreExcel} ({idmStatusExcel})</p>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* SDGs Gap Analysis */}
                <Card>
                    <CardHeader>
                        <CardTitle>Analisis Capaian SDGs</CardTitle>
                        <CardDescription>Prioritas dan Prestasi Pembangunan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold mb-3 flex items-center text-green-600">
                                    <TrendingUp className="mr-2 h-4 w-4" /> Capaian Tertinggi (Top 3)
                                </h4>
                                <div className="space-y-3">
                                    {sdgsAnalysis.top3.map((item: any, idx: number) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="font-medium truncate max-w-[80%]">Goal {item.goals}: {item.title}</span>
                                                <span className="font-bold">{item.score}</span>
                                            </div>
                                            <Progress value={item.score} className="h-1.5" indicatorClassName="bg-green-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <h4 className="text-sm font-semibold mb-3 flex items-center text-red-600">
                                    <AlertTriangle className="mr-2 h-4 w-4" /> Prioritas Perbaikan (Bottom 3)
                                </h4>
                                <div className="space-y-3">
                                    {sdgsAnalysis.bottom3.map((item: any, idx: number) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="font-medium truncate max-w-[80%]">Goal {item.goals}: {item.title}</span>
                                                <span className="font-bold">{item.score}</span>
                                            </div>
                                            <Progress value={item.score} className="h-1.5" indicatorClassName="bg-red-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
             </div>
        </TabsContent>

        {/* WILAYAH TAB */}
        <TabsContent value="wilayah" className="space-y-4">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-full lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Kepadatan Penduduk</CardTitle>
                        <CardDescription>Top 5 Padukuhan Terpadat</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-4">
                            {[...DATA_PADUKUHAN].sort((a, b) => b.total - a.total).slice(0, 5).map((p, idx) => (
                                <div key={idx} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{p.nama.replace("Padukuhan ", "")}</p>
                                            <p className="text-xs text-muted-foreground">{p.kk} Kepala Keluarga</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-sm">{p.total}</span>
                                        <span className="text-xs text-muted-foreground ml-1">Jiwa</span>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </CardContent>
                </Card>
                
                <Card className="col-span-full md:col-span-2 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Potensi Fasilitas Wilayah</CardTitle>
                        <CardDescription>Ketersediaan infrastruktur penunjang</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12 text-muted-foreground">
                            <PieChart className="mx-auto h-12 w-12 opacity-20 mb-3" />
                            <p>Analisis spasial lebih lanjut memerlukan data titik koordinat fasilitas yang lebih lengkap.</p>
                            <p className="text-sm mt-2">Data saat ini: Batas Wilayah, Makam, dan beberapa layer infrastruktur dasar.</p>
                        </div>
                    </CardContent>
                </Card>
             </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
