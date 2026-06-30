import { ClipboardList, Package, BarChart3 } from 'lucide-react'

const PLACEHOLDER_CARDS = [
  {
    title: 'Creador de Recetas',
    description: 'Diseña y calcula el costo de cada una de tus recetas.',
    icon: ClipboardList,
  },
  {
    title: 'Insumos y Costos',
    description: 'Gestiona tu tabla de ingredientes y precios unitarios.',
    icon: Package,
  },
  {
    title: 'Métricas de Mermas',
    description: 'Visualiza las pérdidas y optimiza tu producción.',
    icon: BarChart3,
  },
]

function DashboardHome() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  return (
    <>
      <h1 className="text-3xl font-bold text-slate-800">
        ¡Bienvenido de vuelta, {user ? user.username : 'Usuario'}!
      </h1>
      <p className="text-slate-500 mt-1">Aquí tienes un resumen de tu negocio.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {PLACEHOLDER_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center h-48 text-center hover:shadow-md transition-shadow"
            >
              <Icon size={40} className="text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">{card.title}</h3>
              <p className="text-sm text-slate-400 mt-1">{card.description}</p>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default DashboardHome
