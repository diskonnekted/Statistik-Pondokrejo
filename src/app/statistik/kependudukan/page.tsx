
import { readStandardStatsExcel } from "@/lib/excel-helper";
import { StatisticalCard } from "@/components/charts/StatisticalCard";

export const revalidate = 3600; // Revalidate every hour

export default async function KependudukanPage() {
  // Read data directly from Excel files in public folder
  const genderData = readStandardStatsExcel("statistik_penduduk_24_02_2026_jenis_kelamin.xls");
  const ageData = readStandardStatsExcel("statistik_penduduk_24_02_2026 rentang_umur.xls");
  const religionData = readStandardStatsExcel("statistik_penduduk_24_02_2026_agama.xls");

  // --- Process Gender Data ---
  // Filter only Laki-laki and Perempuan rows for the chart
  const validGenderData = genderData.filter(item => 
    ["LAKI-LAKI", "PEREMPUAN"].includes(item.label.toUpperCase())
  );
  const genderSeries = validGenderData.map(item => item.total);
  const genderLabels = validGenderData.map(item => item.label);

  // --- Process Age Data ---
  // Sort by ID or keep original order
  const ageSeries = [{
    name: "Jumlah",
    data: ageData.map(item => item.total)
  }];
  const ageCategories = ageData.map(item => item.label);

  // --- Process Religion Data ---
  // Filter out zero values for cleaner pie chart
  const activeReligionData = religionData.filter(item => item.total > 0);
  const religionSeries = activeReligionData.map(item => item.total);
  const religionLabels = activeReligionData.map(item => item.label);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-800">Statistik Kependudukan</h1>
        <p className="text-slate-500">
          Data demografi penduduk Kalurahan Pondokrejo berdasarkan Jenis Kelamin, Rentang Umur, dan Agama.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jenis Kelamin */}
        <StatisticalCard
          title="Komposisi Jenis Kelamin"
          type="pie"
          series={genderSeries}
          options={{
            labels: genderLabels,
            colors: ["#3b82f6", "#ec4899"], // Blue for Male, Pink for Female
            legend: { position: 'bottom' },
            dataLabels: { enabled: true }
          }}
          formatDataLabel="percentage"
          className="min-h-[400px]"
        />

        {/* Agama */}
        <StatisticalCard
          title="Distribusi Agama"
          type="pie"
          series={religionSeries}
          options={{
            labels: religionLabels,
            colors: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#6366f1"],
            legend: { position: 'bottom' }
          }}
          className="min-h-[400px]"
        />

        {/* Rentang Umur */}
        <StatisticalCard
          title="Distribusi Rentang Umur"
          type="bar"
          series={ageSeries}
          options={{
            xaxis: { 
              categories: ageCategories,
              labels: {
                style: { fontSize: '12px' },
                rotate: -45
              }
            },
            plotOptions: {
              bar: {
                borderRadius: 4,
                horizontal: false, // Vertical bars are better for age ranges
                columnWidth: '60%'
              }
            },
            colors: ["#3b82f6"],
            dataLabels: { enabled: false }
          }}
          className="lg:col-span-2 min-h-[500px]"
        />
      </div>

      {/* Detailed Tables Section (Optional but good for accessibility/detail) */}
      <div className="grid grid-cols-1 gap-8">
        {/* We can add tables here if needed, but charts might be enough for now as per request "masukkan dalam halaman statistik" */}
      </div>
    </div>
  );
}
