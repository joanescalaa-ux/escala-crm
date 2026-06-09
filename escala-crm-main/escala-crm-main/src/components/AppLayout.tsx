'use client'

import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { ToastProvider } from './Toast'

interface AppLayoutProps {
  user: { nombre: string; rol: string; email: string }
  title: string
  children: React.ReactNode
  showReporteButton?: boolean
  onEnviarReporte?: () => void
}

export default function AppLayout({ user, title, children, showReporteButton, onEnviarReporte }: AppLayoutProps) {
  return (
    <ToastProvider>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar user={user} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TopBar title={title} showReporteButton={showReporteButton} onEnviarReporte={onEnviarReporte} />
          <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#F9F9F9' }}>
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
