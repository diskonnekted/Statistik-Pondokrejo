import { NextResponse } from "next/server";
import { fetchOpenSIDStatistik } from "@/lib/api-helpers";
import { DATA_PADUKUHAN, TOTAL_PENDUDUK } from "@/lib/data-padukuhan";

export async function GET() {
  // Use the helper to try fetching real data if possible, otherwise fallback to mock
  // Using user provided valid data as fallback/default
  const populationResponse = await fetchOpenSIDStatistik("/internal_api/statistik/penduduk", {
    cacheTags: ["opensid-data-penduduk"],
    fallbackData: {
        totalPenduduk: TOTAL_PENDUDUK.total,
        lakiLaki: TOTAL_PENDUDUK.laki,
        perempuan: TOTAL_PENDUDUK.perempuan,
        growth: 1.2
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const popData = (populationResponse.success ? populationResponse.data : populationResponse.data) as any;

  // Transform Padukuhan data for chart
  const padukuhanChartData = DATA_PADUKUHAN.map(d => ({
      name: d.nama.replace("Padukuhan ", ""),
      value: d.total
  }));

  // Construct the full dashboard response
  const dashboardData = {
    population: {
        total: TOTAL_PENDUDUK.total, // Force use valid data
        growth: popData?.growth || 1.2,
        male: TOTAL_PENDUDUK.laki, // Force use valid data
        female: TOTAL_PENDUDUK.perempuan, // Force use valid data
    },
    facilities: {
        schools: 8,
        mosques: 15,
        posyandu: 9,
    },
    livelihood: [
        { label: "Petani", value: 45 },
        { label: "Pedagang", value: 20 },
        { label: "PNS/TNI/Polri", value: 10 },
        { label: "Wiraswasta", value: 15 },
        { label: "Lainnya", value: 10 },
    ],
    populationGrowth: [
        { year: "2019", value: 6000 },
        { year: "2020", value: 6150 },
        { year: "2021", value: 6200 },
        { year: "2022", value: 6250 },
        { year: "2023", value: 6309 },
    ],
    populationPerDusun: padukuhanChartData,
    padukuhanData: DATA_PADUKUHAN // Pass raw data for table
  };

  return NextResponse.json(dashboardData);
}
