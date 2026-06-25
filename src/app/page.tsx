'use client'
import { useState, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import ProductoCard from '@/components/ProductoCard'
import { useProductos } from '@/context/ProductosContext'
import { useAuth } from '@/context/AuthContext'
import { Categoria } from '@/types'
import { ShoppingBag, Search, Lock } from 'lucide-react'
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
    if (ordenar === 'random') lista = [...lista].sort(() => Math.random() - 0.5)
    return lista
  }, [productos, busqueda, categoriaFiltro, ordenar])

  // Si no está logueado, mostrar pantalla de bienvenida
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Navbar />
        <div style={{ background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)', color: 'white', padding: '60px 16px 80px', textAlign: 'center' }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>Pánuco Market</h1>
            <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 8, lineHeight: 1.6 }}>
              El marketplace local de Pánuco, Veracruz.
            </p>
            <p style={{ fontSize: 15, opacity: 0.8, marginBottom: 36, lineHeight: 1.6 }}>
              Compra y vende con tu comunidad. Encuentra productos locales, apoya a vendedores de tu ciudad.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/registro" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'white', color: '#16a34a', padding: '14px 28px', borderRadius: 14, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 16 }}>
                  Crear cuenta gratis
                </button>
              </Link>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'transparent', color: 'white', padding: '14px 28px', borderRadius: 14, border: '2px solid white', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>
                  Iniciar sesión
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bloqueo de productos */}
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: 20, padding: '40px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <Lock size={48} color="#16a34a" style={{ marginBottom: 16 }} />
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Inicia sesión para ver los productos</h2>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Crea una cuenta gratis para explorar todos los productos disponibles en Pánuco Market y contactar vendedores.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/registro" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#16a34a', color: 'white', padding: '12px 24px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                  Crear cuenta gratis
                </button>
              </Link>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#f1f5f9', color: '#475569', padding: '12px 24px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                  Ya tengo cuenta
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      {/* Buscador */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '14px 16px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar productos, vendedores..."
            style={{ width: '100%', padding: '11px 16px 11px 40px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }}
          />
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px' }}>
        {/* Filtros */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <select value={categoriaFiltro} onChange={e => setCategoriaFiltro(e.target.value)}
            style={{ flex: 1, minWidth: 160, padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 13, background: 'white', outline: 'none' }}>
            <option value="">Todas las categorías</option>
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={ordenar} onChange={e => setOrdenar(e.target.value)}
            style={{ flex: 1, minWidth: 140, padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 13, background: 'white', outline: 'none' }}>
            <option value="reciente">Más recientes</option>
            <option value="random">Aleatorio</option>
            <option value="precio_asc">Menor precio</option>
            <option value="precio_desc">Mayor precio</option>
          </select>
          {(busqueda || categoriaFiltro) && (
            <button onClick={() => { setBusqueda(''); setCategoriaFiltro('') }}
              style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 12, padding: '10px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>
              Limpiar ✕
            </button>
          )}
        </div>

        {busqueda && (
          <p style={{ marginBottom: 16, color: '#64748b', fontSize: 14 }}>
            {productosFiltrados.length} resultado{productosFiltrados.length !== 1 ? 's' : ''} para "<strong>{busqueda}</strong>"
          </p>
        )}

        {productosFiltrados.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
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
