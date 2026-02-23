"use client"

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useAuthStore } from "@/store/use-auth-store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { settingService } from "@/services/settings.service"

export function useSettingsSync() {
  const queryClient = useQueryClient()
  const updateStore = useAuthStore((state) => state.updateSettings)

    const mutation = useMutation({
    mutationFn: (updates: Record<string, any>) => settingService.updateSettings(updates),
    onSuccess: (response, variables) => {
      // 1. Actualizamos el store global para que la UI responda
      updateStore(variables as any) 
      
      // 2. Invalidamos la cache de auth para asegurar sincronía total
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] })
    },
    
    onError: (error) => {
      console.error("Error sincronizando ajustes:", error)
      // Aquí podrías implementar un toast.error()
    }
  })

  /**
   * Función helper para llamar desde los componentes.
   * Mapea 'userName' del front a 'display_name' del backend si es necesario.
   */
  const syncSetting = (key: string, value: any) => {
    const apiKey = key === "userName" ? "display_name" : key
    mutation.mutate({ [apiKey]: value })
  }

  return {
    syncSetting,
    isUpdating: mutation.isPending,
    updateError: mutation.error
  }
}