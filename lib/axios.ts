import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Tunnel-Skip-Anti-Phishing-Page": "true",
  },
})

// Store clearAuth for 401 handler (set by app)
let onUnauthorized: (() => void) | null = null
export function setOnUnauthorized(fn: () => void) {
  onUnauthorized = fn
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = typeof window !== "undefined" ? window.location.pathname : ""
      if (!path.includes("/login") && !path.includes("/register")) {
        onUnauthorized?.()
      }
    }
    return Promise.reject(error)
  }
)

export default api