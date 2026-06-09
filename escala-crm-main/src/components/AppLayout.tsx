'use client'

import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { ToastProvider } from './Toast'

interface AppLayoutProps {
  user: {
    nombre: string
    rol: string
    email: string
  }
  title: string
  children: React.ReactNode
  showReporteButton?: boolean
  onEnviarReporte?: () => void
}

export default function AppLayout({ user, title, children, showReporteButton, onEnviarReporte }: AppLayoutProps) {
  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar user={user} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar title={title} showReporteButton={showReporteButton} onEnviarReporte={onEnviarReporte} />
          <main className="flex-1 overflow-y-auto" style={{ backgroundColor: '#F8FAFC' }}>
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
