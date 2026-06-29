import { Link } from 'react-router-dom'

const PLANS = [
  {
    name: 'Gratis',
    price: '$0',
    period: '/mes',
    description: 'Perfecto para empezar a conocer tus costos.',
    features: ['Hasta 5 recetas o productos', 'Cálculo básico de costos', 'Dashboard simplificado'],
    cta: 'Empezar gratis',
    highlighted: false,
  },
  {
    name: 'Premium',
    price: '$9.99',
    period: '/mes',
    description: 'Para emprendedores que van en serio.',
    features: [
      'Recetas ilimitadas',
      'Alertas predictivas diarias',
      'Gráficas detalladas de mermas',
      'Exportación de reportes',
    ],
    cta: 'Actualizar ahora',
    highlighted: true,
  },
]

function PricingPlans() {
  return (
    <section id="planes" className="py-20 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">
          Planes diseñados para tu crecimiento
        </h2>
        <p className="text-center text-slate-500 mb-14 max-w-xl mx-auto">
          Elige el plan que mejor se adapte a tu negocio. Sin contratos, cancela cuando quieras.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlighted
                  ? 'border-2 border-emerald-500 ring-2 ring-emerald-500/20 bg-white'
                  : 'border-2 border-gray-200 bg-white'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  Recomendado
                </span>
              )}

              <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
              <p className="text-slate-500 text-sm mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-5xl font-extrabold text-slate-800">{plan.price}</span>
                <span className="text-slate-400 ml-1">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-slate-600">
                    <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`block text-center py-3 rounded-xl font-semibold transition-colors ${
                  plan.highlighted
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingPlans
