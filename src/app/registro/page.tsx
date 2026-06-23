'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, User, Mail, Lock, CheckCircle } from 'lucide-react'

export default function Registro() {
  const { register } = useAuth()
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'verificar'>('form')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setLoading(true)
    setError('')
    setStep('verificar')
    setTimeout(async () => {
      await register(nombre, correo, password)
      router.push('/')
    }, 2000)
    setLoading(false)
  }

  if (step === 'verificar') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div style={{ background: 'white', borderRadius: 20, padding: '40px 32px', width: '100%', maxWidth: 420, textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
          <CheckCircle size={60} color="var(--verde)" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>¡Revisa tu correo!</h2>
          <p style={{ color: '#64748b', lineHeight: 1.6 }}>
            Enviamos un código de verificación a <strong>{correo}</strong>. Ingrésalo para activar tu cuenta.
          </p>
          <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 16 }}>Redirigiendo automáticamente...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 20, padding: '40px 32px', width: '100%', maxWidth: 420, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ background: 'var(--verde)', borderRadius: 16, width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <ShoppingBag size={28} color="white" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Crear cuenta</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Gratis, sin tarjeta</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: 'block' }}>Nombre completo</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gris)' }} />
              <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" style={{ paddingLeft: 38 }} required />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: 'block' }}>Correo electrónico</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gris)' }} />
              <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="tu@correo.com" style={{ paddingLeft: 38 }} required />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: 'block' }}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gris)' }} />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" style={{ paddingLeft: 38 }} required />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: 'block' }}>Confirmar contraseña</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gris)' }} />
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repite tu contraseña" style={{ paddingLeft: 38 }} required />
            </div>
          </div>

          {error && <p style={{ color: '#dc2626', fontSize: 14, background: '#fee2e2', padding: '10px 14px', borderRadius: 8 }}>{error}</p>}

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 16 }}>
            Crear cuenta gratis
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' }}>
          ¿Ya tienes cuenta? <Link href="/login" style={{ color: 'var(--verde)', fontWeight: 600 }}>Iniciar sesión</Link>
        </p>
      </div>
    </div>
  )
}
