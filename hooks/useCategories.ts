import { useState, useEffect } from "react";
import { categoryService } from "@/services/categories.service";
import { Category } from "@/types/categories.types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (newCat: Omit<Category, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const created = await categoryService.create(newCat);
      setCategories(prev => [...prev, created]);
      return created;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "No se pudo crear la categoría");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refresh: fetchCategories, addCategory };
}