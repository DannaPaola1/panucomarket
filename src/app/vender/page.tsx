'use client'
import { useState, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useProductos } from '@/context/ProductosContext'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ProductoCard from '@/components/ProductoCard'
import { Plus, Package, ImagePlus, X } from 'lucide-react'
import { Categoria } from '@/types'

const CATEGORIAS: Categoria[] = [
  'Ropa y Accesorios','Electrónica','Alimentos','Hogar y Muebles',
  'Animales','Campo y Ganadería','Servicios de Belleza','Servicios del Hogar',
  'Vehículos','Otros'
]

export default function Vender() {
  const { user } = useAuth()
  const { productos, agregarProducto } = useProductos()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoria, setCategoria] = useState<Categoria>('Otros')
  const [fotoPreview, setFotoPreview] = useState('')
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '')
  const [cantidad, setCantidad] = useState('')
  const [loading, setLoading] = useState(false)
  const [exito, setExito] = useState(false)

  if (!user || user.rol === 'cliente') { router.push('/vender/activar'); return null }
  if (!user.aprobado) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--fondo)' }}>
        <Navbar />
        <div style={{ maxWidth: 500, margin: '80px auto', textAlign: 'center', padding: 24 }}>
          <Package size={64} color="var(--gris)" style={{ marginBottom: 20 }} />
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Perfil en revisión</h2>
          <p style={{ color: '#64748b' }}>Tu solicitud está siendo revisada. Te avisaremos cuando sea aprobada.</p>
        </div>
      </div>
    )
  }

  const misProductos = productos.filter(p => p.vendedor_id === user.id)

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('La foto debe ser menor a 5MB'); return }
    setFotoFile(file)
    const reader = new FileReader()
    reader.onload = () => setFotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handlePublicar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const ok = await agregarProducto({
      vendedor_id: user.id,
      nombre, descripcion,
      precio: parseFloat(precio),
      foto_url: '',
      categoria,
      cantidad_disponible: cantidad ? parseInt(cantidad) : undefined,
      whatsapp_contacto: whatsapp,
      estado: 'activo',
      vendedor: user
    }, fotoFile || undefined)
    if (ok) {
      setNombre(''); setDescripcion(''); setPrecio('')
      setFotoPreview(''); setFotoFile(null); setCantidad('')
      setMostrarForm(false); setExito(true)
      setTimeout(() => setExito(false), 3000)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--fondo)' }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
        {exito && (
          <div style={{ background: '#dcfce7', color: '#16a34a', padding: '14px 20px', borderRadius: 12, marginBottom: 20, fontWeight: 600 }}>
            ✅ ¡Publicación creada exitosamente!
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>Mis publicaciones</h1>
            <p style={{ color: '#64748b', fontSize: 14 }}>{misProductos.length} productos publicados</p>
          </div>
          <button onClick={() => setMostrarForm(!mostrarForm)} className="btn-primary">
            <Plus size={18} /> Nueva publicación
          </button>
        </div>

        {mostrarForm && (
          <form onSubmit={handlePublicar} style={{ background: 'white', borderRadius: 16, padding: '24px', marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <h2 style={{ gridColumn: '1/-1', fontSize: 18, fontWeight: 700 }}>Nueva publicación</h2>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>Foto del producto</label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
              {fotoPreview ? (
                <div style={{ position: 'relative' }}>
                  <img src={fotoPreview} alt="preview" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 12, border: '2px solid var(--verde)' }} />
                  <button type="button" onClick={() => { setFotoPreview(''); setFotoFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                    style={{ position: 'absolute', top: 8, right: 8, background: '#dc2626', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed var(--borde)', borderRadius: 12, padding: '32px', textAlign: 'center', cursor: 'pointer' }}>
                  <ImagePlus size={36} color="var(--gris)" style={{ marginBottom: 8 }} />
                  <p style={{ fontWeight: 600, color: 'var(--verde)', marginBottom: 4 }}>Subir foto</p>
                  <p style={{ fontSize: 12, color: 'var(--gris)' }}>JPG, PNG · Máximo 5MB</p>
                </div>
              )}
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: 'block' }}>Nombre del artículo</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="ej. Silla de madera" required />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: 'block' }}>Descripción</label>
              <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={3} placeholder="Describe tu producto..." required style={{ resize: 'vertical' }} />
            </div>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: 'block' }}>Precio ($MXN)</label>
              <input type="number" value={precio} onChange={e => setPrecio(e.target.value)} placeholder="0.00" required min="0" />
            </div>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: 'block' }}>Categoría</label>
              <select value={categoria} onChange={e => setCategoria(e.target.value as Categoria)}>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: 'block' }}>Cantidad disponible (opcional)</label>
              <input type="number" value={cantidad} onChange={e => setCantidad(e.target.value)} placeholder="ej. 3" min="1" />
            </div>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: 'block' }}>WhatsApp de contacto</label>
              <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="889 123 4567" required />
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10 }}>
              <button type="button" onClick={() => setMostrarForm(false)} className="btn-secondary" style={{ flex: 1, padding: 12 }}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2, justifyContent: 'center', padding: 12 }}>
                {loading ? 'Subiendo...' : '✅ Publicar'}
              </button>
            </div>
          </form>
        )}

        {misProductos.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {misProductos.map(p => <ProductoCard key={p.id} producto={p} editable />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
            <Package size={48} style={{ marginBottom: 16, opacity: 0.4 }} />
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>Aún no tienes publicaciones</h3>
            <p>Crea tu primera publicación arriba</p>
          </div>
        )}
      </div>
    </div>
  )
}
