const FEATURES = [
  {
    title: 'Módulo de Asistencia al Tanteo',
    description:
      'Aplica ingeniería inversa de costos usando los datos reales de tu jornada. Ingresa tus ingredientes, tiempos y rendimientos; el sistema calcula automáticamente el costo unitario por receta y te muestra tu margen real.',
    icon: (
      <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: 'Algoritmo Predictivo Antidesperdicio',
    description:
      'Analiza tu historial de producción y ventas para pronosticar la demanda óptima del día. Recibe alertas inteligentes antes de producir de más, reduciendo mermas y maximizando tus ganancias.',
    icon: (
      <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
      </svg>
    ),
  },
]

function Features() {
  return (
    <section id="caracteristicas" className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">
          ¿Por qué Costly?
        </h2>
        <p className="text-center text-slate-500 mb-14 max-w-xl mx-auto">
          Dos módulos diseñados para que nunca más vendas a pérdida.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="bg-emerald-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
