'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { User, UserRole } from '@/types'

interface AuthContextType {
  user: User | null
  login: (correo: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (nombre: string, correo: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  activarVendedor: (tipo: UserRole, datos: Partial<User>) => Promise<boolean>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const cargarPerfil = async (uid: string) => {
    const { data } = await supabase.from('perfiles').select('*').eq('id', uid).single()
    if (data) setUser(data as User)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) cargarPerfil(session.user.id)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) cargarPerfil(session.user.id)
      else setUser(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const login = async (correo: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: correo, password })
    if (error) return { ok: false, error: 'Correo o contraseña incorrectos' }
    return { ok: true }
  }

  const register = async (nombre: string, correo: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email: correo, password,
      options: { data: { nombre } }
    })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  }

  const activarVendedor = async (tipo: UserRole, datos: Partial<User>) => {
    if (!user) return false
    const { error } = await supabase.from('perfiles').update({
      rol: tipo,
      aprobado: false,
      whatsapp: datos.whatsapp,
      descripcion: datos.descripcion,
      nombre: datos.nombre,
    }).eq('id', user.id)
    if (!error) await cargarPerfil(user.id)
    return !error
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, activarVendedor, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
