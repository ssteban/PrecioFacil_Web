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

export function parseInsumo(item) {
  return {
    id: item.id_insumo,
    nombre: item.nombre_insumo,
    precioCompra: item.precio_compra,
    cantidadComercial: item.cantidad,
    unidadMedida: item.unidad_medida,
    categoria: item.nombre_categoria,
    createdAt: item.created_at,
  }
}

export async function getCategorias() {
  return request('/api/categorias')
}

export async function createCategoria(nombre) {
  return request('/api/categorias', {
    method: 'POST',
    body: JSON.stringify({ nombre }),
  })
}

export async function deleteCategoria(id) {
  return request(`/api/categorias/${id}`, { method: 'DELETE' })
}

export async function getInsumos() {
  return request('/api/insumos')
}

export async function createInsumo(data) {
  return request('/api/insumos', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateInsumo(id, data) {
  return request(`/api/insumos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteInsumo(id) {
  return request(`/api/insumos/${id}`, { method: 'DELETE' })
}
