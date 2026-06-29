import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Características', href: '#caracteristicas' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Planes', href: '#planes' },
]

function Navbar() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'
  const isRegisterPage = location.pathname === '/register'
  const isAuthPage = isLoginPage || isRegisterPage

  const handleNavClick = (e, href) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Costly" className="h-8 w-8" />
          <span className="text-xl font-bold text-slate-800">Costly</span>
        </Link>

        {!isAuthPage && (
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-slate-600 hover:text-emerald-600 transition-colors font-medium"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-3">
          {!isLoginPage && (
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Iniciar Sesión
            </Link>
          )}
          {!isRegisterPage && (
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Registrarse
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
