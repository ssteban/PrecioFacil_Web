import { useState, useMemo, useEffect } from 'react'
import { useOutletContext, useLocation } from 'react-router-dom'
import { Search, Package, Plus, X, Trash2, ClipboardList, CheckCircle2, Lock, TrendingUp, ChevronRight } from 'lucide-react'
import { convertirABase, formatoCOP } from '../utils/conversiones'
import { createReceta, updateReceta, getRecetas, parseReceta } from '../api/recetaApi'
import { createInsumo, getInsumos, parseInsumo } from '../api/insumoApi'

function CreadorRecetas() {
  const { insumos, setInsumos, categorias, recetas, setRecetas } = useOutletContext()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const plan = (user.plan || 'FREE').toLowerCase()
  const limiteRecetas = user.limite_recetas_total || 5

  const [showLimiteModal, setShowLimiteModal] = useState(false)
  const [receta, setReceta] = useState({ nombre: '', porcentajeGanancia: 50, unidadesProducidas: 1 })
  const [ingredientes, setIngredientes] = useState([])
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submittingInsumo, setSubmittingInsumo] = useState(false)
  const [error, setError] = useState('')
  const [recetaEditandoId, setRecetaEditandoId] = useState(null)
  const haAlcanzadoLimite = recetas.length >= limiteRecetas && !recetaEditandoId

  const [busqueda, setBusqueda] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [categoriaActiva, setCategoriaActiva] = useState('GENERAL')
  const [showNuevoInsumoModal, setShowNuevoInsumoModal] = useState(false)
  const [nuevoInsumoForm, setNuevoInsumoForm] = useState({
    nombre: '', precioCompra: '', cantidadComercial: '', unidadMedida: 'g', categoria: 'GENERAL',
  })

  useEffect(() => {
    const editData = location.state?.recetaEditar
    if (!editData) return

    setReceta({
      nombre: editData.nombre,
      porcentajeGanancia: editData.porcentajeGanancia,
      unidadesProducidas: editData.unidadesProducidas,
    })
    setRecetaEditandoId(editData.id)

    const nuevosIngredientes = editData.ingredientes.map((ing) => {
      const insumoCompleto = insumos.find((i) => i.id === ing.id)
      if (insumoCompleto) {
        const { cantidadBase, unidadLabel } = convertirABase(
          insumoCompleto.cantidadComercial, insumoCompleto.unidadMedida
        )
        return {
          insumoId: insumoCompleto.id,
          nombre: insumoCompleto.nombre,
          cantidadComercial: insumoCompleto.cantidadComercial,
          cantidadUsar: ing.cantidadUsada,
          unidadBaseStr: unidadLabel,
          costoUnidadBase: insumoCompleto.precioCompra / cantidadBase,
          costoParcial: ing.costoParcial,
        }
      }
      return {
        insumoId: ing.id,
        nombre: ing.nombre || `Insumo #${ing.id}`,
        cantidadComercial: 0,
        cantidadUsar: ing.cantidadUsada,
        unidadBaseStr: '',
        costoUnidadBase: ing.cantidadUsada > 0 ? ing.costoParcial / ing.cantidadUsada : 0,
        costoParcial: ing.costoParcial,
      }
    })
    setIngredientes(nuevosIngredientes)

    window.history.replaceState({}, document.title)
  }, [location.state])

  const insumosFiltradosBusqueda = busqueda.trim()
    ? insumos.filter((i) => i.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    : []

  const agregarInsumoAReceta = (insumo) => {
    if (ingredientes.some((ing) => ing.insumoId === insumo.id)) return

    const { cantidadBase, unidadLabel } = convertirABase(insumo.cantidadComercial, insumo.unidadMedida)
    const costoUnidadBase = Math.round(insumo.precioCompra / cantidadBase)

    setIngredientes((prev) => [
      ...prev,
      {
        insumoId: insumo.id,
        nombre: insumo.nombre,
        cantidadComercial: insumo.cantidadComercial,
        cantidadUsar: 0,
        unidadBaseStr: unidadLabel,
        costoUnidadBase,
        costoParcial: 0,
      },
    ])
  }

  const handleSeleccionarBusqueda = (insumo) => {
    agregarInsumoAReceta(insumo)
    setBusqueda('')
    setShowDropdown(false)
  }

  const handleCantidadChange = (insumoId, nuevaCantidad) => {
    const cant = Number(nuevaCantidad)
    setIngredientes((prev) =>
      prev.map((ing) =>
        ing.insumoId === insumoId
          ? { ...ing, cantidadUsar: cant, costoParcial: cant * ing.costoUnidadBase }
          : ing
      )
    )
  }

  const handleEliminarIngrediente = (insumoId) => {
    setIngredientes((prev) => prev.filter((ing) => ing.insumoId !== insumoId))
  }

  const handleToggleSeleccion = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleAddSelectedFromModal = () => {
    insumos
      .filter((i) => selectedIds.has(i.id))
      .forEach((i) => agregarInsumoAReceta(i))
    setSelectedIds(new Set())
    setModalOpen(false)
  }

  const handleGuardarNuevoInsumo = async (e) => {
    e.preventDefault()
    const { nombre, precioCompra } = nuevoInsumoForm
    if (!nombre.trim() || !precioCompra) return

    setSubmittingInsumo(true)
    try {
      let { cantidadComercial, unidadMedida } = nuevoInsumoForm
      if (!cantidadComercial) {
        cantidadComercial = Number(precioCompra)
        unidadMedida = 'COP'
      } else {
        cantidadComercial = Number(cantidadComercial)
      }

      const payload = {
        nombre_insumo: nombre.trim(),
        precio_compra: Number(precioCompra),
        cantidad: cantidadComercial,
        unidad_medida: unidadMedida,
        categoria: nuevoInsumoForm.categoria.toUpperCase(),
      }

      await createInsumo(payload)
      const refreshed = await getInsumos()
      const parsed = refreshed.map(parseInsumo)
      setInsumos(parsed)

      const nuevo = parsed.find((i) => i.nombre === nombre.trim())
      if (nuevo) agregarInsumoAReceta(nuevo)

      setShowNuevoInsumoModal(false)
      setNuevoInsumoForm({ nombre: '', precioCompra: '', cantidadComercial: '', unidadMedida: 'g', categoria: 'GENERAL' })
    } catch (err) {
      alert(err.message)
    } finally {
      setSubmittingInsumo(false)
    }
  }

  const handleGuardarReceta = async () => {
    if (!receta.nombre.trim()) {
      alert('Debes ingresar un nombre para la receta.')
      return
    }
    if (ingredientes.length === 0) {
      alert('Debes agregar al menos un ingrediente a la receta.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const payload = {
        nombre_receta: receta.nombre,
        porcentaje_ganancia: receta.porcentajeGanancia,
        produccion: receta.unidadesProducidas,
        costo_unidad: Math.round(costoUnitario),
        precio_unidad: Math.round(precioUnitario),
        ganancia_unidad: Math.round(gananciaUnitaria),
        total_costo: costoTotal,
        total_unidad: receta.unidadesProducidas,
        total_ganancia: Math.round(gananciaNeta),
        ingredientes: ingredientes.map((ing) => ({
          id_insumo: ing.insumoId,
          cantidad_usada: ing.cantidadUsar,
          costo_parcial: ing.costoParcial,
        })),
      }
      if (recetaEditandoId) {
        await updateReceta(recetaEditandoId, payload)
      } else {
        await createReceta(payload)
      }
      const list = await getRecetas()
      setRecetas(list.map(parseReceta))
      setIsSuccessModalOpen(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const resetFormulario = () => {
    setReceta({ nombre: '', porcentajeGanancia: 50, unidadesProducidas: 1 })
    setIngredientes([])
    setIsSuccessModalOpen(false)
    setRecetaEditandoId(null)
  }

  const insumosEnCategoria = insumos.filter((i) => i.categoria === categoriaActiva)

  const costoTotal = useMemo(
    () => ingredientes.reduce((sum, ing) => sum + ing.costoParcial, 0),
    [ingredientes]
  )

  const precioVentaSugerido = useMemo(
    () => costoTotal * (1 + receta.porcentajeGanancia / 100),
    [costoTotal, receta.porcentajeGanancia]
  )

  const gananciaNeta = useMemo(
    () => precioVentaSugerido - costoTotal,
    [precioVentaSugerido, costoTotal]
  )

  const unidades = receta.unidadesProducidas

  const costoUnitario = useMemo(
    () => (unidades > 0 ? costoTotal / unidades : 0),
    [costoTotal, unidades]
  )

  const precioUnitario = useMemo(
    () => (unidades > 0 ? precioVentaSugerido / unidades : 0),
    [precioVentaSugerido, unidades]
  )

  const gananciaUnitaria = useMemo(
    () => (unidades > 0 ? gananciaNeta / unidades : 0),
    [gananciaNeta, unidades]
  )

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-800 text-sm bg-white'

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-bold text-slate-800">Creador de Recetas</h1>
      <p className="text-slate-500 mt-1">Diseña tus productos y calcula su costo real.</p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-5">Información de la Receta</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Producto / Receta</label>
            <input
              value={receta.nombre}
              onChange={(e) => setReceta((prev) => ({ ...prev, nombre: e.target.value }))}
              className={inputClass}
              placeholder="Ej: Pastel de Chocolate"
            />
          </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Porcentaje de Ganancia Deseado</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={receta.porcentajeGanancia}
                  onChange={(e) => setReceta((prev) => ({ ...prev, porcentajeGanancia: Number(e.target.value) }))}
                  className={`${inputClass} pr-8`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Unidades / Porciones Producidas</label>
              <input
                type="number"
                min="1"
                step="1"
                value={receta.unidadesProducidas}
                onChange={(e) => setReceta((prev) => ({ ...prev, unidadesProducidas: Math.max(1, Number(e.target.value)) }))}
                className={inputClass}
              />
            </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Agregar Ingredientes</h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setShowDropdown(true) }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              className={`${inputClass} pl-9`}
              placeholder="Buscar insumo por nombre..."
            />
            {showDropdown && busqueda.trim() && insumosFiltradosBusqueda.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                {insumosFiltradosBusqueda.map((insumo) => (
                  <button
                    key={insumo.id}
                    type="button"
                    onMouseDown={() => handleSeleccionarBusqueda(insumo)}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left text-slate-700 hover:bg-emerald-50 transition"
                  >
                    <Package size={16} className="text-slate-400 shrink-0" />
                    <span className="font-medium">{insumo.nombre}</span>
                    <span className="text-xs text-slate-400 ml-auto">{insumo.categoria}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => { setModalOpen(true); setCategoriaActiva(categorias[0]) }}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition"
          >
            <Package size={16} />
            Ver Despensa
          </button>
          <button
            type="button"
            onClick={() => setShowNuevoInsumoModal(true)}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition"
          >
            <Plus size={16} />
            Nuevo Insumo
          </button>
        </div>
      </div>

      {ingredientes.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Ingredientes de la Receta
            <span className="text-sm font-normal text-slate-400 ml-2">({ingredientes.length})</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Insumo</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Cantidad a Usar</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Unidad</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Costo Parcial</th>
                  <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ingredientes.map((ing) => (
                  <tr key={ing.insumoId} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="px-4 py-3.5 text-sm font-medium text-slate-800 whitespace-nowrap">{ing.nombre}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={ing.cantidadUsar || ''}
                          onChange={(e) => handleCantidadChange(ing.insumoId, e.target.value)}
                          className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                          placeholder="0"
                        />
                        {ing.cantidadComercial > 0 && (
                          <button
                            type="button"
                            onClick={() => handleCantidadChange(ing.insumoId, ing.cantidadComercial)}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 shadow-sm transition-all whitespace-nowrap"
                          >
                            Usar todo
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-600">{ing.unidadBaseStr}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 font-mono">
                      {formatoCOP(ing.costoParcial)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleEliminarIngrediente(ing.insumoId)}
                        className="text-red-400 hover:text-red-600 transition p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {ingredientes.length > 0 && (
        <>
          <div className="mt-6 bg-slate-800 rounded-2xl p-6 text-white grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Costo por Unidad</p>
              <p className="text-3xl font-bold mt-1 text-white">{formatoCOP(Math.round(costoUnitario))}</p>
              <p className="text-xs text-slate-500 mt-1">Total lote: {formatoCOP(costoTotal)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Precio por Unidad</p>
              <p className="text-3xl font-bold mt-1 text-emerald-400">{formatoCOP(Math.round(precioUnitario))}</p>
              <p className="text-xs text-slate-500 mt-1">Total lote: {formatoCOP(precioVentaSugerido)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Ganancia por Unidad</p>
              <p className="text-3xl font-bold mt-1 text-emerald-400">{formatoCOP(Math.round(gananciaUnitaria))}</p>
              <p className="text-xs text-slate-500 mt-1">Total lote: {formatoCOP(gananciaNeta)}</p>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg mt-4">{error}</p>
          )}

          <div className="flex justify-end mt-6">
            {haAlcanzadoLimite ? (
              <button
                onClick={() => setShowLimiteModal(true)}
                className="px-8 py-3 font-bold text-lg rounded-xl transition shadow-lg bg-slate-300 text-slate-500 cursor-not-allowed flex items-center gap-2"
              >
                <Lock size={18} />
                Límite alcanzado
              </button>
            ) : (
              <button
                onClick={handleGuardarReceta}
                disabled={submitting}
                className={`px-8 py-3 font-bold text-lg rounded-xl transition shadow-lg ${
                  submitting
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                {submitting ? 'Guardando...' : 'Guardar Receta'}
              </button>
            )}
          </div>
        </>
      )}

      {ingredientes.length === 0 && (
        <div className="text-center py-16 mt-6 bg-white rounded-2xl border border-gray-200">
          <ClipboardList size={48} className="mx-auto mb-4 text-slate-200" />
          <p className="text-base font-medium text-slate-500">Aún no has agregado ingredientes</p>
          <p className="text-sm text-slate-400 mt-1">
            Usa el buscador predictivo o el botón "Ver Despensa" para añadir insumos a tu receta.
          </p>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[75vh] flex flex-col overflow-hidden z-10">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <h3 className="text-base font-semibold text-slate-800">Seleccionar de la Despensa</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 transition">
                <X size={18} className="text-slate-500" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <div className="w-44 bg-gray-50 border-r border-gray-200 p-2 space-y-0.5 overflow-y-auto shrink-0">
                {categorias.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategoriaActiva(cat); setSelectedIds(new Set()) }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      categoriaActiva === cat ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex-1 p-3 overflow-y-auto">
                {insumosEnCategoria.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No hay insumos en esta categoría.</p>
                ) : (
                  <div className="space-y-0.5">
                    {insumosEnCategoria.map((insumo) => {
                      const yaAgregado = ingredientes.some((ing) => ing.insumoId === insumo.id)
                      return (
                        <label
                          key={insumo.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition ${
                yaAgregado ? 'bg-slate-50 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.has(insumo.id)}
                            disabled={yaAgregado}
                            onChange={() => handleToggleSeleccion(insumo.id)}
                            className="w-3.5 h-3.5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800">{insumo.nombre}</p>
                            <p className="text-xs text-slate-400">
                              {insumo.cantidadComercial}{' '}
                              {insumo.unidadMedida === 'g' ? 'gramos'
                                : insumo.unidadMedida === 'kg' ? 'kg'
                                : insumo.unidadMedida === 'ml' ? 'mililitros'
                                : insumo.unidadMedida === 'L' ? 'litros'
                                : 'unidades'} — {formatoCOP(insumo.precioCompra)}
                            </p>
                          </div>
                          {yaAgregado && (
                            <span className="text-xs text-slate-400 font-medium">Ya agregado</span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-slate-500">
                {selectedIds.size} insumo{selectedIds.size !== 1 ? 's' : ''} seleccionado{selectedIds.size !== 1 ? 's' : ''}
              </p>
              <button
                onClick={handleAddSelectedFromModal}
                disabled={selectedIds.size === 0}
                className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Añadir seleccionados
              </button>
            </div>
          </div>
        </div>
      )}

      {showNuevoInsumoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dynamic-blur"
          onClick={() => setShowNuevoInsumoModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-slate-800">Nuevo Insumo</h3>
              <button onClick={() => setShowNuevoInsumoModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGuardarNuevoInsumo} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre del Insumo</label>
                  <input
                    value={nuevoInsumoForm.nombre}
                    onChange={(e) => setNuevoInsumoForm((prev) => ({ ...prev, nombre: e.target.value }))}
                    className={inputClass}
                    placeholder="Ej: Harina de Trigo"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Precio de Compra ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={nuevoInsumoForm.precioCompra}
                    onChange={(e) => setNuevoInsumoForm((prev) => ({ ...prev, precioCompra: e.target.value }))}
                    className={inputClass}
                    placeholder="Ej: 3000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Cantidad Comercial</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={nuevoInsumoForm.cantidadComercial}
                    onChange={(e) => setNuevoInsumoForm((prev) => ({ ...prev, cantidadComercial: e.target.value }))}
                    className={inputClass}
                    placeholder="Opcional — se usará el valor si está vacío"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Unidad de Medida</label>
                  <select
                    value={nuevoInsumoForm.unidadMedida}
                    onChange={(e) => setNuevoInsumoForm((prev) => ({ ...prev, unidadMedida: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="g">Gramos (g)</option>
                    <option value="kg">Kilogramos (kg)</option>
                    <option value="ml">Mililitros (ml)</option>
                    <option value="L">Litros (L)</option>
                    <option value="und">Unidades (und)</option>
                    <option value="COP">Pesos ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Categoría</label>
                  <select
                    value={nuevoInsumoForm.categoria}
                    onChange={(e) => setNuevoInsumoForm((prev) => ({ ...prev, categoria: e.target.value }))}
                    className={inputClass}
                  >
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowNuevoInsumoModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition shadow-sm"
                >
                  Guardar e Insertar en Receta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLimiteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dynamic-blur"
          onClick={() => setShowLimiteModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-br from-amber-500 to-amber-700 px-6 pt-8 pb-10 text-center">
              <button
                onClick={() => setShowLimiteModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <Lock size={40} className="mx-auto text-white mb-3" />
              <h2 className="text-xl font-bold text-white">
                Has alcanzado el límite de recetas
              </h2>
              <p className="text-amber-100 text-sm mt-2">
                Tu plan {plan === 'premium' ? 'Premium' : 'Free'} permite hasta {limiteRecetas} recetas
              </p>
            </div>

            <div className="px-6 py-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-amber-100 rounded-lg p-2 shrink-0">
                  <TrendingUp size={18} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {plan === 'premium' ? 'Amplía tu capacidad' : 'Actualiza a Premium'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {plan === 'premium'
                      ? 'Compra paquetes adicionales para seguir creando más recetas.'
                      : 'Desbloquea recetas ilimitadas y predicciones avanzadas con Costly Premium.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => setShowLimiteModal(false)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-200"
              >
                {plan === 'premium' ? 'Ver planes disponibles' : 'Actualizar a Premium'}
                <ChevronRight size={18} />
              </button>
              <button
                onClick={() => setShowLimiteModal(false)}
                className="w-full text-sm text-slate-500 hover:text-slate-700 py-2 mt-2 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuccessModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dynamic-blur"
          onClick={resetFormulario}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={36} className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 text-center">
              ¡Receta {recetaEditandoId ? 'Actualizada' : 'Guardada'} Exitosamente!
            </h3>
            <p className="text-sm text-slate-600 text-center mt-2">
              El producto '<span className="font-semibold">{receta.nombre}</span>' se ha {recetaEditandoId ? 'actualizado' : 'registrado'} en tu
              historial con un precio de venta sugerido de{' '}
              <span className="font-semibold">{formatoCOP(Math.round(precioUnitario))}</span> por unidad.
            </p>
            <button
              type="button"
              onClick={resetFormulario}
              className="block mx-auto mt-6 px-6 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreadorRecetas
