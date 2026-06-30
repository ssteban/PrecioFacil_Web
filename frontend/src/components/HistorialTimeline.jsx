import { useState, useEffect } from 'react'
import { X, CalendarDays, TrendingUp, AlertTriangle } from 'lucide-react'
import { getVentasDiariasPorReceta } from '../api/ventaDiariaApi'
import { formatoCOP } from '../utils/conversiones'

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const DIAS_SEMANA = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado',
]

function formatearFechaLegible(fechaStr) {
  const [y, m, d] = fechaStr.split('-').map(Number)
  const fecha = new Date(y, m - 1, d)
  const hoy = new Date()
  const ayer = new Date()
  ayer.setDate(ayer.getDate() - 1)

  const esHoy =
    y === hoy.getFullYear() && m === hoy.getMonth() + 1 && d === hoy.getDate()
  const esAyer =
    y === ayer.getFullYear() && m === ayer.getMonth() + 1 && d === ayer.getDate()

  const prefijo = esHoy ? 'Hoy' : esAyer ? 'Ayer' : ''
  const diaSemana = DIAS_SEMANA[fecha.getDay()]
  const diaNum = d

  const sufijo = `${diaSemana} ${diaNum}`
  return prefijo ? `${prefijo} - ${sufijo}` : sufijo
}

function agruparPorMes(ventas) {
  const grupos = {}
  for (const v of ventas) {
    const [y, m] = v.fecha_venta.split('-')
    const clave = `${y}-${m}`
    if (!grupos[clave]) {
      grupos[clave] = {
        label: `${MESES[Number(m) - 1]} ${y}`,
        items: [],
      }
    }
    grupos[clave].items.push(v)
  }
  return Object.entries(grupos).sort(([a], [b]) => b.localeCompare(a))
}

export default function HistorialTimeline({ isOpen, producto, onClose }) {
  const [ventas, setVentas] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen || !producto) return
    setCargando(true)
    setError('')
    getVentasDiariasPorReceta(producto.id)
      .then((data) => setVentas(data))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [isOpen, producto])

  if (!isOpen || !producto) return null

  const grupos = agruparPorMes(ventas)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Historial de Ventas
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">{producto.nombre}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {cargando && (
            <p className="text-sm text-slate-400 text-center py-12">Cargando historial...</p>
          )}

          {error && (
            <p className="text-sm text-red-500 text-center py-12">{error}</p>
          )}

          {!cargando && !error && ventas.length === 0 && (
            <div className="text-center py-12">
              <CalendarDays size={40} className="mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">
                No hay ventas registradas para este producto.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Usa el botón "Registrar Venta" para comenzar.
              </p>
            </div>
          )}

          {!cargando && !error && ventas.length > 0 && (
            <div className="border-l-2 border-slate-200 ml-4 pl-6 space-y-6 relative">
              {grupos.map(([clave, grupo]) => (
                <div key={clave}>
                  <p className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-4">
                    {grupo.label}
                  </p>

                  <div className="space-y-5">
                    {grupo.items.map((v) => (
                      <div key={v.id_venta} className="relative">
                        <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />

                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:bg-slate-100/70 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-800">
                                {formatearFechaLegible(v.fecha_venta)}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {v.unidades_vendidas} unidad{v.unidades_vendidas !== 1 ? 'es' : ''} vendida{v.unidades_vendidas !== 1 ? 's' : ''}
                              </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 flex-wrap">
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-emerald-600 text-sm font-semibold">
                                  <TrendingUp size={14} />
                                  {formatoCOP(v.ingreso_total)}
                                </div>
                                <p className="text-xs text-slate-400">
                                  +{formatoCOP(v.ganancia_neta_total)} neto
                                </p>
                              </div>

                              {v.unidades_sobrantes > 0 && (
                                <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap">
                                  <AlertTriangle size={12} />
                                  {v.unidades_sobrantes} merma{v.unidades_sobrantes !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
