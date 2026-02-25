"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface PopulationHistory {
  year: string;
  value: number;
}

interface ExternalData {
  success: boolean;
  source: string;
  location: {
    kalurahan: string;
    kapanewon: string;
  };
  data: PopulationHistory[];
}

export default function ExternalPopulationCard() {
  const [data, setData] = useState<ExternalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/external/sleman-population");
        const result = await response.json();
        
        if (result.success) {
          setData(result);
        } else {
          setError(result.message || "Failed to load external data");
        }
      } catch (err) {
        setError("Error connecting to external API");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-500 text-sm">Mengambil data dari GeoPortal Sleman...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex items-center justify-center min-h-[300px]">
        <div className="text-center text-red-500">
          <p className="font-semibold">Gagal memuat data eksternal</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return null;
  }

  const chartOptions: ApexOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      fontFamily: 'inherit'
    },
    colors: ['#8b5cf6'], // Violet color to distinguish from internal data
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    },
    dataLabels: { enabled: true },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      categories: data.data.map(d => d.year),
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      title: { text: 'Jumlah Penduduk' }
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 4,
    },
    title: {
      text: `Tren Populasi (Sumber: ${data.source})`,
      style: { fontSize: '16px', fontWeight: 600, color: '#334155' }
    },
    subtitle: {
      text: `${data.location.kalurahan}, ${data.location.kapanewon}`,
      style: { fontSize: '14px', color: '#64748b' }
    }
  };

  const chartSeries = [{
    name: 'Penduduk',
    data: data.data.map(d => d.value)
  }];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800">Data Pembanding Eksternal</h3>
        <p className="text-sm text-slate-500">
          Data historis dari GeoPortal Kabupaten Sleman
        </p>
      </div>
      
      <div className="h-[300px]">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="area"
          height="100%"
        />
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="text-xs text-slate-500 flex justify-between items-center">
          <span>Update Terakhir: 2019 (Sesuai API)</span>
          <a 
            href="https://geoportal.slemankab.go.id/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Buka GeoPortal &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
