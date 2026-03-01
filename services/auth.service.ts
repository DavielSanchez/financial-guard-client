import { AuthUser, LoginResponse } from "@/types/auth.types";
import api from "../lib/axios"

export const authService = {
  /**
   * Inicia sesión y recibe el objeto de usuario con perfil y ajustes.
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
        const { data } = await api.post<LoginResponse>("/auth/login", { email, password })
        return data
    } catch (error) {
        throw error
    }
  },

  /**
   * Registra un nuevo usuario. 
   * Nota: Agregué firstName y lastName porque tu Controller ahora los pide.
   */
  async register(payload: { email: string; password: string; firstName: string; lastName: string }) {
    const { data } = await api.post("/auth/register", payload)
    return data
  },

  async logout(): Promise<{ message: string }> {
    const { data } = await api.post("/auth/logout")
    return data
  },

  /**
   * Obtiene la sesión actual. 
   * El backend valida la cookie 'token' y retorna la data extendida.
   */
  async getMe(): Promise<AuthUser> {
    const { data } = await api.get<AuthUser>("/auth/me")
    return data
  },

  /**
   * Marca el onboarding como completado en Supabase.
   * PUT /auth/onboarding - actualiza onboarding_completed: true en el perfil del usuario.
   */
  async completeOnboarding(): Promise<AuthUser> {
    const { data } = await api.put<AuthUser>("/auth/onboarding", {})
    return data
  }
}