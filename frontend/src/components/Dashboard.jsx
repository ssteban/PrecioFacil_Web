import { useState, useEffect } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import DashboardNavbar from './DashboardNavbar'
import { getRecetas, parseReceta } from '../api/recetaApi'

const SECTION_TITLES = {
  '/dashboard': 'Dashboard',
  '/dashboard/insumos': 'Insumos y Costos',
  '/dashboard/recetas': 'Creador de Recetas',
  '/dashboard/productos': 'Mis Productos',
  '/dashboard/metricas': 'Métricas de Mermas',
}

function Dashboard() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [insumos, setInsumos] = useState([])
  const [categorias, setCategorias] = useState(['General'])
  const [recetas, setRecetas] = useState([])
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const stored = localStorage.getItem('costly_recetas')
    if (stored) setRecetas(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem('costly_recetas', JSON.stringify(recetas))
  }, [recetas])

  useEffect(() => {
    getRecetas()
      .then((list) => setRecetas(list.map(parseReceta)))
      .catch(() => console.error('Error al cargar recetas'))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setShowLogoutModal(false)
    navigate('/')
  }

  const title = SECTION_TITLES[location.pathname] || 'Dashboard'

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded((prev) => !prev)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onLogout={() => setShowLogoutModal(true)}
      />

      <main
        className={`
          transition-all duration-300 ease-in-out
          ml-0
          ${sidebarExpanded ? 'md:ml-64' : 'md:ml-16'}
          min-h-screen flex flex-col
        `}
      >
        <DashboardNavbar
          onMenuClick={() => setMobileOpen(true)}
          title={title}
        />

        <div className="flex-1 px-6 py-8">
          <Outlet context={{ insumos, setInsumos, categorias, setCategorias, recetas, setRecetas }} />
        </div>
      </main>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
             onClick={() => setShowLogoutModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in-95 duration-200"
               onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 text-center">
              ¿Cerrar Sesión?
            </h3>
            <p className="text-sm text-slate-600 text-center mt-2">
              ¿Estás seguro de que quieres cerrar sesión?
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
