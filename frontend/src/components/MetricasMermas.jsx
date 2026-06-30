import { useState, useEffect, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell,
  LineChart, Line, Area,
} from 'recharts'
import { Calendar, Filter, TrendingDown, AlertTriangle, BarChart3 } from 'lucide-react'
import { getVentasDiarias } from '../api/ventaDiariaApi'
import { formatoCOP } from '../utils/conversiones'

const COLORS = {
  emerald: '#10B981',
  emeraldLight: '#D1FAE5',
  red: '#F87171',
  redLight: '#FCA5A5',
  slate: '#94A3B8',
}

function MetricasMermas() {
  const { recetas } = useOutletContext()

  const [ventas, setVentas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [selectedProducto, setSelectedProducto] = useState('todos')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  useEffect(() => {
    setCargando(true)
    getVentasDiarias()
      .then((data) => setVentas(data))
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [])

  const ventasFiltradas = useMemo(() => {
    return ventas.filter((v) => {
      if (selectedProducto !== 'todos' && v.id_receta !== Number(selectedProducto)) return false
      if (fechaDesde && v.fecha_venta < fechaDesde) return false
      if (fechaHasta && v.fecha_venta > fechaHasta) return false
      return true
    })
  }, [ventas, selectedProducto, fechaDesde, fechaHasta])

  const kpis = useMemo(() => {
    const totalPerdidas = ventasFiltradas.reduce(
      (s, v) => s + v.unidades_sobrantes * v.costo_unidad, 0
    )

    const mermasPorProducto = {}
    ventasFiltradas.forEach((v) => {
      const key = v.nombre_receta || `Producto #${v.id_receta}`
      mermasPorProducto[key] = (mermasPorProducto[key] || 0) + v.unidades_sobrantes
    })
    let productoMasDesperdiciado = '—'
    let maxMermas = 0
    for (const [nombre, total] of Object.entries(mermasPorProducto)) {
      if (total > maxMermas) {
        maxMermas = total
        productoMasDesperdiciado = nombre
      }
    }

    const totalVendidas = ventasFiltradas.reduce((s, v) => s + v.unidades_vendidas, 0)
    const totalMermas = ventasFiltradas.reduce((s, v) => s + v.unidades_sobrantes, 0)
    const totalProducidas = totalVendidas + totalMermas
    const indiceEficiencia = totalProducidas > 0
      ? Math.round((totalVendidas / totalProducidas) * 100)
      : 0

    return { totalPerdidas, productoMasDesperdiciado, indiceEficiencia }
  }, [ventasFiltradas])

  const chartData = useMemo(() => {
    const balanceMap = {}
    const tendenciaMap = {}

    ventasFiltradas.forEach((v) => {
      const fecha = v.fecha_venta
      const perdida = v.unidades_sobrantes * v.costo_unidad

      if (!balanceMap[fecha]) {
        balanceMap[fecha] = { fecha, ingreso: 0, perdida: 0 }
      }
      balanceMap[fecha].ingreso += v.ingreso_total
      balanceMap[fecha].perdida += perdida

      if (!tendenciaMap[fecha]) {
        tendenciaMap[fecha] = { fecha, merma: 0 }
      }
      tendenciaMap[fecha].merma += perdida
    })

    const balance = Object.values(balanceMap).sort((a, b) => a.fecha.localeCompare(b.fecha))
    const tendencia = Object.values(tendenciaMap).sort((a, b) => a.fecha.localeCompare(b.fecha))

    const totalVendidas = ventasFiltradas.reduce((s, v) => s + v.unidades_vendidas, 0)
    const totalMermas = ventasFiltradas.reduce((s, v) => s + v.unidades_sobrantes, 0)
    const totalProducidas = totalVendidas + totalMermas
    const pctVendidas = totalProducidas > 0 ? (totalVendidas / totalProducidas) * 100 : 100
    const pctMermas = totalProducidas > 0 ? (totalMermas / totalProducidas) * 100 : 0

    const pie = [
      { name: 'Vendido', value: pctVendidas, color: COLORS.emerald },
      { name: 'Mermas', value: pctMermas, color: COLORS.red },
    ]

    return { balance, pie, tendencia }
  }, [ventasFiltradas])

  const inputClass =
    'px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-800 bg-white'

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold text-slate-800">Métricas de Mermas</h1>
      <p className="text-slate-500 mt-1">Analiza el impacto financiero de tus mermas diarias.</p>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mt-8">
        <div className="flex items-center gap-2 min-w-0">
          <Filter size={16} className="text-slate-400 shrink-0" />
          <select
            value={selectedProducto}
            onChange={(e) => setSelectedProducto(e.target.value)}
            className={inputClass}
          >
            <option value="todos">Todos los productos</option>
            {recetas.map((r) => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <Calendar size={16} className="text-slate-400 shrink-0" />
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className={inputClass}
          />
          <span className="text-slate-300">—</span>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {cargando ? (
        <p className="text-sm text-slate-400 text-center py-16">Cargando métricas...</p>
      ) : ventas.length === 0 ? (
        <div className="text-center py-20 mt-8 bg-white rounded-2xl border border-gray-200">
          <BarChart3 size={48} className="mx-auto mb-4 text-slate-200" />
          <p className="text-base font-semibold text-slate-600">Aún no hay ventas registradas.</p>
          <p className="text-sm text-slate-400 mt-1">
            Registra ventas desde "Mis Productos" para ver tus métricas aquí.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center gap-2">
                <TrendingDown size={16} className="text-red-400" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Pérdidas en Dinero
                </p>
              </div>
              <p className="text-2xl font-bold text-red-500 mt-2">{formatoCOP(kpis.totalPerdidas)}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-400" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Producto más Desperdiciado
                </p>
              </div>
              <p className="text-lg font-bold text-slate-800 mt-2 truncate" title={kpis.productoMasDesperdiciado}>
                {kpis.productoMasDesperdiciado}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-emerald-400" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Índice de Eficiencia
                </p>
              </div>
              <p className="text-2xl font-bold text-emerald-500 mt-2">{kpis.indiceEficiencia}%</p>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                <div
                  className="h-2 rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${kpis.indiceEficiencia}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mt-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Balance Financiero</h3>
            {chartData.balance.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">Sin datos en el rango seleccionado.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData.balance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="fecha" tick={{ fontSize: 12 }} stroke={COLORS.slate} />
                  <YAxis tick={{ fontSize: 12 }} stroke={COLORS.slate} />
                  <Tooltip formatter={(v) => formatoCOP(v)} />
                  <Bar dataKey="ingreso" name="Ingreso Real" fill={COLORS.emerald} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="perdida" name="Pérdida por Mermas" fill={COLORS.red} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
            <div className="flex justify-center gap-6 text-xs text-slate-500 mt-3">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500" /> Ingreso Real
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-red-400" /> Pérdida por Mermas
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Eficiencia de Producción</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={chartData.pie}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                  >
                    {chartData.pie.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v.toFixed(1)}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 text-sm mt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />{' '}
                  Vendido {chartData.pie[0]?.value.toFixed(1)}%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />{' '}
                  Mermas {chartData.pie[1]?.value.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Tendencia de Mermas</h3>
              {chartData.tendencia.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">Sin datos en el rango seleccionado.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={chartData.tendencia}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="fecha" tick={{ fontSize: 12 }} stroke={COLORS.slate} />
                    <YAxis tick={{ fontSize: 12 }} stroke={COLORS.slate} />
                    <Tooltip formatter={(v) => formatoCOP(v)} />
                    <Area type="monotone" dataKey="merma" fill="#fecaca" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="merma" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MetricasMermas
