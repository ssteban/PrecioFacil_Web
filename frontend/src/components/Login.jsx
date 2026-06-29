import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import AuthLayout from './AuthLayout'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 pt-20 pb-12">
        <AuthLayout title="Iniciar Sesión">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-800"
                placeholder="tucorreo@ejemplo.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-800"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-emerald-600 transition cursor-pointer"
            >
              Ingresar
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-emerald-600 font-semibold hover:text-emerald-700">
              Regístrate
            </Link>
          </p>
        </AuthLayout>
      </main>

      <Footer />
    </div>
  )
}

export default Login
