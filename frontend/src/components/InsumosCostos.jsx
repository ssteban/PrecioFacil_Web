import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Package, Plus, X } from 'lucide-react'
import { convertirABase, formatoCOP } from '../utils/conversiones'
import {
  getCategorias,
  createCategoria,
  getInsumos,
  createInsumo,
  updateInsumo,
  deleteInsumo,
  parseInsumo,
} from '../api/insumoApi'

const UNIDADES = [
  { value: 'g', label: 'Gramos (g)' },
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'L', label: 'Litros (L)' },
  { value: 'und', label: 'Unidades (und)' },
  { value: 'COP', label: 'Pesos ($)' },
]

const INITIAL_FORM = {
  nombre: '',
  precioCompra: '',
  cantidadComercial: '',
  unidadMedida: 'g',
  categoria: 'GENERAL',
}

function buildInsumoPayload(formData) {
  let { cantidadComercial, unidadMedida } = formData
  if (!cantidadComercial) {
    cantidadComercial = Number(formData.precioCompra)
    unidadMedida = 'COP'
  } else {
    cantidadComercial = Number(cantidadComercial)
  }
  return {
    nombre_insumo: formData.nombre.trim(),
    precio_compra: Number(formData.precioCompra),
    cantidad: cantidadComercial,
    unidad_medida: unidadMedida,
    categoria: formData.categoria.toUpperCase(),
  }
}

async function refreshCategorias(setCategorias) {
  try {
    const cats = await getCategorias()
    const nombres = cats.map((c) => c.nombre.toUpperCase())
    if (!nombres.includes('GENERAL')) {
      nombres.unshift('GENERAL')
    }
    setCategorias(nombres)
  } catch {
    console.error('Error al cargar categorías')
  }
}

async function refreshInsumos(setInsumos) {
  try {
    const list = await getInsumos()
    setInsumos(list.map(parseInsumo))
  } catch {
    console.error('Error al cargar insumos')
  }
}

