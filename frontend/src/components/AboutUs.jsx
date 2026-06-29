function AboutUs() {
  return (
    <section id="nosotros" className="py-20 px-6 bg-slate-800 text-slate-100">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-emerald-400 mb-14">
          Sobre Nosotros
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-slate-700/50 rounded-2xl p-8 border border-slate-600">
            <h3 className="text-2xl font-bold text-emerald-400 mb-4">Misión</h3>
            <p className="text-slate-300 leading-relaxed">
              Empoderar a micro-emprendedores y pequeños productores con datos
              exactos sobre sus costos de producción. Protegemos su negocio de
              la inflación y la incertidumbre del mercado, transformando la
              intuición en decisiones financieras sólidas.
            </p>
          </div>

          <div className="bg-slate-700/50 rounded-2xl p-8 border border-slate-600">
            <h3 className="text-2xl font-bold text-emerald-400 mb-4">Visión</h3>
            <p className="text-slate-300 leading-relaxed">
              Ser la plataforma estándar en Latinoamérica para escalar proyectos
              caseros a empresas sólidas y rentables. Queremos que cada
              emprendedor tenga el mismo poder de análisis que una gran
              corporación, desde su cocina o taller.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
