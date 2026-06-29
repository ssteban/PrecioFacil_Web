import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import AuthLayout from './AuthLayout'

const TIPOS_NEGOCIO = [
  'Autoempleo / Negocio Casero',
  'Repostería y Pastelería',
  'Restaurante y Comidas Rápidas',
  'Cafetería y Heladería',
  'Artesanías y Manualidades',
  'Textil y Confitería',
  'Calzado y Marroquinería',
  'Otro tipo de manufactura',
]

const INITIAL_STATE = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  pais: '',
  departamento: '',
  ciudad: '',
  tipoNegocio: TIPOS_NEGOCIO[0],
}

function Register() {
  const [formData, setFormData] = useState(INITIAL_STATE)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.username.trim() || formData.username.trim().length < 3) {
      newErrors.username = 'Mínimo 3 caracteres'
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido'
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    if (!formData.pais.trim()) {
      newErrors.pais = 'Campo requerido'
    }
    if (!formData.departamento.trim()) {
      newErrors.departamento = 'Campo requerido'
    }
    if (!formData.ciudad.trim()) {
      newErrors.ciudad = 'Campo requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    console.log('Register submitted:', formData)
  }

  const inputClass = (name) =>
    `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-800 ${
      errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 pt-20 pb-12">
        <AuthLayout title="Crear tu cuenta">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                Nombre de usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className={inputClass('username')}
                placeholder="Tu nombre o marca"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={inputClass('confirmPassword')}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="pais" className="block text-sm font-medium text-slate-700 mb-1">
                  País
                </label>
                <input
                  id="pais"
                  name="pais"
                  type="text"
                  required
                  value={formData.pais}
                  onChange={handleChange}
                  className={inputClass('pais')}
                  placeholder="Ej: Colombia"
                />
                {errors.pais && <p className="text-red-500 text-xs mt-1">{errors.pais}</p>}
              </div>

              <div>
                <label htmlFor="departamento" className="block text-sm font-medium text-slate-700 mb-1">
                  Dpto / Estado
                </label>
                <input
                  id="departamento"
                  name="departamento"
                  type="text"
                  required
                  value={formData.departamento}
                  onChange={handleChange}
                  className={inputClass('departamento')}
                  placeholder="Ej: Antioquia"
                />
                {errors.departamento && (
                  <p className="text-red-500 text-xs mt-1">{errors.departamento}</p>
                )}
              </div>

              <div>
                <label htmlFor="ciudad" className="block text-sm font-medium text-slate-700 mb-1">
                  Ciudad
                </label>
                <input
                  id="ciudad"
                  name="ciudad"
                  type="text"
                  required
                  value={formData.ciudad}
                  onChange={handleChange}
                  className={inputClass('ciudad')}
                  placeholder="Ej: Medellín"
                />
                {errors.ciudad && <p className="text-red-500 text-xs mt-1">{errors.ciudad}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="tipoNegocio" className="block text-sm font-medium text-slate-700 mb-1">
                Tipo de negocio
              </label>
              <select
                id="tipoNegocio"
                name="tipoNegocio"
                value={formData.tipoNegocio}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-800 bg-white"
              >
                {TIPOS_NEGOCIO.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-emerald-600 transition cursor-pointer mt-2"
            >
              Crear Cuenta
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700">
              Inicia sesión
            </Link>
          </p>
        </AuthLayout>
      </main>

      <Footer />
    </div>
  )
}

export default Register
