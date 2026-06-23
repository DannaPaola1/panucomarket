'use client'
import { useState, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import ProductoCard from '@/components/ProductoCard'
import { useProductos } from '@/context/ProductosContext'
import { useAuth } from '@/context/AuthContext'
import { Categoria } from '@/types'
import { ShoppingBag, TrendingUp, Users, Star } from 'lucide-react'
import Link from 'next/link'

const CATEGORIAS: Categoria[] = [
  'Ropa y Accesorios', 'Electrónica', 'Alimentos', 'Hogar y Muebles',
  'Animales', 'Campo y Ganadería', 'Servicios de Belleza', 'Servicios del Hogar',
  'Vehículos', 'Otros'
]

export default function Home() {
  const { productos } = useProductos()
  const { user } = useAuth()
  const [busqueda, setBusqueda] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [ordenar, setOrdenar] = useState('reciente')

  const productosFiltrados = useMemo(() => {
    let lista = productos.filter(p => p.estado === 'activo')
    if (busqueda) {
      const q = busqueda.toLowerCase()
      lista = lista.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q) ||
        p.vendedor?.nombre.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
      )
    }
    if (categoriaFiltro) lista = lista.filter(p => p.categoria === categoriaFiltro)
    if (ordenar === 'precio_asc') lista = [...lista].sort((a, b) => a.precio - b.precio)
    if (ordenar === 'precio_desc') lista = [...lista].sort((a, b) => b.precio - a.precio)
    if (ordenar === 'reciente') lista = [...lista].sort((a, b) => new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime())
    // Random shuffle para feed
    if (ordenar === 'random') lista = [...lista].sort(() => Math.random() - 0.5)
    return lista
  }, [productos, busqueda, categoriaFiltro, ordenar])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--fondo)' }}>
      <Navbar onSearch={setBusqueda} />

      {/* Hero — solo si no hay búsqueda */}
      {!busqueda && !user && (
        <div style={{ background: 'linear-gradient(135deg, var(--verde) 0%, #059669 100%)', color: 'white', padding: '40px 16px', textAlign: 'center' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 10 }}>
              🛒 Pánuco Market
            </h1>
            <p style={{ fontSize: 17, opacity: 0.9, marginBottom: 24 }}>
              El marketplace local de Pánuco, Veracruz. Compra y vende con tu comunidad.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/registro" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'white', color: 'var(--verde)', padding: '12px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>
                  Crear cuenta gratis
                </button>
              </Link>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'transparent', color: 'white', padding: '12px 24px', borderRadius: 10, border: '2px solid white', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>
                  Iniciar sesión
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats rápidas */}
      {!busqueda && (
        <div style={{ background: 'white', borderBottom: '1px solid var(--borde)', padding: '14px 16px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: <ShoppingBag size={16} />, label: `${productos.filter(p=>p.estado==='activo').length} productos activos` },
              { icon: <Users size={16} />, label: '3 vendedores' },
              { icon: <Star size={16} />, label: 'Pánuco, Veracruz' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 14 }}>
                <span style={{ color: 'var(--verde)' }}>{s.icon}</span> {s.label}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px' }}>
        {/* Filtros */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={categoriaFiltro} onChange={e => setCategoriaFiltro(e.target.value)} style={{ width: 'auto', minWidth: 180 }}>
            <option value="">Todas las categorías</option>
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={ordenar} onChange={e => setOrdenar(e.target.value)} style={{ width: 'auto', minWidth: 160 }}>
            <option value="random">Aleatorio</option>
            <option value="reciente">Más recientes</option>
            <option value="precio_asc">Menor precio</option>
            <option value="precio_desc">Mayor precio</option>
          </select>
          {(busqueda || categoriaFiltro) && (
            <button onClick={() => { setBusqueda(''); setCategoriaFiltro('') }} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, padding: '10px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
              Limpiar filtros ✕
            </button>
          )}
        </div>

        {busqueda && (
          <p style={{ marginBottom: 16, color: '#64748b', fontSize: 14 }}>
            {productosFiltrados.length} resultado{productosFiltrados.length !== 1 ? 's' : ''} para "<strong>{busqueda}</strong>"
          </p>
        )}

        {/* Grid de productos */}
        {productosFiltrados.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {productosFiltrados.map(p => <ProductoCard key={p.id} producto={p} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
            <ShoppingBag size={48} style={{ marginBottom: 16, opacity: 0.4 }} />
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>No hay productos</h3>
            <p>Intenta con otra búsqueda o categoría</p>
          </div>
        )}
      </div>
    </div>
  )
}
