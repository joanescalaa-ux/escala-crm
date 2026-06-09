'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { ToastProvider } from '@/components/Toast'

interface User {
  id: number; email: string; rol: string; clienteId: number | null; nombre: string; primerNombre: string
}
interface OnboardingData {
  completado: boolean
  nombre_completo?: string
  instagram_handle?: string
  nicho?: string
  objetivo_90_dias?: string
  horas_disponibles?: string
  tiene_instagram?: boolean
  tiene_manychat?: boolean
  tiene_ghl?: boolean
  link_notion?: string
  facturacion_actual?: string
}
interface PanelStats {
  cash_cobrado: number; ventas_cerradas: number; reels_publicados: number; racha: number
}

const FASES = [
  { num: 1, semanas: 'S1–S4', titulo: 'L — Limpiar el perfil y la promesa', descripcion: 'ICP definido, bio optimizada, dream outcome en una frase.',
    tareas: ['Definir tu ICP con el Canvas de Cliente Ideal', 'Optimizar tu bio de Instagram', 'Escribir tu dream outcome en una frase', 'Auditoría de tu perfil actual'],
    recursos: [{ label: 'Canvas de ICP', url: '#' }, { label: 'Plantilla de Bio', url: '#' }] },
  { num: 2, semanas: 'S5–S8', titulo: 'A — Audiencia cualificada', descripcion: 'Contenido que atrae, outbound sistemático, calendario de contenido.',
    tareas: ['Configurar calendario de contenido', 'Lanzar sistema de outbound: 15 DMs diarios', 'Activar ManyChat con keyword principal', 'Primera semana completa de reporte diario'],
    recursos: [{ label: 'SOP de Outbound', url: '#' }, { label: 'Digging Pain SOP', url: '#' }, { label: 'Content Plan 30 días', url: '#' }] },
  { num: 3, semanas: 'S9–S12', titulo: 'N — Nichar el infoproducto', descripcion: 'Validación de idea, pricing psicológico, empaquetado.',
    tareas: ['Validar tu oferta con 3 conversaciones reales', 'Definir precio y estructura del programa', 'Crear tu Offer Sheet', 'Primer cierre de prueba'],
    recursos: [{ label: 'Offer Sheet', url: '#' }, { label: 'Estructura de Precios', url: '#' }] },
  { num: 4, semanas: 'S13–S16', titulo: 'Z — Zapata de venta (VSL + Funnel)', descripcion: 'VSL de 6 pasos, página de captación, GHL configurado.',
    tareas: ['Grabar tu VSL de 6 pasos', 'Montar landing page de captación', 'Configurar GHL con automatizaciones', 'Test completo del funnel'],
    recursos: [{ label: 'Guión VSL', url: '#' }, { label: 'Setup GHL', url: '#' }] },
  { num: 5, semanas: 'S17–S24', titulo: 'A — Activar el lanzamiento', descripcion: 'Plan de 7 días, scripts de DM, protocolo de rescate.',
    tareas: ['Ejecutar plan de lanzamiento de 7 días', 'Activar campaña de cash injection', 'Protocolo de rescate para leads fríos', 'Primer lanzamiento rentable'],
    recursos: [{ label: 'Plan de Lanzamiento', url: '#' }, { label: 'Cash Injection Campaign', url: '#' }] },
]

