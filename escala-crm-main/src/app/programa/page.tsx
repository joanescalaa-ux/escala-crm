'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { ToastProvider } from '@/components/Toast'
import { CheckCircle, Circle, Lock, BookOpen, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react'

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
  cash_cobrado: number
  ventas_cerradas: number
  reels_publicados: number
  racha: number
}

const FASES = [
  {
    num: 1, semanas: 'S1–S4', titulo: 'L — Limpiar el perfil y la promesa',
    descripcion: 'ICP definido, bio optimizada, dream outcome en una frase.',
    color: '#8B5CF6', bgColor: '#F5F3FF',
    tareas: [
      'Definir tu ICP con el Canvas de Cliente Ideal',
      'Optimizar tu bio de Instagram',
      'Escribir tu dream outcome en una frase',
      'Auditoría de tu perfil actual',
    ],
    recursos: [
      { label: 'Canvas de ICP', url: '#' },
      { label: 'Plantilla de Bio', url: '#' },
    ]
  },
  {
    num: 2, semanas: 'S5–S8', titulo: 'A — Audiencia cualificada',
    descripcion: 'Contenido que atrae, outbound sistemático, calendario de contenido.',
    color: '#0891B2', bgColor: '#F0F9FF',
    tareas: [
      'Configurar calendario de contenido (Reels + Stories)',
      'Lanzar sistema de outbound: 15 DMs diarios',
      'Activar ManyChat con keyword principal',
      'Primera semana completa de reporte diario',
    ],
    recursos: [
      { label: 'SOP de Outbound', url: '#' },
      { label: 'Digging Pain SOP', url: '#' },
      { label: 'Content Plan 30 días', url: '#' },
    ]
  },
  {
    num: 3, semanas: 'S9–S12', titulo: 'N — Nichar el infoproducto',
    descripcion: 'Validación de idea, pricing psicológico, empaquetado.',
    color: '#059669', bgColor: '#F0FDF4',
    tareas: [
      'Validar tu oferta con 3 conversaciones reales',
      'Definir precio y estructura del programa',
      'Crear tu Offer Sheet',
      'Primer cierre de prueba',
    ],
    recursos: [
      { label: 'Offer Sheet', url: '#' },
      { label: 'Estructura de Precios', url: '#' },
    ]
  },
  {
    num: 4, semanas: 'S13–S16', titulo: 'Z — Zapata de venta (VSL + Funnel)',
    descripcion: 'VSL de 6 pasos, página de captación, GHL configurado.',
    color: '#D97706', bgColor: '#FFFBEB',
    tareas: [
      'Grabar tu VSL de 6 pasos',
      'Montar landing page de captación',
      'Configurar GHL con automatizaciones',
      'Test completo del funnel',
    ],
    recursos: [
      { label: 'Guión VSL', url: '#' },
      { label: 'Setup GHL', url: '#' },
    ]
  },
  {
    num: 5, semanas: 'S17–S24', titulo: 'A — Activar el lanzamiento',
    descripcion: 'Plan de 7 días, scripts de DM, protocolo de rescate.',
    color: '#DC2626', bgColor: '#FEF2F2',
    tareas: [
      'Ejecutar plan de lanzamiento de 7 días',
      'Activar campana de cash injection',
      'Protocolo de rescate para leads fríos',
      'Primer lanzamiento rentable',
    ],
    recursos: [
      { label: 'Plan de Lanzamiento', url: '#' },
      { label: 'Cash Injection Campaign', url: '#' },
      { label: 'Revivir Leads SOP', url: '#' },
    ]
  },
]

