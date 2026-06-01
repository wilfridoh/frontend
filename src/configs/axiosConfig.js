'use client'

import axios from 'axios'

const axiosIntance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:44311/api'
})

axiosIntance.interceptors.request.use(
  (config) => {
    if (typeof window === 'undefined') {
      const token = localStorage.getItem('accesoToken')

      if (token != null && token != undefined) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default axiosIntance