function FaseCard({ fase, desbloqueada }: { fase: typeof FASES[0]; desbloqueada: boolean }) {
  const [expanded, setExpanded] = useState(fase.num === 1 && desbloqueada)

  return (
    <div style={{ border: `1px solid ${desbloqueada && expanded ? '#0A0A0A' : '#E5E7EB'}`, borderRadius: 10, overflow: 'hidden', opacity: desbloqueada ? 1 : 0.45 }}>
      <button onClick={() => desbloqueada && setExpanded(!expanded)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 18px', backgroundColor: expanded ? '#0A0A0A' : '#fff',
          border: 'none', cursor: desbloqueada ? 'pointer' : 'not-allowed',
          textAlign: 'left', fontFamily: 'inherit',
        }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          backgroundColor: expanded ? '#F8F284' : (desbloqueada ? '#0A0A0A' : '#E5E7EB'),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {desbloqueada
            ? <span style={{ fontSize: 13, fontWeight: 700, color: expanded ? '#0A0A0A' : '#F8F284' }}>{fase.num}</span>
            : <i className="ti ti-lock" style={{ fontSize: 14, color: '#9CA3AF' }} />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: expanded ? 'rgba(255,255,255,0.4)' : '#9CA3AF', marginBottom: 2 }}>{fase.semanas}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: expanded ? '#fff' : '#0A0A0A' }}>{fase.titulo}</div>
        </div>
        {desbloqueada
          ? <i className={`ti ${expanded ? 'ti-chevron-up' : 'ti-chevron-down'}`} style={{ fontSize: 16, color: expanded ? 'rgba(255,255,255,0.4)' : '#9CA3AF' }} />
          : <span style={{ fontSize: 11, color: '#9CA3AF', backgroundColor: '#F3F4F6', padding: '2px 8px', borderRadius: 20 }}>Bloqueado</span>}
      </button>

      {expanded && desbloqueada && (
        <div style={{ padding: '16px 18px', backgroundColor: '#fff', borderTop: '1px solid #E5E7EB' }}>
          <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>{fase.descripcion}</p>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Tareas</div>
            {fase.tareas.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 18, height: 18, border: '1.5px solid #D1D5DB', borderRadius: 4, flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 13, color: '#374151' }}>{t}</span>
              </div>
            ))}
          </div>
          {fase.recursos.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Recursos</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {fase.recursos.map((r, i) => (
                  <a key={i} href={r.url} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                    backgroundColor: '#F9F9F9', border: '1px solid #E5E7EB', borderRadius: 8,
                    fontSize: 12, color: '#0A0A0A', fontWeight: 500, textDecoration: 'none',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#0A0A0A'; e.currentTarget.style.color = '#F8F284' }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F9F9F9'; e.currentTarget.style.color = '#0A0A0A' }}>
                    <i className="ti ti-book" style={{ fontSize: 13 }} />
                    {r.label}
                    <i className="ti ti-external-link" style={{ fontSize: 11 }} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ProgramaPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null)
  const [stats, setStats] = useState<PanelStats | null>(null)
  const [fasesDesbloqueadas, setFasesDesbloqueadas] = useState<number[]>([1, 2])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.json()),
      fetch('/api/onboarding').then(r => r.json()),
    ]).then(([u, ob]) => {
      setUser(u)
      if (!ob.onboarding?.completado) { router.push('/onboarding'); return }
      setOnboarding(ob.onboarding)
      if (u.clienteId) {
        fetch(`/api/panel?clienteId=${u.clienteId}&dias=30`).then(r => r.json()).then(d => {
          if (d.stats) setStats(d.stats)
        })
        fetch(`/api/programa/fases?clienteId=${u.clienteId}`).then(r => r.json()).then(d => {
          if (d.desbloqueadas) setFasesDesbloqueadas(d.desbloqueadas)
        }).catch(() => {})
      }
      setLoading(false)
    })
  }, [router])

  if (loading || !user) return null
  const nombre = onboarding?.nombre_completo?.split(' ')[0] || user.nombre

  return (
    <ToastProvider>
      <AppLayout user={user} title="Mi Programa">
        <div style={{ padding: '28px 24px', maxWidth: 900, margin: '0 auto' }}>

          {/* Hero */}
          <div style={{ backgroundColor: '#0A0A0A', borderRadius: 12, padding: '24px 28px', marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>MAESTRÍA DE ESCALA · MÉTODO LANZA</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: 'Sora, sans-serif', marginBottom: onboarding?.objetivo_90_dias ? 4 : 0 }}>
              Hola, {nombre} 👋
            </div>
            {onboarding?.objetivo_90_dias && (
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>
                Objetivo: {onboarding.objetivo_90_dias}
              </div>
            )}
            {stats && (
              <div style={{ display: 'flex', gap: 28, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {[
                  { label: 'Cash cobrado', value: `€${stats.cash_cobrado?.toLocaleString('es-ES') || '0'}`, highlight: true },
                  { label: 'Ventas cerradas', value: stats.ventas_cerradas || 0 },
                  { label: 'Reels publicados', value: stats.reels_publicados || 0 },
                  { label: 'Racha actual', value: `${stats.racha || 0} días 🔥` },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: s.highlight ? '#F8F284' : '#fff' }}>{s.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, alignItems: 'start' }}>
            {/* Fases */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                Hoja de ruta — 180 días
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {FASES.map(fase => (
                  <FaseCard key={fase.num} fase={fase} desbloqueada={fasesDesbloqueadas.includes(fase.num)} />
                ))}
              </div>
            </div>

            {/* Sidebar info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Perfil */}
              <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: 18 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Tu perfil</div>
                {[
                  { label: 'Instagram', value: onboarding?.instagram_handle ? `@${onboarding.instagram_handle}` : '—' },
                  { label: 'Nicho', value: onboarding?.nicho || '—' },
                  { label: 'Facturación actual', value: onboarding?.facturacion_actual || '—' },
                  { label: 'Horas/semana', value: onboarding?.horas_disponibles || '—' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>{label}</span>
                    <span style={{ fontSize: 12, color: '#0A0A0A', fontWeight: 500, textAlign: 'right', maxWidth: 150 }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Setup técnico */}
              <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: 18 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Setup técnico</div>
                {[
                  { label: 'Instagram', done: onboarding?.tiene_instagram },
                  { label: 'ManyChat', done: onboarding?.tiene_manychat },
                  { label: 'GoHighLevel', done: onboarding?.tiene_ghl },
                ].map(({ label, done }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                      backgroundColor: done ? '#0A0A0A' : '#F9F9F9',
                      border: `1.5px solid ${done ? '#0A0A0A' : '#D1D5DB'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {done && <i className="ti ti-check" style={{ fontSize: 11, color: '#F8F284' }} />}
                    </div>
                    <span style={{ fontSize: 13, color: done ? '#0A0A0A' : '#9CA3AF', fontWeight: done ? 500 : 400 }}>{label}</span>
                    {!done && <span style={{ fontSize: 10, color: '#9CA3AF', backgroundColor: '#F3F4F6', padding: '1px 6px', borderRadius: 10, marginLeft: 'auto' }}>Pendiente</span>}
                  </div>
                ))}
                {onboarding?.link_notion && (
                  <a href={onboarding.link_notion} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#0A0A0A', marginTop: 12, textDecoration: 'none', fontWeight: 600 }}>
                    <i className="ti ti-external-link" style={{ fontSize: 13 }} />
                    Abrir Notion
                  </a>
                )}
              </div>

              {/* Accesos rápidos */}
              <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: 18 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Accesos rápidos</div>
                {[
                  { label: 'Reporte diario', href: '/reporte', icon: 'ti-file-text' },
                  { label: 'Panel de métricas', href: '/panel', icon: 'ti-chart-bar' },
                  { label: 'Pipeline de leads', href: '/leads', icon: 'ti-users' },
                  { label: 'Contenido', href: '/contenido', icon: 'ti-video' },
                  { label: 'Ranking', href: '/ranking', icon: 'ti-trophy' },
                ].map(({ label, href, icon }) => (
                  <a key={href} href={href} style={{
                    display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151',
                    padding: '8px 0', borderBottom: '1px solid #F3F4F6', textDecoration: 'none',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#0A0A0A')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#374151')}>
                    <i className={`ti ${icon}`} style={{ fontSize: 15, color: '#9CA3AF' }} />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </ToastProvider>
  )
}
