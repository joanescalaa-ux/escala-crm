'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface SidebarProps {
  user: { nombre: string; rol: string; email: string }
}

const clienteNav = [
  { href: '/programa', label: 'Mi Programa', icon: 'ti-map-2' },
  { href: '/reporte', label: 'Reporte diario', icon: 'ti-file-text' },
  { href: '/panel', label: 'Panel de métricas', icon: 'ti-chart-bar' },
  { href: '/leads', label: 'Pipeline de leads', icon: 'ti-users' },
  { href: '/contenido', label: 'Contenido', icon: 'ti-video' },
  { href: '/ranking', label: 'Ranking', icon: 'ti-trophy' },
]

const adminNav = [
  { href: '/reporte', label: 'Reporte diario', icon: 'ti-file-text' },
  { href: '/panel', label: 'Panel de métricas', icon: 'ti-chart-bar' },
  { href: '/leads', label: 'Pipeline de leads', icon: 'ti-users' },
  { href: '/contenido', label: 'Contenido', icon: 'ti-video' },
  { href: '/ranking', label: 'Ranking', icon: 'ti-trophy' },
]

const adminOnlyNav = [
  { href: '/admin', label: 'Vista general', icon: 'ti-layout-dashboard' },
  { href: '/admin/clientes', label: 'Clientes', icon: 'ti-users-group' },
]

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isAdmin = user.rol === 'admin'
  const nav = isAdmin ? adminNav : clienteNav

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
    <aside style={{
      width: 220,
      flexShrink: 0,
      backgroundColor: '#0A0A0A',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
    }}>
      <div style={{ padding: '24px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, backgroundColor: '#F8F284',
            borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#0A0A0A', fontFamily: 'Sora, sans-serif' }}>E</span>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.12em' }}>ESCALA</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>Maestría de Escala</div>
          </div>
        </div>
      </div>

      <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.08)', margin: '0 20px 16px' }} />

      <nav style={{ flex: 1, overflowY: 'auto', padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {nav.map(item => {
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8, textDecoration: 'none',
              backgroundColor: active ? 'rgba(248,242,132,0.08)' : 'transparent',
              borderLeft: active ? '2px solid #F8F284' : '2px solid transparent',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <i className={`ti ${item.icon}`} style={{ fontSize: 16, color: active ? '#F8F284' : 'rgba(255,255,255,0.4)' }} aria-hidden="true" />
              <span style={{ fontSize: 13, color: active ? '#F8F284' : 'rgba(255,255,255,0.45)', fontWeight: active ? 500 : 400 }}>
                {item.label}
              </span>
            </Link>
          )
        })}

        {isAdmin && (
          <>
            <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.08)', margin: '12px 2px 10px' }} />
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0 12px 6px' }}>
              Consultoría
            </div>
            {adminOnlyNav.map(item => {
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 8, textDecoration: 'none',
                  backgroundColor: active ? 'rgba(248,242,132,0.08)' : 'transparent',
                  borderLeft: active ? '2px solid #F8F284' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <i className={`ti ${item.icon}`} style={{ fontSize: 16, color: active ? '#F8F284' : 'rgba(255,255,255,0.4)' }} aria-hidden="true" />
                  <span style={{ fontSize: 13, color: active ? '#F8F284' : 'rgba(255,255,255,0.45)', fontWeight: active ? 500 : 400 }}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </>
        )}
      </nav>

      <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.08)', margin: '0 20px' }} />
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', backgroundColor: '#F8F284',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#0A0A0A' }}>
            {user.nombre?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: '#fff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.nombre}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
            {isAdmin ? 'Admin' : 'Cliente'}
          </div>
        </div>
        <button onClick={handleLogout} title="Cerrar sesión"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}
          onMouseEnter={e => (e.currentTarget.style.color = '#F8F284')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}>
          <i className="ti ti-logout" style={{ fontSize: 16 }} aria-hidden="true" />
        </button>
      </div>
    </aside>
  )
}
