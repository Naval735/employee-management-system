import api from './api';
import { DashboardSummary } from '../types/dashboard.types';

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get<DashboardSummary>('/dashboard/summary');
    return response.data;
  },
};

export default dashboardService;
