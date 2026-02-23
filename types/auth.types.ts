export interface UserSettings {
  mode: 'dark' | 'light' | 'system';
  theme: string;
  language: string;
  currency: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string | null;
}

export interface AuthUser {
  [x: string]: any;
  id: string;
  email: string;
  profile: {
    firstName: string;
    lastName?: string;
    avatarUrl?: string;
  };
  settings: string;
  lastSignIn: string;
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setUser: (user: AuthUser | null) => void;
  setHasHydrated: (state: boolean) => void;
  updateSettings: (newSettings: Partial<AuthUser['settings']>) => void;
  clearAuth: () => void;
}