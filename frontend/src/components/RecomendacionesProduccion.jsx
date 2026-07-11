import { useState, useEffect } from 'react'
import { TrendingUp, Sparkles, RefreshCw, AlertCircle, BarChart3, Package } from 'lucide-react'
import { getRecomendaciones, getRecomendacion } from '../api/recomendacionApi'

function ProductCard({ producto }) {
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [error, setError] = useState(null)

  const handleCalcular = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getRecomendacion(producto.id_receta)
      setPrediction(data)
    } catch (err) {
      setError(err.message || 'Error al obtener la predicción')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-slate-800">{producto.nombre_receta}</h3>
        </div>
        <div className="p-5 flex flex-col items-center justify-center flex-1 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
          <p className="text-sm text-slate-500">Calculando predicción...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-slate-800">{producto.nombre_receta}</h3>
        </div>
        <div className="p-5 flex flex-col items-center justify-center flex-1 gap-3">
          <AlertCircle size={32} className="text-red-400" />
          <p className="text-sm text-red-600 text-center max-w-xs">{error}</p>
          <button
            onClick={handleCalcular}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <RefreshCw size={14} />
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (prediction) {
    if (prediction.cold_start) {
      return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">{producto.nombre_receta}</h3>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
                Sin datos
              </span>
            </div>
          </div>
          <div className="p-5 flex flex-col items-center justify-center flex-1 gap-3">
            <BarChart3 size={32} className="text-slate-300" />
            <p className="text-sm text-slate-500 text-center max-w-xs leading-relaxed">
              Ingresa al menos 1 día de ventas para iniciar la predicción.
            </p>
            <button
              onClick={handleCalcular}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              <RefreshCw size={14} />
              Recalcular
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">{producto.nombre_receta}</h3>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
              prediction.fase.includes('Coincidencia')
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {prediction.fase}
            </span>
          </div>
        </div>
        <div className="p-5 flex flex-col items-center justify-center flex-1">
          <span className="text-6xl md:text-7xl font-bold text-slate-800 leading-none">
            {prediction.cantidad_sugerida}
          </span>
          <span className="text-sm text-slate-400 mt-2 uppercase tracking-wider font-medium">
            Unidades Sugeridas
          </span>
          <p className="text-xs text-slate-500 text-center mt-3 max-w-xs leading-relaxed">
            {prediction.motivo}
          </p>
          <button
            onClick={handleCalcular}
            className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <RefreshCw size={14} />
            Recalcular
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-slate-800">{producto.nombre_receta}</h3>
      </div>
      <div className="p-5 flex flex-col items-center justify-center flex-1 gap-4">
        <button
          onClick={handleCalcular}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition shadow-sm"
        >
          <Sparkles size={18} />
          Calcular Predicción
        </button>
        <p className="text-xs text-slate-400 text-center">
          Haz clic para obtener la sugerencia de producción para mañana
        </p>
      </div>
    </div>
  )
}

function RecomendacionesProduccion() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRecomendaciones()
      .then(setProductos)
      .catch(() => console.error('Error al cargar recomendaciones'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="text-emerald-500" size={28} />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              Recomendaciones de Producción
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Predicción inteligente de stock para mañana
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <Package size={56} className="mx-auto mb-5 text-slate-200" />
            <p className="text-lg font-semibold text-slate-600">No tienes productos aún.</p>
            <p className="text-sm text-slate-400 mt-2">
              Crea recetas para recibir recomendaciones.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map((producto) => (
              <ProductCard key={producto.id_receta} producto={producto} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecomendacionesProduccion
