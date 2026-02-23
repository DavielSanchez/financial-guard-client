import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  withCredentials: true, // Vital para las cookies
  headers: {
    "Content-Type": "application/json",
    "X-Tunnel-Skip-Anti-Phishing-Page": "true",
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo redirigimos si NO estamos ya en la página de login
    // y si el error es 401
    if (error.response?.status === 401) {
      const isLoginPage = typeof window !== "undefined" && window.location.pathname === "/login";
      
      if (!isLoginPage) {
        // Solo aquí limpiamos y redirigimos
        // window.location.href = "/login" 
      }
    }
    return Promise.reject(error)
  }
)

export default api