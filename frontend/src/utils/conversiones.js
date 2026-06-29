export const convertirABase = (cantidad, unidad) => {
  switch (unidad) {
    case 'kg':
      return { cantidadBase: cantidad * 1000, unidadLabel: 'gramos' }
    case 'L':
      return { cantidadBase: cantidad * 1000, unidadLabel: 'mililitros' }
    case 'g':
      return { cantidadBase: cantidad, unidadLabel: 'gramos' }
    case 'ml':
      return { cantidadBase: cantidad, unidadLabel: 'mililitros' }
    case 'und':
      return { cantidadBase: cantidad, unidadLabel: 'unidades' }
    case 'COP':
      return { cantidadBase: cantidad, unidadLabel: 'pesos' }
    default:
      return { cantidadBase: cantidad, unidadLabel: unidad }
  }
}

export const formatoCOP = (valor) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor)
