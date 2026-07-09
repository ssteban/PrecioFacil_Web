// export const API_URL = 'http://127.0.0.1:8000'
export const API_URL = 'https://preciofacil-web.onrender.com'

export function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}
