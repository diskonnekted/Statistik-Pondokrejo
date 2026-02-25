export interface DashboardStats {
  population: {
    total: number;
    growth: number; // percentage
    male: number;
    female: number;
  };
  facilities: {
    schools: number;
    mosques: number;
    posyandu: number;
  };
  livelihood: {
    label: string;
    value: number;
  }[];
  populationGrowth: {
    year: string;
    value: number;
  }[];
  populationPerDusun: {
    name: string;
    value: number;
  }[];
  padukuhanData?: {
    no: number;
    nama: string;
    ketua: string;
    kk: number;
    total: number;
    laki: number;
    perempuan: number;
  }[];
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch('/api/dashboard');
  if (!res.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return res.json();
}
