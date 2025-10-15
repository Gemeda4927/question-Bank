import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 15000, // Added 15 second timeout for better UX
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error("[v0] Network error:", error.message)
      return Promise.reject({
        message: "Network error. Please check your connection.",
        status: 0,
      })
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("student")
        window.location.href = "/login"
      }
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      console.error("[v0] Server error:", error.response.status)
      return Promise.reject({
        message: "Server error. Please try again later.",
        status: error.response.status,
      })
    }

    return Promise.reject(error)
  },
)

export default api
