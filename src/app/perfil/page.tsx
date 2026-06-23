'use client'
import { useAuth } from '@/context/AuthContext'
import { useProductos } from '@/context/ProductosContext'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ProductoCard from '@/components/ProductoCard'
import { User, Mail, Phone, Package, LogOut, Store, Scissors, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

const rolLabel: Record<string, { label: string, icon: any }> = {
  cliente: { label: 'Cliente', icon: <ShoppingBag size={16} /> },
  vendedor_personal: { label: 'Vendedor Personal', icon: <ShoppingBag size={16} /> },
  local_negocio: { label: 'Negocio Local', icon: <Store size={16} /> },
  servicio: { label: 'Prestador de Servicios', icon: <Scissors size={16} /> },
  admin: { label: 'Administrador', icon: <User size={16} /> },
}

export default function Perfil() {
  const { user, logout } = useAuth()
  const { productos } = useProductos()
  const router = useRouter()

  if (!user) { router.push('/login'); return null }

  const misProductos = productos.filter(p => p.vendedor_id === user.id)
  const rol = rolLabel[user.rol] || rolLabel.cliente

  return (
    <div style={{ minHeight: '100vh', background: 'var(--fondo)' }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>

        {/* Perfil card */}
        <div style={{ background: 'white', borderRadius: 20, padding: '28px', marginBottom: 24, display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--verde) 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: 'white', flexShrink: 0 }}>
            {user.nombre[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800 }}>{user.nombre}</h1>
              <span className={`badge ${user.aprobado ? 'badge-verde' : 'badge-naranja'}`}>
                {rol.icon} {rol.label} {user.aprobado === false ? '· En revisión' : user.aprobado ? '· Verificado ✓' : ''}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Mail size={14} /> {user.correo}
              </span>
              {user.whatsapp && (
                <span style={{ fontSize: 14, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Phone size={14} /> {user.whatsapp}
                </span>
              )}
            </div>
            {user.descripcion && (
              <p style={{ fontSize: 14, color: '#64748b', marginTop: 8 }}>{user.descripcion}</p>
            )}
          </div>
          <button onClick={logout} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 14 }}>
            <LogOut size={16} /> Salir
          </button>
        </div>

        {/* Acciones rápidas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
          {user.rol === 'cliente' && (
            <Link href="/vender/activar" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--verde)', borderRadius: 14, padding: '18px', color: 'white', cursor: 'pointer', textAlign: 'center' }}>
                <ShoppingBag size={24} style={{ marginBottom: 8 }} />
                <p style={{ fontWeight: 700 }}>Quiero vender</p>
                <p style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>Activa tu perfil de vendedor</p>
              </div>
            </Link>
          )}
          {(user.rol !== 'cliente' && user.aprobado) && (
            <Link href="/vender" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--verde)', borderRadius: 14, padding: '18px', color: 'white', cursor: 'pointer', textAlign: 'center' }}>
                <Package size={24} style={{ marginBottom: 8 }} />
                <p style={{ fontWeight: 700 }}>Mis publicaciones</p>
                <p style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>{misProductos.length} publicadas</p>
              </div>
            </Link>
          )}
        </div>

        {/* Mis productos si es vendedor */}
        {misProductos.length > 0 && (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Mis publicaciones</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {misProductos.map(p => <ProductoCard key={p.id} producto={p} editable />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
