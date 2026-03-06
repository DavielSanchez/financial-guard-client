import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { transactionService } from '@/services/transaction.service';
import { useDashboard } from './useDashboard';
import { CreateTransaction } from '@/types/transactions.types';

export function useTransactions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { refresh: refreshDashboard } = useDashboard('Day'); // Traemos el refresh del dashboard

  const addTransaction = async (data: CreateTransaction) => {
    setLoading(true);
    setError(null);
    try {
      const result = await transactionService.create(data);
      await refreshDashboard();
      queryClient.invalidateQueries({ queryKey: ['budget', 'envelopes'] });
      return result;
    } catch (err: any) {
      const message = err.response?.data?.error || "Error al registrar la transacción";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    setLoading(true);
    try {
      await transactionService.delete(id);
      await refreshDashboard();
      queryClient.invalidateQueries({ queryKey: ['budget', 'envelopes'] });
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al eliminar");
    } finally {
      setLoading(false);
    }
  };

  return {
    addTransaction,
    deleteTransaction,
    loading,
    error
  };
}