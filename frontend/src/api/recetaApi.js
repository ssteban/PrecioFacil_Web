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

export function parseReceta(r) {
  return {
    id: r.id_receta,
    nombre: r.nombre_receta,
    porcentajeGanancia: r.porcentaje_ganancia,
    unidadesProducidas: r.produccion,
    ingredientes: r.ingredientes.map((ing) => ({
      id: ing.id_insumo,
      nombre: ing.nombre_insumo,
      cantidadUsada: ing.cantidad_usada,
      costoParcial: ing.costo_parcial,
    })),
    totales: {
      costoUnitario: r.costo_unidad,
      precioVentaUnitario: r.precio_unidad,
      gananciaUnitaria: r.ganancia_unidad,
      costoTotalLote: r.total_costo,
    },
    createdAt: r.created_at,
  }
}

export async function createReceta(data) {
  return request('/api/recetas', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateReceta(id, data) {
  return request(`/api/recetas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function getRecetas() {
  return request('/api/recetas')
}

export async function getReceta(id) {
  return request(`/api/recetas/${id}`)
}

export async function deleteReceta(id) {
  return request(`/api/recetas/${id}`, { method: 'DELETE' })
}
