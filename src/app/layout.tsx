import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { ProductosProvider } from '@/context/ProductosContext'

export const metadata: Metadata = {
  title: 'Pánuco Market',
  description: 'El marketplace local de Pánuco, Veracruz',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <ProductosProvider>
            {children}
          </ProductosProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
