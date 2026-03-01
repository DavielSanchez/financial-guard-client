import axios from "axios"

const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://financialguard-api.davielsanchez.com/api"
const api = axios.create({
  baseURL: baseURL.replace(/\/$/, ""),
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
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname
      if (!path.includes("/login") && !path.includes("/register")) {
        onUnauthorized?.()
      }
    }
    return Promise.reject(error)
  }
)

export default api