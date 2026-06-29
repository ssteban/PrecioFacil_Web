import { Link } from 'react-router-dom'

function CtaSection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
          ¿Listo para saber exactamente cuánto estás ganando hoy?
        </h2>
        <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
          Únete a cientos de emprendedores que ya transformaron su negocio con datos reales.
        </p>
        <Link
          to="/register"
          className="inline-block bg-white text-emerald-700 px-10 py-4 rounded-full text-xl font-bold hover:bg-emerald-50 transition-colors shadow-xl"
        >
          Crear cuenta gratis
        </Link>
      </div>
    </section>
  )
}

export default CtaSection
