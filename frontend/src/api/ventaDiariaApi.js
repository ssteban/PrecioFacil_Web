import { API_URL } from './config'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Error en la solicitud')
  }
  return response.json()
}

export async function createVentaDiaria(data) {
  return request('/api/ventas-diarias', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getVentasDiarias() {
  return request('/api/ventas-diarias')
}

export async function getVentasDiariasPorReceta(idReceta) {
  return request(`/api/ventas-diarias/receta/${idReceta}`)
}
