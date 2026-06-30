import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import AuthLayout from './AuthLayout'
import { loginUser } from '../api/authApi'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido'
    }
    if (!formData.password) {
      newErrors.password = 'Campo requerido'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) return

    setLoading(true)
    try {
      const data = await loginUser({
        correo: formData.email,
        contrasena: formData.password,
      })
      localStorage.setItem('user', JSON.stringify(data))
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (name) =>
    `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-800 ${
      errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`

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
                className={inputClass('email')}
                placeholder="tucorreo@ejemplo.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                className={inputClass('password')}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</p>
            )}

            {success && (
              <p className="text-emerald-600 text-sm text-center bg-emerald-50 py-2 rounded-lg">
                ¡Inicio de sesión exitoso! Redirigiendo...
              </p>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className={`w-full py-3 rounded-xl font-bold text-lg transition cursor-pointer ${
                loading || success
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
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
