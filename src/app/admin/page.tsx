'use client'
import { useAuth } from '@/context/AuthContext'
import { useProductos } from '@/context/ProductosContext'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Shield, Users, Package, CheckCircle, XCircle, TrendingUp } from 'lucide-react'

const SOLICITUDES_DEMO = [
  { id: 's1', nombre: 'Carlos Ramírez', correo: 'carlos@demo.com', tipo: 'local_negocio', negocio: 'Carnicería El Buen Corte', whatsapp: '8891112233', fecha: '2026-06-20' },
  { id: 's2', nombre: 'Ana González', correo: 'ana@demo.com', tipo: 'servicio', negocio: 'Uñas con Ana', whatsapp: '8894445566', fecha: '2026-06-21' },
]

export default function Admin() {
  const { user } = useAuth()
  const { productos } = useProductos()
  const router = useRouter()

  if (!user || user.rol !== 'admin') { router.push('/'); return null }

  const stats = [
    { label: 'Usuarios totales', valor: 3, icon: <Users size={22} color="var(--verde)" /> },
    { label: 'Productos activos', valor: productos.filter(p => p.estado === 'activo').length, icon: <Package size={22} color="var(--verde)" /> },
    { label: 'Solicitudes pendientes', valor: SOLICITUDES_DEMO.length, icon: <Shield size={22} color="var(--naranja)" /> },
    { label: 'Vendedores aprobados', valor: 1, icon: <TrendingUp size={22} color="var(--verde)" /> },
  ]

  const tipoLabel: Record<string, string> = {
    vendedor_personal: '👤 Personal',
    local_negocio: '🏪 Negocio',
    servicio: '💅 Servicio'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--fondo)' }}>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <Shield size={28} color="var(--verde)" />
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>Panel de Administrador</h1>
            <p style={{ color: '#64748b', fontSize: 14 }}>Bienvenido, {user.nombre}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 14, padding: '20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ background: 'var(--verde-claro)', borderRadius: 10, padding: 10 }}>{s.icon}</div>
              <div>
                <p style={{ fontSize: 26, fontWeight: 800 }}>{s.valor}</p>
                <p style={{ fontSize: 12, color: '#64748b' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Solicitudes pendientes */}
        <div style={{ background: 'white', borderRadius: 16, padding: '24px', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={20} color="var(--naranja)" /> Solicitudes de vendedores pendientes
          </h2>
          {SOLICITUDES_DEMO.map(s => (
            <div key={s.id} style={{ border: '1px solid var(--borde)', borderRadius: 12, padding: '16px', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <strong style={{ fontSize: 16 }}>{s.nombre}</strong>
                    <span className="badge badge-naranja">{tipoLabel[s.tipo]}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#64748b' }}>{s.correo} · {s.whatsapp}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{s.negocio}</p>
                  <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Solicitó: {s.fecha}</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 14 }}
                    onClick={() => alert(`✅ ${s.nombre} aprobado. En producción se enviaría correo automático.`)}>
                    <CheckCircle size={16} /> Aprobar
                  </button>
                  <button style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 14 }}
                    onClick={() => alert(`❌ ${s.nombre} rechazado.`)}>
                    <XCircle size={16} /> Rechazar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Todos los productos */}
        <div style={{ background: 'white', borderRadius: 16, padding: '24px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Package size={20} color="var(--verde)" /> Todas las publicaciones ({productos.length})
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Producto', 'Vendedor', 'Precio', 'Categoría', 'Estado', 'Acción'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', borderBottom: '2px solid var(--borde)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--borde)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>{p.nombre}</td>
                    <td style={{ padding: '12px 14px', color: '#64748b' }}>{p.vendedor?.nombre}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--verde)' }}>${p.precio}</td>
                    <td style={{ padding: '12px 14px' }}><span className="badge badge-gris">{p.categoria}</span></td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={`badge ${p.estado === 'activo' ? 'badge-verde' : 'badge-gris'}`}>
                        {p.estado === 'activo' ? '● Activo' : '● Pausado'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                        onClick={() => alert('En producción: eliminar publicación')}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
