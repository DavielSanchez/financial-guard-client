import api from "@/lib/axios";
import { Category } from "@/types/categories.types";

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get("/categories");
    return response.data;
  },

  create: async (categoryData: Omit<Category, 'id' | 'user_id' | 'created_at'>): Promise<Category> => {
    const response = await api.post("/categories", categoryData);
    return response.data;
  }
};