"use client"

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { authService } from "@/services/auth.service"
import { useAuthStore } from "@/store/use-auth-store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()
  
  // 1. Bandera para saber si ya estamos en el cliente
  const [mounted, setMounted] = useState(false)
  
  const { user, setUser, clearAuth, isAuthenticated } = useAuthStore()

  // Se ejecuta solo una vez al montar el componente en el navegador
  useEffect(() => {
    setMounted(true)
  }, [])

  const { 
    data: serverUser, 
    isLoading: isCheckingAuth, 
    isError 
  } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: authService.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
    // Solo ejecutamos la query si estamos montados
    enabled: mounted, 
  })

  useEffect(() => {
    if (serverUser) {
      setUser(serverUser)
    } else if (isError) {
      clearAuth()
    }
  }, [serverUser, isError, setUser, clearAuth])

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: any) => {
      console.log("Intentando login en:", process.env.NEXT_PUBLIC_API_URL);
      return authService.login(email, password);
    },
    onSuccess: (data) => {
      setUser(data.user)
      queryClient.setQueryData(["auth", "user"], data.user)
      router.push("/dashboard")
    },
    onError: (error) => {
      console.log("Mutation catch: Error de autenticación esperado.");
    }
  })

  const registerMutation = useMutation({
    mutationFn: (payload: any) => authService.register(payload),
    onSuccess: () => {
      router.push("/login?registered=true")
    },
  })

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      clearAuth()
      queryClient.clear()
      router.push("/login")
    }
  }

  // 2. Si no está montado (SSR), devolvemos un estado "vacío" controlado
  // Esto evita que React vea diferencias entre lo que envió el servidor y el primer render del cliente
  if (!mounted) {
    return {
      user: null,
      isAuthenticated: false,
      isLoading: true,
      isError: false,
      login: loginMutation.mutateAsync,
      register: registerMutation.mutateAsync,
      logout,
      loginError: null,
      registerError: null
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading: isCheckingAuth || loginMutation.isPending || registerMutation.isPending,
    isError,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    loginError: loginMutation.error,
    registerError: registerMutation.error
  }
}