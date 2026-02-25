import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats, DashboardStats } from "@/services/api";

export function useDashboardData() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });
}
