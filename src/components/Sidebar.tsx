'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  FileText, LayoutDashboard, Users, BarChart2, BookOpen, Trophy,
  User, Settings, LogOut, Plus, ChevronRight
} from 'lucide-react'

interface SidebarProps {
  user: {
    nombre: string
    rol: string
    email: string
  }
}

const clienteNavItems = [
  { href: '/reporte', label: 'Reporte Diario', icon: FileText },
  { href: '/panel', label: 'Panel de Control', icon: LayoutDashboard },
  { href: '/leads', label: 'Pipeline de Leads', icon: Users },
  { href: '/contenido', label: 'Contenido', icon: BookOpen },
  { href: '/ranking', label: 'Ranking', icon: Trophy },
]

const adminNavItems = [
  { href: '/reporte', label: 'Reporte Diario', icon: FileText },
  { href: '/panel', label: 'Panel de Control', icon: LayoutDashboard },
  { href: '/leads', label: 'Pipeline de Leads', icon: Users },
  { href: '/contenido', label: 'Contenido', icon: BookOpen },
  { href: '/ranking', label: 'Ranking', icon: Trophy },
]

const adminOnlyItems = [
  { href: '/admin', label: 'Vista General', icon: BarChart2 },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
]

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isAdmin = user.rol === 'admin'
  const navItems = isAdmin ? adminNavItems : clienteNavItems

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const isActive = (href: string) => {
    if (href === '/admin' && pathname === '/admin') return true
    if (href !== '/admin' && pathname.startsWith(href)) return true
    return false
  }

  return (
    <aside
      className="flex flex-col h-screen w-[260px] flex-shrink-0"
      style={{ backgroundColor: '#0F172A' }}
    >
      {/* Logo */}
      <div className="flex flex-col justify-center px-6" style={{ height: 64 }}>
        <div
          className="text-white"
          style={{ fontSize: 13, fontWeight: 300, letterSpacing: '0.3em' }}
        >
          ESCALA
        </div>
        <div
          style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, marginTop: 2 }}
        >
          Joan Escala Consulting
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto pt-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-6 w-full transition-all"
              style={{
                height: 48,
                backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: active ? '#ffffff' : 'rgba(255,255,255,0.45)',
                fontSize: 13,
                fontWeight: active ? 600 : 300,
                letterSpacing: '0.06em',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
                }
              }}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          )
        })}

        {/* Admin section */}
        {isAdmin && (
          <>
            <div
              className="px-6 pt-4 pb-1"
              style={{ fontSize: 9, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}
            >
              Consultoría
            </div>
            {adminOnlyItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-6 w-full transition-all"
                  style={{
                    height: 48,
                    backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: active ? '#ffffff' : 'rgba(255,255,255,0.45)',
                    fontSize: 13,
                    fontWeight: active ? 600 : 300,
                    letterSpacing: '0.06em',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
                    }
                  }}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              )
            })}

            {/* Add Client Button */}
            <div className="px-2 mt-3">
              <Link
                href="/admin/clientes?new=1"
                className="flex items-center justify-center gap-2 w-full transition-all"
                style={{
                  height: 36,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontSize: 11,
                  fontWeight: 400,
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                }}
              >
                <Plus size={12} />
                Añadir Cliente
              </Link>
            </div>
          </>
        )}
      </nav>

      {/* Footer */}
      <div
        className="flex items-center gap-3 px-4"
        style={{ height: 56, borderTop: '1px solid rgba(0,0,0,0.15)' }}
      >
        {/* Avatar */}
        <div
          className="flex items-center justify-center flex-shrink-0 rounded-full text-white text-sm font-medium"
          style={{
            width: 28,
            height: 28,
            backgroundColor: 'rgba(255,255,255,0.12)',
            fontSize: 12,
          }}
        >
          {user.nombre.charAt(0).toUpperCase()}
        </div>

        {/* User info */}
        <div className="flex-1 min-w-0">
          <div className="text-white truncate" style={{ fontSize: 13 }}>
            {user.nombre}
          </div>
          <div className="truncate" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
            {isAdmin ? 'Consultor' : 'Cliente'}
          </div>
        </div>

        {/* Profile link */}
        <Link
          href="/perfil"
          className="flex-shrink-0 transition-opacity hover:opacity-100"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          title="Perfil"
        >
          <Settings size={14} />
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex-shrink-0 transition-opacity hover:opacity-100"
          style={{ color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          title="Cerrar sesión"
        >
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  )
}
