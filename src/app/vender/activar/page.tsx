'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Store, Scissors, CheckCircle } from 'lucide-react'
import { UserRole } from '@/types'

const TIPOS = [
  { rol: 'vendedor_personal' as UserRole, icon: <ShoppingBag size={32} color="var(--verde)" />, titulo: 'Vendo cosas personales', desc: 'Ropa, muebles, electrónicos, animales y más cosas que tienes.' },
  { rol: 'local_negocio' as UserRole, icon: <Store size={32} color="var(--verde)" />, titulo: 'Tengo un local o negocio', desc: 'Tienda, abarrotes, carnicería, panadería, productores del campo.' },
  { rol: 'servicio' as UserRole, icon: <Scissors size={32} color="var(--verde)" />, titulo: 'Ofrezco un servicio', desc: 'Uñas, cortes, plomería, electricidad, costura y más.' },
]

export default function ActivarVendedor() {
  const { user, activarVendedor } = useAuth()
  const router = useRouter()
  const [tipoSeleccionado, setTipoSeleccionado] = useState<UserRole | null>(null)
  const [paso, setPaso] = useState<'tipo' | 'datos' | 'espera'>('tipo')
  const [nombre, setNombre] = useState(user?.nombre || '')
  const [whatsapp, setWhatsapp] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tipoSeleccionado) return
    setLoading(true)
    await activarVendedor(tipoSeleccionado, { nombre, whatsapp, descripcion })
    setPaso('espera')
    setLoading(false)
  }

  if (!user) {
    router.push('/login')
    return null
  }

  if (paso === 'espera') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div style={{ background: 'white', borderRadius: 20, padding: '40px 32px', maxWidth: 440, textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
          <CheckCircle size={64} color="var(--verde)" style={{ marginBottom: 20 }} />
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>¡Solicitud enviada!</h2>
          <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: 24 }}>
            Tu perfil de vendedor está en revisión. El administrador lo aprobará pronto y recibirás una notificación por correo. ⏳
          </p>
          <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '16px', marginBottom: 24, textAlign: 'left' }}>
            <p style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>¿Qué sigue?</p>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Una vez aprobado, podrás publicar tus productos y servicios en Pánuco Market.</p>
          </div>
          <button onClick={() => router.push('/')} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }}>
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--fondo)', padding: '24px 16px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6 }}>Quiero vender en Pánuco Market</h1>
        <p style={{ color: '#64748b', marginBottom: 28 }}>Elige el tipo de perfil que mejor te describe</p>

        {paso === 'tipo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {TIPOS.map(t => (
              <div key={t.rol} onClick={() => setTipoSeleccionado(t.rol)}
                style={{ background: 'white', borderRadius: 16, padding: '20px', cursor: 'pointer', border: `2px solid ${tipoSeleccionado === t.rol ? 'var(--verde)' : 'var(--borde)'}`, display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.2s' }}>
                <div style={{ background: 'var(--verde-claro)', borderRadius: 12, padding: 12, flexShrink: 0 }}>{t.icon}</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{t.titulo}</h3>
                  <p style={{ fontSize: 13, color: '#64748b' }}>{t.desc}</p>
                </div>
              </div>
            ))}
            <button onClick={() => tipoSeleccionado && setPaso('datos')} className="btn-primary" disabled={!tipoSeleccionado} style={{ width: '100%', justifyContent: 'center', padding: 14, marginTop: 8, opacity: tipoSeleccionado ? 1 : 0.5 }}>
              Continuar →
            </button>
          </div>
        )}

        {paso === 'datos' && (
          <form onSubmit={handleEnviar} style={{ background: 'white', borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Completa tu perfil de vendedor</h2>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: 'block' }}>
                {tipoSeleccionado === 'local_negocio' ? 'Nombre del negocio' : 'Tu nombre'}
              </label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: 'block' }}>WhatsApp de contacto</label>
              <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="889 123 4567" required />
            </div>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: 'block' }}>Descripción</label>
              <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Cuéntanos qué vendes o qué servicios ofreces..." rows={3} style={{ resize: 'vertical' }} required />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={() => setPaso('tipo')} className="btn-secondary" style={{ flex: 1, padding: 12 }}>← Atrás</button>
              <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2, justifyContent: 'center', padding: 12 }}>
                {loading ? 'Enviando...' : 'Enviar solicitud'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
