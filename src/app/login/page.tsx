'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const router = useRouter()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { ok, error: err } = await login(correo, password)
    if (ok) router.push('/')
    else setError(err || 'Error al iniciar sesión')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 20, padding: '40px 32px', width: '100%', maxWidth: 420, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ background: 'var(--verde)', borderRadius: 16, width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <ShoppingBag size={28} color="white" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Pánuco Market</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Tu contraseña" style={{ paddingLeft: 38, paddingRight: 40 }} required />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gris)' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {error && <p style={{ color: '#dc2626', fontSize: 14, background: '#fee2e2', padding: '10px 14px', borderRadius: 8 }}>{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 16 }}>
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' }}>
          ¿No tienes cuenta? <Link href="/registro" style={{ color: 'var(--verde)', fontWeight: 600 }}>Regístrate gratis</Link>
        </p>
      </div>
    </div>
  )
}
