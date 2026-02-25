"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ChartInner from "@/components/charts/ChartInner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, Activity, AlertTriangle, BarChart3, PieChart, Users, Banknote, Trees, CheckCircle2, XCircle, Info } from "lucide-react";
import type { IdmIndicator } from "@/types/idm";

interface IDMClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  year: string;
  iksData: IdmIndicator[];
  ikeData: IdmIndicator[];
  iklData: IdmIndicator[];
}

export default function IDMClient({ data: response, year, iksData, ikeData, iklData }: IDMClientProps) {
  // Extract IDM data from nested structure
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawData = response.data as any;
  const idmData = rawData?.data?.[0]?.attributes;
  const summaries = idmData?.SUMMARIES || {};
  const rows = idmData?.ROW || [];

  // IDM Scores for charts (Hardcoded based on 2024 data provided by user)
  const IDM_SCORES = {
    IKS: 92.00,
    IKE: 93.33,
    IKL: 60.00
  };

  const radarSeries = [{
    name: 'Skor',
    data: [IDM_SCORES.IKS, IDM_SCORES.IKE, IDM_SCORES.IKL],
  }];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const radarOptions: any = {
    chart: {
      type: 'radar',
      toolbar: { show: false },
      fontFamily: 'inherit'
    },
    labels: ['IKS', 'IKE', 'IKL'],
    stroke: {
      width: 2,
      colors: ['#3b82f6'],
    },
    fill: {
      opacity: 0.2,
      colors: ['#3b82f6'],
    },
    markers: {
      size: 4,
      colors: ['#fff'],
      strokeColors: '#3b82f6',
      strokeWidth: 2,
    },
    yaxis: {
      show: false,
      max: 100,
    },
    xaxis: {
      categories: ['IKS', 'IKE', 'IKL'],
      labels: {
        style: {
          colors: ['#64748b', '#64748b', '#64748b'],
          fontSize: '12px',
          fontFamily: 'inherit'
        }
      }
    },
    tooltip: {
      y: {
        formatter: (val: number) => val.toFixed(2)
      }
    }
  };

  const barSeries = [{
    name: 'Skor',
    data: [IDM_SCORES.IKS, IDM_SCORES.IKE, IDM_SCORES.IKL],
  }];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const barOptions: any = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'inherit'
    },
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 4,
        horizontal: false,
        columnWidth: '40%',
      }
    },
    colors: ['#10b981', '#3b82f6', '#f59e0b'], // Green (IKS), Blue (IKE), Orange (IKL)
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['IKS', 'IKE', 'IKL'],
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'inherit'
        }
      }
    },
    yaxis: {
      max: 100,
      tickAmount: 5,
    },
    legend: {
      show: false
    },
    tooltip: {
      y: {
        formatter: (val: number) => val.toFixed(4)
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4,
    }
  };

  // Calculate changes
  const skorSaatIni = Number(summaries?.SKOR_SAAT_INI) || 0;
  const penambahan = Number(summaries?.PENAMBAHAN) || 0;
  const skorSebelumnya = skorSaatIni - penambahan;
  const persentasePerubahan = skorSebelumnya !== 0 ? (penambahan / skorSebelumnya) * 100 : 0;
  const isPositiveChange = penambahan >= 0;

  // Helper to format score
  const formatScore = (score: number) => {
    return typeof score === "number" ? score.toFixed(4) : score;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Indeks Desa Membangun (IDM)</h1>
          <p className="text-muted-foreground">
            Status kemandirian desa berdasarkan indikator ketahanan sosial, ekonomi, dan ekologi.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-white p-1 rounded-md shadow-sm border">
            {[2021, 2022, 2023, 2024, 2025].map((y) => (
              <a
                key={y}
                href={`/idm?year=${y}`}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  year === y.toString()
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {y}
              </a>
            ))}
          </div>
        </div>
      </div>

      {!response.success ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Gagal memuat data IDM: {response.message || "Terjadi kesalahan"}
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
            {/* 1. Skor IDM */}
            <Card className="bg-blue-50 border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                  Skor IDM
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {formatScore(summaries?.SKOR_SAAT_INI)}
                </div>
                <div className="w-full bg-blue-200 rounded-full h-1.5 mb-2">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full" 
                    style={{ width: `${(skorSaatIni / 1) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-blue-600 font-medium">
                  dari 1.0000
                </p>
              </CardContent>
            </Card>

            {/* 2. Status IDM */}
            <Card className="bg-emerald-50 border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-emerald-700 flex items-center gap-2">
                  <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                  Status IDM
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Activity className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-900 mb-2 uppercase">
                  {summaries?.STATUS || "N/A"}
                </div>
                <Badge className="bg-emerald-200 text-emerald-800 hover:bg-emerald-300 border-none shadow-none font-normal">
                  Status Saat Ini
                </Badge>
              </CardContent>
            </Card>

            {/* 3. Target Status */}
            <Card className="bg-purple-50 border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
                  <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                  Target Status
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900 mb-2 uppercase">
                  {summaries?.TARGET_STATUS || "N/A"}
                </div>
                <Badge className="bg-purple-200 text-purple-800 hover:bg-purple-300 border-none shadow-none font-normal">
                  {Number(year) + 1}
                </Badge>
              </CardContent>
            </Card>

            {/* 4. Skor Minimal */}
            <Card className="bg-amber-50 border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-amber-700 flex items-center gap-2">
                  <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
                  Skor Minimal
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <BarChart3 className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-900 mb-2">
                  {formatScore(summaries?.SKOR_MINIMAL)}
                </div>
                <p className="text-xs text-amber-700">
                  Batas minimum status {summaries?.STATUS ? summaries.STATUS.charAt(0) + summaries.STATUS.slice(1).toLowerCase() : "Mandiri"}
                </p>
              </CardContent>
            </Card>

            {/* 5. Perubahan */}
            <Card className={`${isPositiveChange ? "bg-green-50" : "bg-rose-50"} border-none shadow-sm`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${isPositiveChange ? "text-green-700" : "text-rose-700"} flex items-center gap-2`}>
                  <span className={`w-1 h-4 ${isPositiveChange ? "bg-green-500" : "bg-rose-500"} rounded-full`}></span>
                  Perubahan
                </CardTitle>
                <div className={`h-8 w-8 rounded-full ${isPositiveChange ? "bg-green-100 text-green-600" : "bg-rose-100 text-rose-600"} flex items-center justify-center`}>
                  <TrendingUp className={`h-4 w-4 ${!isPositiveChange ? "rotate-180" : ""}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${isPositiveChange ? "text-green-900" : "text-rose-900"} mb-2`}>
                  {formatScore(penambahan)}
                </div>
                <p className={`text-xs ${isPositiveChange ? "text-green-700" : "text-rose-700"} font-medium`}>
                  ({persentasePerubahan.toFixed(4)}%)
                </p>
                <p className={`text-xs ${isPositiveChange ? "text-green-600" : "text-rose-600"} mt-1`}>
                  dari tahun sebelumnya
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-emerald-600" />
                  Distribusi Skor Per Kategori
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ChartInner type="radar" series={radarSeries} options={radarOptions} height={350} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Perbandingan Skor Kategori
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ChartInner type="bar" series={barSeries} options={barOptions} height={350} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Index Breakdown Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-emerald-50 border-emerald-100 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-700 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Indeks Ketahanan Sosial (IKS)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-emerald-900">
                        {formatScore(IDM_SCORES.IKS)}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-100 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        Indeks Ketahanan Ekonomi (IKE)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-blue-900">
                        {formatScore(IDM_SCORES.IKE)}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-100 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-amber-700 flex items-center gap-2">
                        <Trees className="h-4 w-4" />
                        Indeks Ketahanan Lingkungan (IKL)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-amber-900">
                        {formatScore(IDM_SCORES.IKL)}
                    </div>
                </CardContent>
            </Card>
          </div>

          {/* Detailed Table IKS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-600" />
                Rincian Indikator Ketahanan Sosial (IKS)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-emerald-100">
                <Table>
                  <TableHeader className="bg-emerald-50/50">
                    <TableRow>
                      <TableHead className="w-[50px] text-center">No</TableHead>
                      <TableHead className="min-w-[150px]">Indikator</TableHead>
                      <TableHead className="text-center w-[80px]">Skor</TableHead>
                      <TableHead className="min-w-[200px]">Keterangan</TableHead>
                      <TableHead className="min-w-[200px]">Kegiatan yang Dapat Dilakukan</TableHead>
                      <TableHead className="min-w-[150px]">Pelaksana</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {iksData.map((row, index) => (
                      <TableRow key={index} className="hover:bg-emerald-50/30 transition-colors">
                        <TableCell className="text-center font-medium">{row.no}</TableCell>
                        <TableCell className="font-semibold text-emerald-900">{row.indikator}</TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant={row.skor >= 5 ? "default" : row.skor >= 4 ? "secondary" : row.skor >= 3 ? "outline" : "destructive"}
                            className={`${
                              row.skor >= 5 ? "bg-emerald-500 hover:bg-emerald-600" : 
                              row.skor >= 4 ? "bg-blue-500 hover:bg-blue-600 text-white" : 
                              row.skor >= 3 ? "bg-yellow-500 hover:bg-yellow-600 text-white border-none" : ""
                            }`}
                          >
                            {row.skor}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{row.keterangan}</TableCell>
                        <TableCell className="text-sm">
                          {row.kegiatan !== "-" ? (
                            <div className="flex items-start gap-2 text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-100">
                              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>{row.kegiatan}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(row.pelaksana).map(([key, value]) => {
                              if (value === "-" || !value) return null;
                              return (
                                <Badge key={key} variant="outline" className="text-xs font-normal border-slate-300 bg-slate-50">
                                  <span className="font-semibold capitalize mr-1">{key}:</span> {value}
                                </Badge>
                              );
                            })}
                            {Object.values(row.pelaksana).every(v => v === "-") && (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Table IKE */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-blue-600" />
                Rincian Indikator Ketahanan Ekonomi (IKE)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-blue-100">
                <Table>
                  <TableHeader className="bg-blue-50/50">
                    <TableRow>
                      <TableHead className="w-[50px] text-center">No</TableHead>
                      <TableHead className="min-w-[150px]">Indikator</TableHead>
                      <TableHead className="text-center w-[80px]">Skor</TableHead>
                      <TableHead className="min-w-[200px]">Keterangan</TableHead>
                      <TableHead className="min-w-[200px]">Kegiatan yang Dapat Dilakukan</TableHead>
                      <TableHead className="min-w-[150px]">Pelaksana</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ikeData.map((row, index) => (
                      <TableRow key={index} className="hover:bg-blue-50/30 transition-colors">
                        <TableCell className="text-center font-medium">{row.no}</TableCell>
                        <TableCell className="font-semibold text-blue-900">{row.indikator}</TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant={row.skor >= 5 ? "default" : row.skor >= 4 ? "secondary" : row.skor >= 3 ? "outline" : "destructive"}
                            className={`${
                              row.skor >= 5 ? "bg-emerald-500 hover:bg-emerald-600" : 
                              row.skor >= 4 ? "bg-blue-500 hover:bg-blue-600 text-white" : 
                              row.skor >= 3 ? "bg-yellow-500 hover:bg-yellow-600 text-white border-none" : ""
                            }`}
                          >
                            {row.skor}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{row.keterangan}</TableCell>
                        <TableCell className="text-sm">
                          {row.kegiatan !== "-" ? (
                            <div className="flex items-start gap-2 text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-100">
                              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>{row.kegiatan}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(row.pelaksana).map(([key, value]) => {
                              if (value === "-" || !value) return null;
                              return (
                                <Badge key={key} variant="outline" className="text-xs font-normal border-slate-300 bg-slate-50">
                                  <span className="font-semibold capitalize mr-1">{key}:</span> {value}
                                </Badge>
                              );
                            })}
                            {Object.values(row.pelaksana).every(v => v === "-") && (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Table IKL */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trees className="h-5 w-5 text-amber-600" />
                Rincian Indikator Ketahanan Lingkungan (IKL)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-amber-100">
                <Table>
                  <TableHeader className="bg-amber-50/50">
                    <TableRow>
                      <TableHead className="w-[50px] text-center">No</TableHead>
                      <TableHead className="min-w-[150px]">Indikator</TableHead>
                      <TableHead className="text-center w-[80px]">Skor</TableHead>
                      <TableHead className="min-w-[200px]">Keterangan</TableHead>
                      <TableHead className="min-w-[200px]">Kegiatan yang Dapat Dilakukan</TableHead>
                      <TableHead className="min-w-[150px]">Pelaksana</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {iklData.map((row, index) => (
                      <TableRow key={index} className="hover:bg-amber-50/30 transition-colors">
                        <TableCell className="text-center font-medium">{row.no}</TableCell>
                        <TableCell className="font-semibold text-amber-900">{row.indikator}</TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant={row.skor >= 5 ? "default" : row.skor >= 4 ? "secondary" : row.skor >= 3 ? "outline" : "destructive"}
                            className={`${
                              row.skor >= 5 ? "bg-emerald-500 hover:bg-emerald-600" : 
                              row.skor >= 4 ? "bg-blue-500 hover:bg-blue-600 text-white" : 
                              row.skor >= 3 ? "bg-yellow-500 hover:bg-yellow-600 text-white border-none" : ""
                            }`}
                          >
                            {row.skor}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{row.keterangan}</TableCell>
                        <TableCell className="text-sm">
                          {row.kegiatan !== "-" ? (
                            <div className="flex items-start gap-2 text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-100">
                              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>{row.kegiatan}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(row.pelaksana).map(([key, value]) => {
                              if (value === "-" || !value) return null;
                              return (
                                <Badge key={key} variant="outline" className="text-xs font-normal border-slate-300 bg-slate-50">
                                  <span className="font-semibold capitalize mr-1">{key}:</span> {value}
                                </Badge>
                              );
                            })}
                            {Object.values(row.pelaksana).every(v => v === "-") && (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}