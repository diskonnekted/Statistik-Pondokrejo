"use client";

import { useEffect, useState } from "react";
import { StatisticalCard } from "@/components/charts/StatisticalCard";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap, BookOpen, User } from "lucide-react";

interface EducationData {
  id: number;
  label: string;
  total: number;
  male: number;
  female: number;
}

export default function EducationPage() {
  const [data, setData] = useState<EducationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/statistik/pendidikan");
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || "Gagal memuat data pendidikan");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-1/3 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center text-red-500">
          <p className="font-bold text-xl">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalPopulation = data.reduce((acc, curr) => acc + curr.total, 0);
  const mostCommon = data.reduce((prev, current) => (prev.total > current.total) ? prev : current, data[0]);
  const leastCommon = data.reduce((prev, current) => (prev.total < current.total && prev.total > 0) ? prev : current, data[0]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-800">Statistik Pendidikan</h1>
        <p className="text-slate-500">Data tingkat pendidikan penduduk di Kalurahan Pondokrejo</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Terdata</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalPopulation.toLocaleString()}</h3>
            <span className="text-xs text-slate-400">Jiwa</span>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <User size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Dominan</p>
            <h3 className="text-lg font-bold text-slate-800 mt-1 line-clamp-1" title={mostCommon?.label}>
              {mostCommon?.label}
            </h3>
            <span className="text-xs text-green-600 font-medium">
              {((mostCommon?.total / totalPopulation) * 100).toFixed(1)}% dari total
            </span>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-green-600">
            <GraduationCap size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Minoritas</p>
            <h3 className="text-lg font-bold text-slate-800 mt-1 line-clamp-1" title={leastCommon?.label}>
              {leastCommon?.label}
            </h3>
            <span className="text-xs text-slate-400">
              {((leastCommon?.total / totalPopulation) * 100).toFixed(1)}% dari total
            </span>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
            <BookOpen size={24} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatisticalCard
          title="Distribusi Pendidikan"
          description="Persentase penduduk berdasarkan tingkat pendidikan"
          type="pie"
          series={data.map(d => d.total)}
          options={{
            labels: data.map(d => d.label),
            colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'],
            legend: { position: 'bottom' }
          }}
          height={350}
        />

        <StatisticalCard
          title="Perbandingan Gender"
          description="Jumlah laki-laki dan perempuan per jenjang pendidikan"
          type="bar"
          series={[
            { name: 'Laki-laki', data: data.map(d => d.male) },
            { name: 'Perempuan', data: data.map(d => d.female) }
          ]}
          options={{
            xaxis: {
              categories: data.map(d => d.label),
            },
            colors: ['#3b82f6', '#ec4899'],
            plotOptions: {
              bar: {
                horizontal: true,
                dataLabels: { position: 'top' },
              }
            },
            dataLabels: {
              enabled: true,
              offsetX: -6,
              style: { fontSize: '10px', colors: ['#fff'] }
            }
          }}
          height={350}
        />
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800">Tabel Rincian Data</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-10">No</th>
                <th className="px-6 py-4">Tingkat Pendidikan</th>
                <th className="px-6 py-4 text-center">Laki-laki</th>
                <th className="px-6 py-4 text-center">Perempuan</th>
                <th className="px-6 py-4 text-center">Total</th>
                <th className="px-6 py-4 text-center">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-center">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{item.label}</td>
                  <td className="px-6 py-4 text-center">{item.male.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">{item.female.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center font-bold text-blue-600">{item.total.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    {((item.total / totalPopulation) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 font-bold text-slate-800 border-t border-slate-200">
              <tr>
                <td colSpan={2} className="px-6 py-4 text-right">Total Keseluruhan</td>
                <td className="px-6 py-4 text-center">{data.reduce((a, b) => a + b.male, 0).toLocaleString()}</td>
                <td className="px-6 py-4 text-center">{data.reduce((a, b) => a + b.female, 0).toLocaleString()}</td>
                <td className="px-6 py-4 text-center">{totalPopulation.toLocaleString()}</td>
                <td className="px-6 py-4 text-center">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
