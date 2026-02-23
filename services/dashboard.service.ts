import api from '@/lib/axios';
import { DashboardResponse } from '@/types/dashboard.types';


export const DashboardService = {
  /**
   * Obtiene las estadísticas del dashboard filtradas por periodo
   * @param period 'Day' | 'Week' | 'Month' | 'Year'
   */
  async getSummary(period: string): Promise<DashboardResponse> {
    try {
      const { data } = await api.get<DashboardResponse>(`/dashboard/summary`, {
        params: { period }
      });
      return data;
    } catch (error: any) {
      console.error('Error in DashboardService.getSummary:', error);
      throw error.response?.data || new Error('Failed to fetch dashboard summary');
    }
  },

  // Aquí podrías agregar getCategoriesStats en el futuro
};