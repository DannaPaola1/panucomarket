'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { ShoppingBag, User, LogOut, Plus, Shield, Menu, X, Search } from 'lucide-react'
import Link from 'next/link'

export default function Navbar({ onSearch }: { onSearch?: (q: string) => void }) {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchVal)
  }

  return (
    <nav style={{ background: 'white', borderBottom: '2px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ background: 'var(--verde)', borderRadius: 10, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShoppingBag size={18} color="white" />
            <span style={{ color: 'white', fontWeight: 800, fontSize: 16 }}>Pánuco</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--verde)' }}>Market</span>
        </Link>

        {/* Search */}
        {onSearch && (
          <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gris)' }} />
              <input
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Buscar productos, vendedores..."
                style={{ paddingLeft: 38, margin: 0 }}
              />
            </div>
          </form>
        )}

        {/* Desktop menu */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          {user ? (
            <>
              {user.rol === 'admin' && (
                <Link href="/admin" style={{ textDecoration: 'none' }}>
                  <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: 14 }}>
                    <Shield size={16} /> Admin
                  </button>
                </Link>
              )}
              {(user.rol === 'vendedor_personal' || user.rol === 'local_negocio' || user.rol === 'servicio') && user.aprobado && (
                <Link href="/vender" style={{ textDecoration: 'none' }}>
                  <button className="btn-primary" style={{ padding: '8px 14px', fontSize: 14 }}>
                    <Plus size={16} /> Publicar
                  </button>
                </Link>
              )}
              {user.rol === 'cliente' && (
                <Link href="/vender/activar" style={{ textDecoration: 'none' }}>
                  <button className="btn-primary" style={{ padding: '8px 14px', fontSize: 14 }}>
                    <Plus size={16} /> Quiero vender
                  </button>
                </Link>
              )}
              <Link href="/perfil" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#f1f5f9', border: 'none', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 14 }}>
                  <User size={16} /> {user.nombre.split(' ')[0]}
                </button>
              </Link>
              <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gris)', padding: 8 }}>
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: 14 }}>Entrar</button>
              </Link>
              <Link href="/registro" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 14 }}>Registrarse</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
