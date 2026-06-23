'use client'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import { User, Producto } from '@/types'
import { useState, useEffect } from 'react'
import { Shield, Users, Package, CheckCircle, XCircle, Trash2, AlertCircle } from 'lucide-react'

type Tab = 'solicitudes' | 'vendedores' | 'productos'

interface Solicitud extends User {
  negocio?: string
}

export default function Admin() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('solicitudes')
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [vendedores, setVendedores] = useState<User[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [procesando, setProcesando] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && (!user || user.rol !== 'admin')) router.push('/')
  }, [user, loading, router])

  useEffect(() => {
    if (user?.rol === 'admin') cargarDatos()
  }, [user])

  const cargarDatos = async () => {
    setCargando(true)
    const [{ data: sol }, { data: vend }, { data: prods }] = await Promise.all([
      supabase.from('perfiles').select('*').in('rol', ['vendedor_personal', 'local_negocio', 'servicio']).eq('aprobado', false),
      supabase.from('perfiles').select('*').in('rol', ['vendedor_personal', 'local_negocio', 'servicio']).eq('aprobado', true),
      supabase.from('productos').select('*, vendedor:vendedor_id(nombre, whatsapp)').order('creado_en', { ascending: false }),
    ])
    setSolicitudes((sol as Solicitud[]) || [])
    setVendedores((vend as User[]) || [])
    setProductos((prods as unknown as Producto[]) || [])
    setCargando(false)
  }

  const aprobar = async (id: string, nombre: string) => {
    setProcesando(id)
    const { error } = await supabase.from('perfiles').update({ aprobado: true }).eq('id', id)
    if (!error) {
      alert(`✅ ${nombre} aprobado como vendedor`)
      await cargarDatos()
    }
    setProcesando(null)
  }

  const rechazar = async (id: string, nombre: string) => {
    if (!confirm(`¿Rechazar la solicitud de ${nombre}? Se revertirá su rol a cliente.`)) return
    setProcesando(id)
    const { error } = await supabase.from('perfiles').update({ rol: 'cliente', aprobado: false }).eq('id', id)
    if (!error) {
      alert(`❌ Solicitud de ${nombre} rechazada`)
      await cargarDatos()
    }
    setProcesando(null)
  }

  const eliminarProducto = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar el producto "${nombre}"?`)) return
    setProcesando(id)
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (!error) await cargarDatos()
    setProcesando(null)
  }

  const rolLabel: Record<string, string> = {
    vendedor_personal: '👤 Personal',
    local_negocio: '🏪 Negocio',
    servicio: '💅 Servicio',
    cliente: '🙋 Cliente',
    admin: '⚙️ Admin',
  }

  if (loading || !user) return null

  const tabs: { key: Tab; label: string; count: number; color: string }[] = [
    { key: 'solicitudes', label: 'Solicitudes', count: solicitudes.length, color: '#f97316' },
    { key: 'vendedores', label: 'Vendedores', count: vendedores.length, color: '#22c55e' },
    { key: 'productos', label: 'Productos', count: productos.length, color: '#3b82f6' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Shield size={28} color="#22c55e" />
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Panel de Administrador</h1>
            <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>Bienvenido, {user.nombre}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Solicitudes pendientes', valor: solicitudes.length, color: '#f97316', bg: '#fff7ed', icon: <AlertCircle size={20} color="#f97316" /> },
            { label: 'Vendedores aprobados', valor: vendedores.length, color: '#22c55e', bg: '#f0fdf4', icon: <Users size={20} color="#22c55e" /> },
            { label: 'Productos publicados', valor: productos.length, color: '#3b82f6', bg: '#eff6ff', icon: <Package size={20} color="#3b82f6" /> },
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ background: s.bg, borderRadius: 10, padding: 10 }}>{s.icon}</div>
              <div>
                <p style={{ fontSize: 24, fontWeight: 800, margin: 0, color: s.color }}>{s.valor}</p>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap',
              background: tab === t.key ? t.color : 'white',
              color: tab === t.key ? 'white' : '#64748b',
              boxShadow: tab === t.key ? `0 2px 8px ${t.color}40` : '0 1px 3px rgba(0,0,0,0.08)',
              transition: 'all 0.15s',
            }}>
              {t.label}
              <span style={{
                marginLeft: 8, background: tab === t.key ? 'rgba(255,255,255,0.3)' : '#e2e8f0',
                color: tab === t.key ? 'white' : '#475569',
                borderRadius: 20, padding: '1px 8px', fontSize: 12
              }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div style={{ background: 'white', borderRadius: 16, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          {cargando ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Cargando datos...</div>
          ) : (
            <>
              {/* SOLICITUDES */}
              {tab === 'solicitudes' && (
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertCircle size={18} color="#f97316" /> Solicitudes pendientes de aprobación
                  </h2>
                  {solicitudes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                      <CheckCircle size={40} color="#22c55e" style={{ marginBottom: 8 }} />
                      <p>No hay solicitudes pendientes</p>
                    </div>
                  ) : solicitudes.map(s => (
                    <div key={s.id} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                            <strong style={{ fontSize: 15 }}>{s.nombre}</strong>
                            <span style={{ background: '#fff7ed', color: '#c2410c', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>{rolLabel[s.rol]}</span>
                          </div>
                          <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0' }}>{s.whatsapp && `📱 ${s.whatsapp}`}</p>
                          {s.descripcion && <p style={{ fontSize: 13, color: '#475569', margin: '4px 0', fontStyle: 'italic' }}>"{s.descripcion}"</p>}
                          <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0' }}>Solicitó: {new Date(s.creado_en).toLocaleDateString('es-MX')}</p>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button
                            disabled={procesando === s.id}
                            onClick={() => aprobar(s.id, s.nombre)}
                            style={{ background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13, opacity: procesando === s.id ? 0.6 : 1 }}>
                            <CheckCircle size={15} /> Aprobar
                          </button>
                          <button
                            disabled={procesando === s.id}
                            onClick={() => rechazar(s.id, s.nombre)}
                            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13, opacity: procesando === s.id ? 0.6 : 1 }}>
                            <XCircle size={15} /> Rechazar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* VENDEDORES */}
              {tab === 'vendedores' && (
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Users size={18} color="#22c55e" /> Vendedores aprobados
                  </h2>
                  {vendedores.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>No hay vendedores aprobados aún</div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                      {vendedores.map(v => (
                        <div key={v.id} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 20, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                              {v.foto_perfil ? <img src={v.foto_perfil} style={{ width: 40, height: 40, borderRadius: 20, objectFit: 'cover' }} alt="" /> : '👤'}
                            </div>
                            <div>
                              <strong style={{ fontSize: 14 }}>{v.nombre}</strong>
                              <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{rolLabel[v.rol]}</p>
                            </div>
                          </div>
                          {v.whatsapp && <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0' }}>📱 {v.whatsapp}</p>}
                          {v.descripcion && <p style={{ fontSize: 12, color: '#475569', margin: '4px 0', fontStyle: 'italic' }}>"{v.descripcion}"</p>}
                          <span style={{ background: '#f0fdf4', color: '#15803d', borderRadius: 6, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>✓ Aprobado</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PRODUCTOS */}
              {tab === 'productos' && (
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Package size={18} color="#3b82f6" /> Todos los productos ({productos.length})
                  </h2>
                  {productos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>No hay productos publicados</div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                          <tr style={{ background: '#f8fafc' }}>
                            {['Producto', 'Vendedor', 'Precio', 'Categoría', 'Estado', ''].map(h => (
                              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {productos.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '11px 12px', fontWeight: 600, maxWidth: 180 }}>
                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nombre}</div>
                              </td>
                              <td style={{ padding: '11px 12px', color: '#64748b' }}>{(p.vendedor as unknown as User)?.nombre || '—'}</td>
                              <td style={{ padding: '11px 12px', fontWeight: 700, color: '#16a34a', whiteSpace: 'nowrap' }}>${Number(p.precio).toLocaleString('es-MX')}</td>
                              <td style={{ padding: '11px 12px' }}>
                                <span style={{ background: '#f1f5f9', color: '#475569', borderRadius: 6, padding: '2px 8px', fontSize: 12 }}>{p.categoria}</span>
                              </td>
                              <td style={{ padding: '11px 12px' }}>
                                <span style={{ background: p.estado === 'activo' ? '#f0fdf4' : '#f1f5f9', color: p.estado === 'activo' ? '#15803d' : '#64748b', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>
                                  {p.estado === 'activo' ? '● Activo' : '● Pausado'}
                                </span>
                              </td>
                              <td style={{ padding: '11px 12px' }}>
                                <button
                                  disabled={procesando === p.id}
                                  onClick={() => eliminarProducto(p.id, p.nombre)}
                                  style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, opacity: procesando === p.id ? 0.6 : 1 }}>
                                  <Trash2 size={13} /> Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
