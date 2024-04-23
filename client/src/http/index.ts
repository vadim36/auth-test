import axios, { InternalAxiosRequestConfig } from 'axios'

const API_URL = 'http://localhost:7000/auth'

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL
})

$api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers!.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
  return config
})

export default $api