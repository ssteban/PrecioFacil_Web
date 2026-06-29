import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

const SLIDES = [
  {
    bg: 'bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-800',
    title: 'Transforma el tanteo en ganancias reales',
    subtitle: 'Descubre cuánto realmente cuesta producir cada receta y maximiza tu margen.',
  },
  {
    bg: 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900',
    title: 'Controla cada ingrediente, cada costo',
    subtitle: 'Ingeniería inversa de costos a partir de los datos de tu jornada laboral.',
  },
  {
    bg: 'bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700',
    title: 'Cero desperdicio, máximo beneficio',
    subtitle: 'Nuestro algoritmo predictivo te alerta antes de producir de más.',
  },
]

function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  const goTo = useCallback((index) => setCurrent(index), [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="inicio" className="relative h-[600px] overflow-hidden">
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${slide.bg} ${i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <div className="text-center px-6 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              {slide.subtitle}
            </p>
            <Link
              to="/register"
              className="mt-8 inline-block px-8 py-4 bg-white text-emerald-700 font-bold text-lg rounded-full hover:bg-emerald-50 transition-colors shadow-lg"
            >
              Comenzar gratis
            </Link>
          </div>
        </div>
      ))}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default HeroCarousel
