'use client'
import { Producto } from '@/types'
import { MessageCircle, Share2, Heart, MapPin, Pause, Play, Trash2, Edit } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useProductos } from '@/context/ProductosContext'

export default function ProductoCard({ producto, editable }: { producto: Producto, editable?: boolean }) {
  const { user } = useAuth()
  const { pausarProducto, eliminarProducto } = useProductos()
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(Math.floor(Math.random() * 20))

  const handleLike = () => {
    setLiked(!liked)
    setLikes(prev => liked ? prev - 1 : prev + 1)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: producto.nombre, text: `${producto.nombre} - $${producto.precio}`, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('¡Enlace copiado!')
    }
  }

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Hola! Vi tu publicación en Pánuco Market: *${producto.nombre}* - $${producto.precio}. ¿Sigue disponible?`)
    window.open(`https://wa.me/52${producto.whatsapp_contacto}?text=${msg}`, '_blank')
  }

  return (
    <div className="card" style={{ opacity: producto.estado === 'pausado' ? 0.6 : 1 }}>
      {/* Imagen */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <img
          src={producto.foto_url || 'https://via.placeholder.com/400x200?text=Sin+foto'}
          alt={producto.nombre}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Sin+foto')}
        />
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <span className="badge badge-verde">{producto.categoria}</span>
        </div>
        {producto.estado === 'pausado' && (
          <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <span className="badge badge-gris">Pausado</span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, flex: 1, marginRight: 8 }}>{producto.nombre}</h3>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--verde)', flexShrink: 0 }}>${producto.precio}</span>
        </div>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 10, lineHeight: 1.4 }}>{producto.descripcion}</p>

        {producto.cantidad_disponible && (
          <p style={{ fontSize: 12, color: 'var(--gris)', marginBottom: 8 }}>
            Disponibles: {producto.cantidad_disponible}
          </p>
        )}

        {/* Vendedor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, paddingTop: 10, borderTop: '1px solid var(--borde)' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--verde-claro)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--verde-oscuro)' }}>
            {producto.vendedor?.nombre?.[0] || 'V'}
          </div>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{producto.vendedor?.nombre || 'Vendedor'}</span>
        </div>

        {/* Acciones */}
        {editable ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => pausarProducto(producto.id)} className="btn-secondary" style={{ flex: 1, padding: '8px', fontSize: 13 }}>
              {producto.estado === 'activo' ? <><Pause size={14} /> Pausar</> : <><Play size={14} /> Activar</>}
            </button>
            <button onClick={() => eliminarProducto(producto.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, fontSize: 13 }}>
              <Trash2 size={14} /> Eliminar
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleWhatsApp} className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: 13, background: '#16a34a' }}>
              <MessageCircle size={15} /> Contactar
            </button>
            <button onClick={handleLike} style={{ background: liked ? '#fee2e2' : '#f1f5f9', border: 'none', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: liked ? '#dc2626' : '#64748b' }}>
              <Heart size={15} fill={liked ? '#dc2626' : 'transparent'} color={liked ? '#dc2626' : '#64748b'} /> {likes}
            </button>
            <button onClick={handleShare} style={{ background: '#f1f5f9', border: 'none', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', color: '#64748b' }}>
              <Share2 size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
