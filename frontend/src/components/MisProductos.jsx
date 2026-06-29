import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { Search, Trash2, Package } from 'lucide-react'
import { formatoCOP } from '../utils/conversiones'

function MisProductos() {
  const { recetas, setRecetas } = useOutletContext()
  const [busqueda, setBusqueda] = useState('')

  const recetasFiltradas = recetas.filter((r) =>
    r.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const handleEliminar = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return
    setRecetas((prev) => prev.filter((r) => r.id !== id))
  }

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-800 text-sm bg-white'

  if (recetas.length === 0) {
    return (
      <div className="max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-800">Mis Productos</h1>
        <p className="text-slate-500 mt-1">Consulta y administra tus productos registrados.</p>

        <div className="text-center py-20 mt-8 bg-white rounded-2xl border border-gray-200">
          <Package size={56} className="mx-auto mb-5 text-slate-200" />
          <p className="text-lg font-semibold text-slate-600">Aún no tienes productos guardados.</p>
          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
            ¡Ve al Creador de Recetas para costear tu primer producto!
          </p>
          <Link
            to="/dashboard/recetas"
            className="inline-block mt-6 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition shadow-sm"
          >
            Ir al Creador de Recetas
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Mis Productos</h1>
          <p className="text-slate-500 mt-1">
            {recetas.length} producto{recetas.length !== 1 ? 's' : ''} registrado{recetas.length !== 1 ? 's' : ''}.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className={`${inputClass} pl-9`}
            placeholder="Buscar por nombre..."
          />
        </div>
      </div>

      {recetasFiltradas.length === 0 ? (
        <div className="text-center py-16 mt-8 bg-white rounded-2xl border border-gray-200">
          <Search size={40} className="mx-auto mb-4 text-slate-300" />
          <p className="text-base font-medium text-slate-500">No se encontraron productos con ese nombre.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {recetasFiltradas.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800">{r.nombre}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Rendimiento: {r.unidadesProducidas} und
                </p>

                <hr className="my-3 border-slate-100" />

                <p className="text-sm text-slate-500">
                  Costo:{' '}
                  <span className="font-mono">{formatoCOP(r.totales.costoUnitario)}</span> / und
                </p>
                <p className="text-lg font-bold text-emerald-500 mt-1">
                  {formatoCOP(r.totales.precioVentaUnitario)}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Ganancia: <span className="font-mono">{formatoCOP(r.totales.gananciaUnitaria)}</span> / und
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => alert(`Detalle de "${r.nombre}" — próximo módulo.`)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Ver Detalle
                </button>
                <button
                  type="button"
                  onClick={() => handleEliminar(r.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 transition text-red-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MisProductos