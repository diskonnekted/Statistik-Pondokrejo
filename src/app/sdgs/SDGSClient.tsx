"use client";

import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, TrendingUp, Info } from "lucide-react";
import { SDG_COLORS, SDG_ICONS, SDG_TITLES } from "@/lib/sdg-constants";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface SDGSClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  averageScore: string | number;
  success: boolean;
  message?: string;
}

export default function SDGSClient({ data: sdgsItems, averageScore, success, message }: SDGSClientProps) {
  const avgScoreNum = typeof averageScore === "string" ? parseFloat(averageScore) : averageScore;

  // Helper to get status color/label based on score (Using thresholds inferred from typical scoring)
  const getStatus = (score: number) => {
    if (score >= 90) return { label: "Sangat Baik", color: "bg-emerald-500", text: "text-emerald-600", category: "On Track" };
    if (score >= 70) return { label: "Baik", color: "bg-blue-500", text: "text-blue-600", category: "On Track" };
    if (score >= 50) return { label: "Cukup", color: "bg-yellow-500", text: "text-yellow-600", category: "Behind" };
    if (score >= 30) return { label: "Kurang", color: "bg-orange-500", text: "text-orange-600", category: "Behind" };
    return { label: "Sangat Kurang", color: "bg-red-500", text: "text-red-600", category: "Not Started" };
  };

  // Simplified Status Category for Charts (matching image labels roughly)
  const getStatusCategory = (score: number) => {
      if (score >= 100) return "Ahead";
      if (score >= 70) return "On Track";
      if (score >= 40) return "Behind";
      return "Not Started";
  };

  // Sort items by goal number
  const sortedItems = [...(sdgsItems || [])].sort((a, b) => {
    return (a.goals || 0) - (b.goals || 0);
  });

  // --- Data Processing for Charts ---

  // 1. Status Distribution
  const statusCounts = { "Ahead": 0, "On Track": 0, "Behind": 0, "Not Started": 0 };
  sortedItems.forEach(item => {
      const cat = getStatusCategory(parseFloat(item.score));
      statusCounts[cat as keyof typeof statusCounts]++;
  });

  // 2. Category Grouping
  const categories = {
      "Sosial": [1, 2, 3, 4, 5],
      "Lingkungan": [6, 7, 12, 13, 14, 15],
      "Ekonomi": [8, 10], // Simplified
      "Infrastruktur": [9, 11], // Simplified
      "Tata Kelola": [16, 17, 18]
  };

  const categoryScores: Record<string, number> = {};
  Object.entries(categories).forEach(([catName, goalIds]) => {
      const items = sortedItems.filter(item => goalIds.includes(item.goals || 0));
      const total = items.reduce((sum, item) => sum + parseFloat(item.score), 0);
      categoryScores[catName] = items.length ? total / items.length : 0;
  });

  // --- Chart Options ---

  // Radial Bar Chart Options for Average Score (Hero)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const radialOptions: any = {
    chart: { type: "radialBar", fontFamily: "inherit", sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        hollow: { size: "65%" },
        track: { background: "#e2e8f0" },
        dataLabels: {
          show: true,
          name: { show: false },
          value: {
            fontSize: "28px", fontWeight: "bold", color: "#1e293b", offsetY: 10,
            formatter: function (val: number) { return val.toFixed(2); }
          }
        }
      }
    },
    colors: [getStatus(avgScoreNum).text.includes("emerald") ? "#10b981" : "#3b82f6"],
    stroke: { lineCap: "round" },
  };

  // Pie Chart: Distribusi Status SDGs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const statusPieOptions: any = {
      chart: { type: 'pie', fontFamily: "inherit" },
      labels: Object.keys(statusCounts),
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#64748b'], // Blue (Ahead), Green (On Track), Orange (Behind), Gray (Not Started)
      legend: { position: 'bottom' },
      dataLabels: { enabled: true, formatter: function (val: number, opts: any) { return opts.w.config.labels[opts.seriesIndex] + ": " + Math.round(val) + "%" } }
  };
  const statusPieSeries = Object.values(statusCounts);

  // Bar Chart: Progress per Kategori
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categoryBarOptions: any = {
      chart: { type: 'bar', fontFamily: "inherit", toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 4, columnWidth: '60%', distributed: true } },
      dataLabels: { enabled: false },
      xaxis: { categories: Object.keys(categoryScores) },
      yaxis: { max: 100 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899'],
      legend: { show: false }
  };
  const categoryBarSeries = [{ name: 'Skor', data: Object.values(categoryScores).map(s => parseFloat(s.toFixed(2))) }];

  // Bar Chart: Progress Detail Semua SDGs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allGoalsBarOptions: any = {
      chart: { type: 'bar', fontFamily: "inherit", toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 4, columnWidth: '70%' } },
      dataLabels: { enabled: false },
      xaxis: { categories: sortedItems.map(item => `SDG ${item.goals || 0}`) },
      yaxis: { max: 100 },
      colors: ['#10b981'],
      tooltip: { y: { formatter: function (val: number) { return val + " Poin" } } }
  };
  const allGoalsBarSeries = [{ name: 'Skor', data: sortedItems.map(item => parseFloat(item.score)) }];

  // Area Chart: Analisis per Kategori
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categoryAreaOptions: any = {
      chart: { type: 'area', fontFamily: "inherit", toolbar: { show: false } },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
      xaxis: { categories: Object.keys(categoryScores) },
      yaxis: { max: 100 },
      fill: { opacity: 0.3 },
      colors: ['#3b82f6']
  };

  // Donut Chart for Status Tab
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const statusDonutOptions: any = {
      chart: { type: 'donut', fontFamily: "inherit" },
      labels: Object.keys(statusCounts),
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#64748b'],
      plotOptions: { pie: { donut: { size: '65%' } } },
      legend: { position: 'bottom' },
      dataLabels: { enabled: false }
   };


  if (!success) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{message || "Gagal memuat data SDGs"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100 p-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-50 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-emerald-50 opacity-50 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider">
              <TrendingUp size={14} />
              Capaian SDGs Desa
            </div>
            
            <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0">
                     <Image 
                        src={SDG_ICONS[18]} 
                        alt="SDGs Logo" 
                        fill
                        className="object-contain"
                        unoptimized
                     />
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                    Sustainable Development Goals
                    </h1>
                </div>
            </div>
            
            <p className="text-slate-600 text-lg max-w-2xl leading-relaxed">
              Pencapaian tujuan pembangunan berkelanjutan Desa Pondokrejo untuk mewujudkan desa yang sejahtera, mandiri, dan berkeadilan.
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-100 shadow-sm">
            <span className="text-sm font-medium text-slate-500 mb-2">Rata-rata Skor</span>
            <div className="h-40 w-40">
              <Chart 
                options={radialOptions} 
                series={[avgScoreNum]} 
                type="radialBar" 
                height={200} 
                width={160}
              />
            </div>
            <Badge className={`${getStatus(avgScoreNum).color} mt-[-10px] z-20`}>
              {getStatus(avgScoreNum).label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="ringkasan" className="w-full space-y-6">
        <div className="flex justify-center md:justify-start">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-white shadow-sm border border-slate-200">
                <TabsTrigger value="ringkasan">Ringkasan</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="kategori">Kategori</TabsTrigger>
            </TabsList>
        </div>

        {/* Tab: Ringkasan */}
        <TabsContent value="ringkasan" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info size={18} />
                            Distribusi Status SDGs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Chart options={statusPieOptions} series={statusPieSeries} type="pie" height={300} />
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp size={18} />
                            Progress per Kategori
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Chart options={categoryBarOptions} series={categoryBarSeries} type="bar" height={300} />
                    </CardContent>
                </Card>
            </div>

             {/* Grid of Cards (Existing) */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedItems.map((item, index) => {
                const goalNum = item.goals || index + 1;
                const score = parseFloat(item.score);
                const color = SDG_COLORS[goalNum] || "#64748b";
                const iconUrl = SDG_ICONS[goalNum] || SDG_ICONS[18];
                const title = SDG_TITLES[goalNum] || item.title || `Goal ${goalNum}`;
                const status = getStatus(score);

                return (
                    <Card 
                    key={index} 
                    className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white relative"
                    >
                    {/* Color Stripe Top */}
                    <div className="h-2 w-full" style={{ backgroundColor: color }}></div>
                    
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                        <div className="relative h-16 w-16 shrink-0 transition-transform duration-300 group-hover:scale-110">
                            <Image 
                            src={iconUrl} 
                            alt={`Goal ${goalNum}`}
                            fill
                            className="object-contain drop-shadow-sm"
                            unoptimized
                            />
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-3xl font-bold text-slate-800 tracking-tight">
                            {score.toFixed(1)}
                            </span>
                            <Badge variant="outline" className={`text-xs ${status.text} border-current opacity-80`}>
                            {status.label}
                            </Badge>
                        </div>
                        </div>

                        <div className="space-y-3">
                        <h3 className="font-bold text-slate-800 leading-tight min-h-[3rem] line-clamp-2 group-hover:text-blue-700 transition-colors">
                            {title}
                        </h3>
                        
                        {/* Custom Progress Bar */}
                        <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                            className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ 
                                width: `${score}%`, 
                                backgroundColor: color 
                            }}
                            ></div>
                        </div>
                        </div>

                        {/* Decorative background number */}
                        <div className="absolute -bottom-6 -right-4 text-9xl font-black text-slate-50 select-none pointer-events-none opacity-50 z-0">
                        {goalNum}
                        </div>
                    </CardContent>
                    </Card>
                );
                })}
            </div>
        </TabsContent>

        {/* Tab: Progress */}
        <TabsContent value="progress">
             <Card className="shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle>Progress Detail Semua SDGs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Chart options={allGoalsBarOptions} series={allGoalsBarSeries} type="bar" height={400} />
                </CardContent>
            </Card>
        </TabsContent>

        {/* Tab: Status */}
        <TabsContent value="status" className="space-y-6">
            <Card className="shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle>Status Implementation SDGs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-4 mb-8 text-center">
                        <div className="p-4 rounded-lg bg-blue-50 text-blue-700">
                            <div className="text-3xl font-bold">{statusCounts["Ahead"]}</div>
                            <div className="text-sm font-medium">Ahead</div>
                        </div>
                         <div className="p-4 rounded-lg bg-emerald-50 text-emerald-700">
                            <div className="text-3xl font-bold">{statusCounts["On Track"]}</div>
                            <div className="text-sm font-medium">On Track</div>
                        </div>
                         <div className="p-4 rounded-lg bg-orange-50 text-orange-700">
                            <div className="text-3xl font-bold">{statusCounts["Behind"]}</div>
                            <div className="text-sm font-medium">Behind</div>
                        </div>
                         <div className="p-4 rounded-lg bg-slate-100 text-slate-700">
                            <div className="text-3xl font-bold">{statusCounts["Not Started"]}</div>
                            <div className="text-sm font-medium">Not Started</div>
                        </div>
                    </div>
                    <div className="flex justify-center">
                         <div className="w-full max-w-md">
                            <Chart options={statusDonutOptions} series={statusPieSeries} type="donut" height={350} />
                         </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        {/* Tab: Kategori */}
        <TabsContent value="kategori">
            <Card className="shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle>Analisis per Kategori</CardTitle>
                </CardHeader>
                <CardContent>
                    <Chart options={categoryAreaOptions} series={categoryBarSeries} type="area" height={400} />
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
