import { useState } from 'react'
import { X, CheckCircle2 } from 'lucide-react'
import { createVentaDiaria } from '../api/ventaDiariaApi'

const inputClass =
  'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-800 text-sm bg-white'

function getFechaLocal() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function ModalVentaDiaria({ isOpen, producto, onClose, formatoCOP }) {
  const [ventaForm, setVentaForm] = useState({
    unidadesVendidas: '',
    unidadesSobrantes: '',
    fecha: getFechaLocal(),
  })
  const [guardandoVenta, setGuardandoVenta] = useState(false)
  const [ventaError, setVentaError] = useState('')
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false)
  const [ultimaVenta, setUltimaVenta] = useState(null)

  if (!isOpen || !producto) return null

  const handleClose = () => {
    setVentaForm({
      unidadesVendidas: '',
      unidadesSobrantes: '',
      fecha: getFechaLocal(),
    })
    setVentaError('')
    setIsSubmittedSuccessfully(false)
    setUltimaVenta(null)
    onClose()
  }

  const handleChange = (field) => (e) => {
    setVentaForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    setVentaError('')
    const unidades = Number(ventaForm.unidadesVendidas)
    if (isNaN(unidades) || unidades < 0) return

    setGuardandoVenta(true)
    try {
      const sobrantes = Number(ventaForm.unidadesSobrantes) || 0
      const precioUnitario = producto.totales.precioVentaUnitario
      const gananciaUnitaria = producto.totales.gananciaUnitaria

      const payload = {
        id_receta: producto.id,
        fecha_venta: ventaForm.fecha,
        unidades_vendidas: unidades,
        unidades_sobrantes: sobrantes,
        ingreso_total: Math.round(unidades * precioUnitario),
        ganancia_neta_total: Math.round(unidades * gananciaUnitaria),
      }

      await createVentaDiaria(payload)
      setUltimaVenta(payload)
      setIsSubmittedSuccessfully(true)
    } catch (err) {
      setVentaError(err.message)
    } finally {
      setGuardandoVenta(false)
    }
  }

  if (isSubmittedSuccessfully && ultimaVenta) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={36} className="text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 text-center">
            ¡Venta del Día Guardada!
          </h3>
          <p className="text-sm text-slate-600 text-center mt-2">
            Se registraron{' '}
            <span className="font-semibold">{ultimaVenta.unidades_vendidas}</span>{' '}
            unidades vendidas con un ingreso total de{' '}
            <span className="font-semibold">{formatoCOP(ultimaVenta.ingreso_total)}</span>.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="block mx-auto mt-6 px-6 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition"
          >
            Entendido
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto p-6 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-slate-800">Registrar Venta Diaria</h3>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {ventaError && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl text-sm mb-4">
            {ventaError}
          </div>
        )}

        <p className="text-sm text-slate-600 mb-4">
          Producto: <span className="font-semibold text-slate-800">{producto.nombre}</span>
        </p>

        <form onSubmit={handleGuardar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Unidades Vendidas
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={ventaForm.unidadesVendidas}
              onChange={handleChange('unidadesVendidas')}
              className={inputClass}
              placeholder="Ej: 10"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Unidades Sobrantes / Mermas
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={ventaForm.unidadesSobrantes}
              onChange={handleChange('unidadesSobrantes')}
              className={inputClass}
              placeholder="Ej: 2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              value={ventaForm.fecha}
              onChange={handleChange('fecha')}
              className={inputClass}
              required
            />
          </div>

          {ventaForm.unidadesVendidas && Number(ventaForm.unidadesVendidas) > 0 && (
            <div className="bg-emerald-50 rounded-xl p-4 space-y-2 border border-emerald-100">
              <p className="text-sm font-semibold text-emerald-800 mb-2">Resumen de Venta</p>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Precio unitario:</span>
                <span className="font-mono font-medium">
                  {formatoCOP(producto.totales.precioVentaUnitario)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Ganancia por und:</span>
                <span className="font-mono font-medium text-emerald-600">
                  {formatoCOP(producto.totales.gananciaUnitaria)}
                </span>
              </div>
              <hr className="border-emerald-100" />
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-700">Ingreso Total:</span>
                <span className="font-mono">
                  {formatoCOP(
                    Number(ventaForm.unidadesVendidas) *
                      producto.totales.precioVentaUnitario
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-700">Ganancia Neta Total:</span>
                <span className="font-mono text-emerald-600">
                  {formatoCOP(
                    Number(ventaForm.unidadesVendidas) *
                      producto.totales.gananciaUnitaria
                  )}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardandoVenta}
              className="px-5 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {guardandoVenta ? 'Guardando...' : 'Guardar Venta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