function FaseCard({ fase, idx }: { fase: typeof FASES[0]; idx: number }) {
  const [expanded, setExpanded] = useState(idx === 0)
  const bloqueada = idx > 1 // Solo primeras 2 fases desbloqueadas de ejemplo

  return (
    <div style={{
      border: `1px solid ${bloqueada ? '#E2E8F0' : fase.color + '40'}`,
      borderRadius: 12,
      overflow: 'hidden',
      opacity: bloqueada ? 0.6 : 1,
    }}>
      <button
        onClick={() => !bloqueada && setExpanded(!expanded)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 16,
          padding: '18px 20px', backgroundColor: bloqueada ? '#F8FAFC' : fase.bgColor,
          border: 'none', cursor: bloqueada ? 'not-allowed' : 'pointer',
          textAlign: 'left', fontFamily: 'inherit',
        }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, backgroundColor: bloqueada ? '#E2E8F0' : fase.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {bloqueada ? <Lock size={16} color="#94A3B8" /> : <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{fase.num}</span>}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>{fase.semanas}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{fase.titulo}</div>
        </div>
        {!bloqueada && (expanded ? <ChevronDown size={16} color="#94A3B8" /> : <ChevronRight size={16} color="#94A3B8" />)}
        {bloqueada && <span style={{ fontSize: 11, color: '#94A3B8', backgroundColor: '#E2E8F0', padding: '3px 10px', borderRadius: 20 }}>Bloqueado</span>}
      </button>

      {expanded && !bloqueada && (
        <div style={{ padding: '0 20px 20px', backgroundColor: '#fff' }}>
          <div style={{ fontSize: 13, color: '#64748B', marginBottom: 16, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
            {fase.descripcion}
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', marginBottom: 10, textTransform: 'uppercase' }}>Tareas de esta fase</div>
            {fase.tareas.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                <Circle size={16} color="#CBD5E1" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 13, color: '#374151' }}>{t}</span>
              </div>
            ))}
          </div>
          {fase.recursos.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', marginBottom: 10, textTransform: 'uppercase' }}>Recursos</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {fase.recursos.map((r, i) => (
                  <a key={i} href={r.url} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', backgroundColor: fase.bgColor,
                    border: `1px solid ${fase.color}40`, borderRadius: 8,
                    fontSize: 12, color: fase.color, fontWeight: 500, textDecoration: 'none',
                  }}>
                    <BookOpen size={12} />
                    {r.label}
                    <ExternalLink size={10} />
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.json()),
      fetch('/api/onboarding').then(r => r.json()),
    ]).then(([u, ob]) => {
      setUser(u)
      if (ob.onboarding) {
        setOnboarding(ob.onboarding)
        if (!ob.onboarding.completado) {
          router.push('/onboarding')
          return
        }
      } else {
        router.push('/onboarding')
        return
      }

      // Load quick stats
      if (u.clienteId) {
        fetch(`/api/panel?clienteId=${u.clienteId}&dias=30`)
          .then(r => r.json())
          .then(d => {
            if (d.stats) setStats(d.stats)
          })
      }
      setLoading(false)
    })
  }, [router])

  if (loading || !user) return null

  const nombre = onboarding?.nombre_completo?.split(' ')[0] || user.nombre

  return (
    <ToastProvider>
      <AppLayout user={user} title="Mi Programa">
        <div style={{ padding: '32px 24px', maxWidth: 860, margin: '0 auto' }}>

          {/* Hero saludo */}
          <div style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
            borderRadius: 16, padding: '28px 32px', marginBottom: 24, color: '#fff',
          }}>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>MAESTRÍA DE ESCALA · MÉTODO LANZA</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'Sora, sans-serif', marginBottom: 4 }}>
              Hola, {nombre} 👋
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              {onboarding?.objetivo_90_dias
                ? `Tu objetivo: "${onboarding.objetivo_90_dias}"`
                : 'Bienvenido a tu programa de Maestría de Escala.'}
            </div>

            {/* Quick stats */}
            {stats && (
              <div style={{ display: 'flex', gap: 24, marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {[
                  { label: 'Cash cobrado', value: `€${stats.cash_cobrado?.toLocaleString('es-ES') || '0'}` },
                  { label: 'Ventas cerradas', value: stats.ventas_cerradas || 0 },
                  { label: 'Reels publicados', value: stats.reels_publicados || 0 },
                  { label: 'Racha actual', value: `${stats.racha || 0} días 🔥` },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{s.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
            {/* Columna principal: Fases */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', letterSpacing: '0.05em', marginBottom: 14, textTransform: 'uppercase' }}>
                Hoja de Ruta — 180 Días
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {FASES.map((fase, idx) => (
                  <FaseCard key={fase.num} fase={fase} idx={idx} />
                ))}
              </div>
            </div>

            {/* Columna lateral */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Tu perfil */}
              <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', marginBottom: 14, textTransform: 'uppercase' }}>Tu perfil</div>
                {[
                  { label: 'Instagram', value: onboarding?.instagram_handle ? `@${onboarding.instagram_handle}` : '—' },
                  { label: 'Nicho', value: onboarding?.nicho || '—' },
                  { label: 'Facturación actual', value: onboarding?.facturacion_actual || '—' },
                  { label: 'Horas/semana', value: onboarding?.horas_disponibles || '—' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>{label}</span>
                    <span style={{ fontSize: 12, color: '#0F172A', fontWeight: 500, textAlign: 'right', maxWidth: 160 }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Setup técnico */}
              <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', marginBottom: 14, textTransform: 'uppercase' }}>Setup técnico</div>
                {[
                  { label: 'Instagram', done: onboarding?.tiene_instagram },
                  { label: 'ManyChat', done: onboarding?.tiene_manychat },
                  { label: 'GoHighLevel', done: onboarding?.tiene_ghl },
                ].map(({ label, done }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    {done
                      ? <CheckCircle size={16} color="#059669" />
                      : <Circle size={16} color="#CBD5E1" />}
                    <span style={{ fontSize: 13, color: done ? '#0F172A' : '#94A3B8', fontWeight: done ? 500 : 400 }}>{label}</span>
                    {!done && <span style={{ fontSize: 10, color: '#F59E0B', backgroundColor: '#FEF3C7', padding: '1px 6px', borderRadius: 10, fontWeight: 600 }}>Pendiente</span>}
                  </div>
                ))}
                {onboarding?.link_notion && (
                  <a href={onboarding.link_notion} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#0891B2', marginTop: 12, textDecoration: 'none', fontWeight: 500 }}>
                    <ExternalLink size={12} />
                    Abrir Notion
                  </a>
                )}
              </div>

              {/* Accesos rápidos */}
              <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', marginBottom: 14, textTransform: 'uppercase' }}>Accesos rápidos</div>
                {[
                  { label: '📊 Reporte diario', href: '/reporte' },
                  { label: '📈 Panel de métricas', href: '/panel' },
                  { label: '👥 Pipeline de leads', href: '/leads' },
                  { label: '🎬 Contenido', href: '/contenido' },
                  { label: '🏆 Ranking', href: '/ranking' },
                ].map(({ label, href }) => (
                  <a key={href} href={href} style={{
                    display: 'block', fontSize: 13, color: '#374151', padding: '8px 0',
                    borderBottom: '1px solid #F1F5F9', textDecoration: 'none', fontWeight: 400,
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#0891B2')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#374151')}>
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
