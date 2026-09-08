import axiosInstance from "@/api/axios";
import { type DashboardResponse } from "./dashboardTypes";

export const fetchDashboardDataAPI = async (): Promise<DashboardResponse> => {
  const response = await axiosInstance.get<DashboardResponse>("/admin/dashboard");
  return response.data;
};