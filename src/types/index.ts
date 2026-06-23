export type UserRole = 'cliente' | 'vendedor_personal' | 'local_negocio' | 'servicio' | 'admin'

export interface User {
  id: string
  nombre: string
  correo: string
  rol: UserRole
  aprobado?: boolean
  whatsapp?: string
  foto_perfil?: string
  descripcion?: string
  creado_en: string
}

export interface Producto {
  id: string
  vendedor_id: string
  nombre: string
  descripcion: string
  precio: number
  foto_url: string
  categoria: string
  cantidad_disponible?: number
  whatsapp_contacto: string
  estado: 'activo' | 'pausado'
  creado_en: string
  vendedor?: User
}

export type Categoria = 
  | 'Ropa y Accesorios'
  | 'Electrónica'
  | 'Alimentos'
  | 'Hogar y Muebles'
  | 'Animales'
  | 'Campo y Ganadería'
  | 'Servicios de Belleza'
  | 'Servicios del Hogar'
  | 'Vehículos'
  | 'Otros'
