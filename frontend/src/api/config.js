// export const API_URL = 'http://127.0.0.1:8000'
export const API_URL = 'https://precio-facil-web.vercel.app/'

export function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}
