'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { Producto } from '@/types'

interface ProductosContextType {
  productos: Producto[]
  loading: boolean
  agregarProducto: (p: Omit<Producto, 'id' | 'creado_en'>, foto?: File) => Promise<boolean>
  pausarProducto: (id: string) => Promise<void>
  eliminarProducto: (id: string) => Promise<void>
  recargar: () => Promise<void>
}

const ProductosContext = createContext<ProductosContextType | null>(null)

export function ProductosProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  const cargar = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('productos')
      .select('*, vendedor:perfiles(id, nombre, rol, foto_perfil)')
      .eq('estado', 'activo')
      .order('creado_en', { ascending: false })
    if (data) setProductos(data as Producto[])
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  const subirFoto = async (foto: File, vendedorId: string): Promise<string> => {
    const ext = foto.name.split('.').pop()
    const path = `${vendedorId}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('fotos-productos').upload(path, foto)
    if (error) throw error
    const { data } = supabase.storage.from('fotos-productos').getPublicUrl(path)
    return data.publicUrl
  }

  const agregarProducto = async (p: Omit<Producto, 'id' | 'creado_en'>, foto?: File) => {
    let foto_url = p.foto_url
    if (foto) {
      try { foto_url = await subirFoto(foto, p.vendedor_id) }
      catch { return false }
    }
    const { error } = await supabase.from('productos').insert({ ...p, foto_url })
    if (!error) await cargar()
    return !error
  }

  const pausarProducto = async (id: string) => {
    const p = productos.find(x => x.id === id)
    if (!p) return
    await supabase.from('productos').update({ estado: p.estado === 'activo' ? 'pausado' : 'activo' }).eq('id', id)
    await cargar()
  }

  const eliminarProducto = async (id: string) => {
    await supabase.from('productos').delete().eq('id', id)
    setProductos(prev => prev.filter(p => p.id !== id))
  }

  return (
    <ProductosContext.Provider value={{ productos, loading, agregarProducto, pausarProducto, eliminarProducto, recargar: cargar }}>
      {children}
    </ProductosContext.Provider>
  )
}

export const useProductos = () => {
  const ctx = useContext(ProductosContext)
  if (!ctx) throw new Error('useProductos must be inside ProductosProvider')
  return ctx
}
