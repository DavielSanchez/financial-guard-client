import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AuthState } from '@/types/auth.types'



export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),

      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),

      updateSettings: (newSettings) => set((state) => ({
        user: state.user 
          ? { ...state.user, settings: { ...state.user.settings, ...newSettings } }
          : null
      })),

      clearAuth: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'fg-auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)