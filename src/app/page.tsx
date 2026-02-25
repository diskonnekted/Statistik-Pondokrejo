import DashboardView from "@/components/dashboard/DashboardView";

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Statistik Kalurahan Pondokrejo</h1>
        <p className="text-slate-500">
          Gambaran umum kondisi demografi, ekonomi, dan geografis Kalurahan Pondokrejo, Kapanewon Tempel, Kabupaten Sleman.
        </p>
      </div>
      <DashboardView />
    </div>
  );
}
