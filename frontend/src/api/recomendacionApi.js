import { API_URL, authHeaders } from './config'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    ...options,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Error en la solicitud')
  }
  return response.json()
}

export async function getRecomendaciones() {
  return request('/api/recomendaciones')
}
