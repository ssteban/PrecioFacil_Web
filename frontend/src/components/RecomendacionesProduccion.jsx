import { useState, useEffect } from 'react'
import { TrendingUp, Construction } from 'lucide-react'
import { getRecomendaciones } from '../api/recomendacionApi'

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
          <div className="text-center py-20">
            <Construction size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No tienes productos aún.</p>
            <p className="text-slate-400 text-sm mt-1">Crea recetas para recibir recomendaciones.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map((producto) => (
              <div
                key={producto.id_receta}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
              >
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-800">
                      {producto.nombre_receta}
                    </h3>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
                      En Desarrollo
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col items-center justify-center flex-1 gap-4">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                    <Construction size={32} className="text-amber-500" />
                  </div>
                  <p className="text-sm text-slate-500 text-center max-w-xs leading-relaxed">
                    {producto.mensaje}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecomendacionesProduccion
