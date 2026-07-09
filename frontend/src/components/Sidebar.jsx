import { Link, useLocation } from 'react-router-dom'
import { ClipboardList, Package, BarChart3, ScrollText, TrendingUp, User, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Creador de Recetas', to: '/dashboard/recetas', icon: ClipboardList },
  { label: 'Mis Productos', to: '/dashboard/productos', icon: ScrollText },
  { label: 'Insumos y Costos', to: '/dashboard/insumos', icon: Package },
  { label: 'Métricas de Mermas', to: '/dashboard/metricas', icon: BarChart3 },
  { label: 'Recomendaciones', to: '/dashboard/recomendaciones', icon: TrendingUp },
]

function Sidebar({ expanded, onToggle, mobileOpen, onMobileClose, onLogout }) {
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const handleNavClick = () => {
    if (mobileOpen) onMobileClose()
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden animate-fade-in"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 h-full z-40
          bg-white border-r border-gray-200
          flex flex-col
          transition-all duration-300 ease-in-out
          overflow-hidden

          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          ${expanded ? 'w-64' : 'w-16'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 shrink-0">
          <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden" onClick={handleNavClick}>
            <img src="/logo.png" alt="Costly" className="h-8 w-8 shrink-0" />
            <span
              className={`
                text-xl font-bold text-slate-800 whitespace-nowrap
                transition-opacity duration-200
                ${expanded ? 'opacity-100 delay-100' : 'opacity-0'}
              `}
            >
              Costly
            </span>
          </Link>

          <button
            onClick={onToggle}
            className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 transition hidden md:block"
            aria-label={expanded ? 'Colapsar menú' : 'Expandir menú'}
          >
            {expanded ? <PanelLeftClose size={20} className="text-slate-500" /> : <PanelLeftOpen size={20} className="text-slate-500" />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={handleNavClick}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition
                  ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-gray-100'}
                `}
              >
                <Icon size={20} className="shrink-0" />
                <span
                  className={`
                    whitespace-nowrap text-sm font-medium
                    transition-opacity duration-200
                    ${expanded ? 'opacity-100 delay-100' : 'opacity-0'}
                  `}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-gray-200 p-3 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
              <User size={18} className="text-emerald-600" />
            </div>
            <span
              className={`
                text-sm font-medium text-slate-700 whitespace-nowrap
                transition-opacity duration-200
                ${expanded ? 'opacity-100 delay-100' : 'opacity-0'}
              `}
            >
              {user ? user.username : 'Usuario'}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-600 hover:bg-red-50 transition mt-1"
          >
            <LogOut size={20} className="shrink-0" />
            <span
              className={`
                whitespace-nowrap text-sm font-medium
                transition-opacity duration-200
                ${expanded ? 'opacity-100 delay-100' : 'opacity-0'}
              `}
            >
              Cerrar Sesión
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
