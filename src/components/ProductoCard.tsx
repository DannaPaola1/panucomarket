'use client'
import { Producto } from '@/types'
import { MessageCircle, Share2, Heart, Pause, Play, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useProductos } from '@/context/ProductosContext'

export default function ProductoCard({ producto, editable }: { producto: Producto, editable?: boolean }) {
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
    <div style={{
      background: 'white',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      opacity: producto.estado === 'pausado' ? 0.6 : 1,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    }}>
      {/* Imagen fija */}
      <div style={{ position: 'relative', height: 200, flexShrink: 0 }}>
        <img
          src={producto.foto_url || 'https://via.placeholder.com/400x200?text=Sin+foto'}
          alt={producto.nombre}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={e => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Sin+foto')}
        />
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <span style={{ background: 'rgba(22,163,74,0.9)', color: 'white', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
            {producto.categoria}
          </span>
        </div>
        {producto.estado === 'pausado' && (
          <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <span style={{ background: 'rgba(100,116,139,0.9)', color: 'white', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
              Pausado
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Nombre y precio */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 8 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {producto.nombre}
          </h3>
          <span style={{ fontSize: 17, fontWeight: 800, color: '#16a34a', flexShrink: 0 }}>
            ${Number(producto.precio).toLocaleString('es-MX')}
          </span>
        </div>

        {/* Descripción */}
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 10, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {producto.descripcion}
        </p>

        {producto.cantidad_disponible && (
          <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
            Disponibles: {producto.cantidad_disponible}
          </p>
        )}

        {/* Vendedor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 10, borderTop: '1px solid #f1f5f9', marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#15803d', flexShrink: 0 }}>
            {producto.vendedor?.nombre?.[0]?.toUpperCase() || 'V'}
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {producto.vendedor?.nombre || 'Vendedor'}
          </span>
        </div>

        {/* Botones */}
        {editable ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => pausarProducto(producto.id)}
              style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 10, padding: '10px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 600, fontSize: 13 }}>
              {producto.estado === 'activo' ? <><Pause size={14} /> Pausar</> : <><Play size={14} /> Activar</>}
            </button>
            <button
              onClick={() => eliminarProducto(producto.id)}
              style={{ flex: 1, background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, padding: '10px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 600, fontSize: 13 }}>
              <Trash2 size={14} /> Eliminar
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleWhatsApp}
              style={{ flex: 1, background: '#16a34a', color: 'white', border: 'none', borderRadius: 10, padding: '10px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 600, fontSize: 13 }}>
              <MessageCircle size={15} /> Contactar
            </button>
            <button
              onClick={handleLike}
              style={{ background: liked ? '#fee2e2' : '#f1f5f9', border: 'none', borderRadius: 10, padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: liked ? '#dc2626' : '#64748b', flexShrink: 0 }}>
              <Heart size={15} fill={liked ? '#dc2626' : 'transparent'} color={liked ? '#dc2626' : '#64748b'} /> {likes}
            </button>
            <button
              onClick={handleShare}
              style={{ background: '#f1f5f9', border: 'none', borderRadius: 10, padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
              <Share2 size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
