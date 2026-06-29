import { Link } from 'react-router-dom'

function AuthLayout({ children, title }) {
  return (
    <div className="w-full max-w-md">
      <Link to="/" className="flex items-center justify-center gap-2 mb-8">
        <img src="/logo.png" alt="Costly" className="h-10 w-10" />
        <span className="text-2xl font-bold text-slate-800">Costly</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
