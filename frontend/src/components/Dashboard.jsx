import { useState, useEffect } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import DashboardNavbar from './DashboardNavbar'

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
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const stored = localStorage.getItem('costly_recetas')
    if (stored) setRecetas(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem('costly_recetas', JSON.stringify(recetas))
  }, [recetas])

  const handleLogout = () => {
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
        onLogout={handleLogout}
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
    </div>
  )
}

export default Dashboard
