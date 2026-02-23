import { useState, useEffect, useCallback } from 'react';
import { DashboardService } from '@/services/dashboard.service';
import { DashboardResponse } from '@/types/dashboard.types';

export const useDashboard = (period: string) => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await DashboardService.getSummary(period);
      setData(stats);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    data,
    loading,
    error,
    refresh: fetchStats // Para permitir "pull to refresh" o recargar tras una acción
  };
};