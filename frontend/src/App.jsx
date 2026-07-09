import { Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import DashboardHome from './components/DashboardHome'
import InsumosCostos from './components/InsumosCostos'
import CreadorRecetas from './components/CreadorRecetas'
import MisProductos from './components/MisProductos'
import MetricasMermas from './components/MetricasMermas'
import RecomendacionesProduccion from './components/RecomendacionesProduccion'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<DashboardHome />} />
        <Route path="insumos" element={<InsumosCostos />} />
        <Route path="recetas" element={<CreadorRecetas />} />
        <Route path="productos" element={<MisProductos />} />
        <Route path="metricas" element={<MetricasMermas />} />
        <Route path="recomendaciones" element={<RecomendacionesProduccion />} />
      </Route>
    </Routes>
  )
}

export default App
