'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { ShoppingBag, User, LogOut, Plus, Shield, Search, X, Menu } from 'lucide-react'
import Link from 'next/link'

export default function Navbar({ onSearch }: { onSearch?: (q: string) => void }) {
  const { user, logout } = useAuth()
  const [searchVal, setSearchVal] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchVal)
  }

  return (
    <nav style={{ background: 'white', borderBottom: '2px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <div style={{ background: '#16a34a', borderRadius: 10, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <ShoppingBag size={16} color="white" />
            <span style={{ color: 'white', fontWeight: 800, fontSize: 14 }}>Pánuco</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#16a34a' }}>Market</span>
        </Link>

        {/* Search — solo si hay onSearch */}
        {onSearch && (
          <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 0 }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Buscar..."
                style={{ paddingLeft: 32, margin: 0, width: '100%', fontSize: 13, padding: '8px 8px 8px 32px', border: '1px solid #e2e8f0', borderRadius: 10, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </form>
        )}

        {/* Espacio flexible si no hay search */}
        {!onSearch && <div style={{ flex: 1 }} />}

        {/* Botones de usuario */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {user.rol === 'admin' && (
              <Link href="/admin" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'white', border: '1.5px solid #16a34a', color: '#16a34a', borderRadius: 10, padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>
                  <Shield size={14} /> Admin
                </button>
              </Link>
            )}
            {(user.rol === 'vendedor_personal' || user.rol === 'local_negocio' || user.rol === 'servicio') && user.aprobado && (
              <Link href="/vender" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: 10, padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>
                  <Plus size={14} /> Publicar
                </button>
              </Link>
            )}
            {user.rol === 'cliente' && (
              <Link href="/vender/activar" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: 10, padding: '7px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>
                  <Plus size={13} /> Vender
                </button>
              </Link>
            )}
            <Link href="/perfil" style={{ textDecoration: 'none' }}>
              <button style={{ background: '#f1f5f9', border: 'none', borderRadius: 10, padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', maxWidth: 100, overflow: 'hidden' }}>
                <User size={14} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.nombre.split(' ')[0]}</span>
              </button>
            </Link>
            <button onClick={logout} style={{ background: '#fee2e2', border: 'none', borderRadius: 10, padding: '7px 10px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <button style={{ background: 'white', border: '1.5px solid #16a34a', color: '#16a34a', borderRadius: 10, padding: '7px 14px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                Entrar
              </button>
            </Link>
            <Link href="/registro" style={{ textDecoration: 'none' }}>
              <button style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: 10, padding: '7px 14px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                Registrarse
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
