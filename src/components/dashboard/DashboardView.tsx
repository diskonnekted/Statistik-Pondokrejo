"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import MapComponent from "@/components/map/MapComponent";
import { StatisticalCard } from "@/components/charts/StatisticalCard";
import ExternalPopulationCard from "@/components/dashboard/ExternalPopulationCard";
import { Users, Building2, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardView() {
  const { data, isLoading, isError, error } = useDashboardData();

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Terjadi Kesalahan</h2>
          <p className="text-slate-600">Gagal memuat data dashboard.</p>
          <p className="text-sm text-slate-500 mt-2">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))
        ) : (
          <>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Penduduk</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{data?.population.total.toLocaleString()}</h3>
                <span className="text-xs text-green-600 font-medium flex items-center mt-1">
                  <TrendingUp size={12} className="mr-1" /> +{data?.population.growth}%
                </span>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                <Users size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Laki-laki</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{data?.population.male.toLocaleString()}</h3>
                <span className="text-xs text-slate-400 font-medium mt-1">Jiwa</span>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                <Users size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Perempuan</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{data?.population.female.toLocaleString()}</h3>
                <span className="text-xs text-slate-400 font-medium mt-1">Jiwa</span>
              </div>
              <div className="p-3 bg-pink-50 rounded-lg text-pink-600">
                <Users size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Fasilitas Umum</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                  {(data?.facilities.schools || 0) + (data?.facilities.mosques || 0) + (data?.facilities.posyandu || 0)}
                </h3>
                <span className="text-xs text-slate-400 font-medium mt-1">Unit Terdata</span>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                <Building2 size={24} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Peta Wilayah & Persebaran</h2>
          <MapComponent />
        </div>

        {/* Demographics Chart */}
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Statistik Kependudukan</h2>
             {isLoading ? (
                <Skeleton className="h-[400px] w-full rounded-xl" />
             ) : (
                <StatisticalCard
                    title="Pertumbuhan Penduduk"
                    description="Tren 5 tahun terakhir"
                    type="line"
                    series={[{
                        name: "Populasi",
                        data: data?.populationGrowth.map(d => d.value) || []
                    }]}
                    options={{
                        xaxis: {
                            categories: data?.populationGrowth.map(d => d.year) || []
                        },
                        colors: ['#3b82f6']
                    }}
                    height={350}
                />
             )}
        </div>
      </div>

      {/* Economy Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Ekonomi & Mata Pencaharian</h2>
            {isLoading ? (
                <Skeleton className="h-[350px] w-full rounded-xl" />
             ) : (
                <StatisticalCard
                    title="Mata Pencaharian"
                    description="Distribusi pekerjaan penduduk"
                    type="pie"
                    series={data?.livelihood.map(d => d.value) || []}
                    options={{
                        labels: data?.livelihood.map(d => d.label) || [],
                        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                        legend: {
                            position: 'bottom'
                        }
                    }}
                    height={350}
                />
             )}
         </div>
         
         <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Penduduk per Padukuhan</h2>
             {isLoading ? (
                <Skeleton className="h-[350px] w-full rounded-xl" />
             ) : (
                <StatisticalCard
                    title="Populasi per Padukuhan"
                    description="Jumlah penduduk di setiap padukuhan"
                    type="bar"
                    series={[{
                        name: "Jumlah Penduduk",
                        data: data?.populationPerDusun.map(d => d.value) || []
                    }]}
                    options={{
                        xaxis: {
                            categories: data?.populationPerDusun.map(d => d.name) || []
                        },
                        colors: ['#10b981'],
                        plotOptions: {
                            bar: {
                                borderRadius: 4,
                                horizontal: true,
                            }
                        }
                    }}
                    height={350}
                />
             )}
         </div>
      </div>

      {/* External Data Section */}
      <div className="grid grid-cols-1 gap-6">
        <ExternalPopulationCard />
      </div>

      {/* Padukuhan Data Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Data Populasi per Padukuhan</h2>
        {isLoading ? (
            <Skeleton className="h-[400px] w-full rounded-xl" />
        ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">No</th>
                                <th className="px-6 py-4">Wilayah / Ketua</th>
                                <th className="px-6 py-4 text-center">KK</th>
                                <th className="px-6 py-4 text-center">L+P</th>
                                <th className="px-6 py-4 text-center">L</th>
                                <th className="px-6 py-4 text-center">P</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data?.padukuhanData?.map((item) => (
                                <tr key={item.no} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">{item.no}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-800">{item.nama}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">Ketua: {item.ketua}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">{item.kk}</td>
                                    <td className="px-6 py-4 text-center font-semibold text-blue-600">{item.total}</td>
                                    <td className="px-6 py-4 text-center">{item.laki}</td>
                                    <td className="px-6 py-4 text-center">{item.perempuan}</td>
                                </tr>
                            ))}
                            <tr className="bg-slate-50 font-bold text-slate-800">
                                <td className="px-6 py-4 text-center" colSpan={2}>TOTAL</td>
                                <td className="px-6 py-4 text-center">{data?.padukuhanData?.reduce((acc, curr) => acc + curr.kk, 0)}</td>
                                <td className="px-6 py-4 text-center">{data?.padukuhanData?.reduce((acc, curr) => acc + curr.total, 0)}</td>
                                <td className="px-6 py-4 text-center">{data?.padukuhanData?.reduce((acc, curr) => acc + curr.laki, 0)}</td>
                                <td className="px-6 py-4 text-center">{data?.padukuhanData?.reduce((acc, curr) => acc + curr.perempuan, 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )}
      </div>

    </div>
  );
}
