import { Menu } from 'lucide-react'

function DashboardNavbar({ onMenuClick, title }) {
  return (
    <header className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-200 h-16 flex items-center px-4 gap-4">
      <button
        onClick={onMenuClick}
        className="p-1 rounded-lg hover:bg-gray-100 transition"
        aria-label="Abrir menú"
      >
        <Menu size={24} className="text-slate-700" />
      </button>
      <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
    </header>
  )
}

export default DashboardNavbar