function InsumosCostos() {
  const { insumos, setInsumos, categorias, setCategorias } = useOutletContext()
  const [filtroCategoria, setFiltroCategoria] = useState('Todas')
  const [editandoId, setEditandoId] = useState(null)
  const [showNuevaCategoria, setShowNuevaCategoria] = useState(false)
  const [nuevaCategoria, setNuevaCategoria] = useState('')
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    refreshCategorias(setCategorias)
    refreshInsumos(setInsumos)
  }, [])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAgregarCategoria = async () => {
    const nombre = nuevaCategoria.trim()
    if (!nombre || categorias.includes(nombre)) return
    try {
      await createCategoria(nombre.toUpperCase())
      await refreshCategorias(setCategorias)
      setFormData((prev) => ({ ...prev, categoria: nombre }))
    } catch {
      setError('Error al crear categoría')
    }
    setNuevaCategoria('')
    setShowNuevaCategoria(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const { nombre, precioCompra } = formData
    if (!nombre.trim() || !precioCompra) return

    setSubmitting(true)
    try {
      const payload = buildInsumoPayload(formData)
      if (editandoId) {
        await updateInsumo(editandoId, payload)
        setEditandoId(null)
      } else {
        await createInsumo(payload)
      }
      await refreshInsumos(setInsumos)
      setFormData(INITIAL_FORM)
    } catch (err) {
      setError(err.message || 'Error al guardar insumo')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditar = (insumo) => {
    setEditandoId(insumo.id)
    setFormData({
      nombre: insumo.nombre,
      precioCompra: String(insumo.precioCompra),
      cantidadComercial: String(insumo.cantidadComercial),
      unidadMedida: insumo.unidadMedida,
      categoria: insumo.categoria,
    })
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este insumo? Esta acción no se puede deshacer.')) return
    setError('')
    setSubmitting(true)
    try {
      await deleteInsumo(id)
      await refreshInsumos(setInsumos)
      if (editandoId === id) {
        setEditandoId(null)
        setFormData(INITIAL_FORM)
      }
    } catch (err) {
      setError(err.message || 'Error al eliminar insumo')
    } finally {
      setSubmitting(false)
    }
  }

  const insumosFiltrados =
    filtroCategoria === 'Todas' ? insumos : insumos.filter((i) => i.categoria === filtroCategoria)

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-800 text-sm bg-white'

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-bold text-slate-800">Insumos y Costos</h1>
      <p className="text-slate-500 mt-1">Gestiona tu materia prima e ingredientes.</p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-5">
          {editandoId ? 'Editar Insumo' : 'Nuevo Insumo'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Insumo</label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={inputClass}
                placeholder="Ej: Harina de Trigo"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Precio de Compra</label>
              <input
                name="precioCompra"
                type="number"
                min="0"
                step="1"
                value={formData.precioCompra}
                onChange={handleChange}
                className={inputClass}
                placeholder="Ej: 3000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad Comercial</label>
              <input
                name="cantidadComercial"
                type="number"
                min="0"
                step="any"
                value={formData.cantidadComercial}
                onChange={handleChange}
                className={inputClass}
                placeholder="Opcional — se usará el valor si está vacío"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Unidad de Medida</label>
              <select
                name="unidadMedida"
                value={formData.unidadMedida}
                onChange={handleChange}
                className={inputClass}
              >
                {UNIDADES.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
            <div className="flex items-center gap-2">
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className={`${inputClass} flex-1`}
              >
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {!showNuevaCategoria ? (
                <button
                  type="button"
                  onClick={() => setShowNuevaCategoria(true)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                >
                  <Plus size={16} />
                  Añadir
                </button>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAgregarCategoria() } }}
                    className="w-32 px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Nueva categoría"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAgregarCategoria}
                    className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                  >
                    <Plus size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowNuevaCategoria(false); setNuevaCategoria('') }}
                    className="p-3 text-slate-400 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition ${
                submitting
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              {submitting ? 'Guardando...' : editandoId ? 'Actualizar Insumo' : 'Guardar Insumo'}
            </button>

            {editandoId && (
              <button
                type="button"
                onClick={() => { setEditandoId(null); setFormData(INITIAL_FORM) }}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="flex items-center justify-between mt-10 mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Listado de Insumos
          {insumos.length > 0 && (
            <span className="text-sm font-normal text-slate-400 ml-2">({insumos.length})</span>
          )}
        </h2>

        {insumos.length > 0 && (
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700"
          >
            <option value="Todas">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        )}
      </div>

      {insumosFiltrados.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Package size={48} className="mx-auto mb-4 text-slate-200" />
          <p className="text-base font-medium text-slate-500">
            {insumos.length === 0 ? 'No hay insumos registrados' : 'No hay insumos en esta categoría'}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {insumos.length === 0
              ? 'Agrega tu primer insumo usando el formulario de arriba.'
              : 'Prueba seleccionando otra categoría.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Nombre</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Categoría</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Cantidad</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Precio Compra</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Costo por Unidad</th>
                <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {insumosFiltrados.map((insumo) => {
                const unidadLabel = UNIDADES.find((u) => u.value === insumo.unidadMedida)?.label.split(' (')[0] || insumo.unidadMedida
                const { cantidadBase, unidadLabel: unidadBaseStr } = convertirABase(insumo.cantidadComercial, insumo.unidadMedida)
                const costoUnidad = insumo.precioCompra / cantidadBase
                return (
                  <tr key={insumo.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-slate-800 whitespace-nowrap">{insumo.nombre}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {insumo.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap">
                      {insumo.cantidadComercial} {unidadLabel}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap font-mono">
                      {formatoCOP(insumo.precioCompra)}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap font-mono">
                      {formatoCOP(Math.round(costoUnidad))} / {unidadBaseStr}
                    </td>
                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          onClick={() => handleEditar(insumo)}
                          className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium text-xs transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(insumo.id)}
                          className="text-red-500 hover:text-red-600 hover:underline font-medium text-xs transition"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default InsumosCostos
