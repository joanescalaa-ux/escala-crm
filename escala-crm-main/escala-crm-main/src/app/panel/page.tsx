'use client'

import { useState, useEffect } from 'react'
import AppLayout from '@/components/AppLayout'
import { ToastProvider } from '@/components/Toast'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

interface User {
  id: number; email: string; rol: string; clienteId: number | null; nombre: string; primerNombre: string
}
interface Cliente { id: number; nombre: string }
interface Stats {
  dms_enviados: number; dms_respondidos: number; pct_respuesta: number;
  dolor_excavado: number; calls_propuestas: number; calls_agendadas: number;
  pct_conv_dm_call: number; calls_realizadas: number; pct_show_rate: number;
  ventas_cerradas: number; pct_close_rate: number; cash_cobrado: number;
  reels_publicados: number; media_dms_dia: number;
}
interface TimelineRow {
  fecha: string; dms_enviados: number; calls_agendadas: number;
  cash_cobrado: number; pct_respuesta: number;
}
interface PanelData {
  stats: Stats; timeline: TimelineRow[]; racha: number; diasSinReportar: number;
  xp: number; nivel: { nombre: string; color: string; min: number; max: number };
  logros: { badge: string; earned_at: string }[];
}

const RANGOS = ['7 días', '30 días', 'Todo', 'Personalizado']
const rangoToParam = (r: string) => {
  if (r === '7 días') return { dias: '7' }
  if (r === '30 días') return { dias: '30' }
  return { dias: 'todo' }
}

function StatCard({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div style={{
      backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 12,
      padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#94A3B8', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 700,
        color: highlight ? '#EF4444' : '#0F172A',
      }}>
        {value}
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
      <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 32, width: '40%' }} />
    </div>
  )
}

export default function PanelPage() {
  const [user, setUser] = useState<User | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null)
  const [rango, setRango] = useState('30 días')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [data, setData] = useState<PanelData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(u => {
      setUser(u)
      if (u.clienteId) setSelectedClienteId(u.clienteId)
    })
  }, [])

  useEffect(() => {
    if (user?.rol === 'admin') {
      fetch('/api/clientes').then(r => r.json()).then(d => {
        setClientes(d.clientes || [])
        if (d.clientes?.length > 0) setSelectedClienteId(d.clientes[0].id)
      })
    }
  }, [user])

  useEffect(() => {
    if (!selectedClienteId) return
    setLoading(true)

    const params = new URLSearchParams({ clienteId: selectedClienteId.toString() })
    if (rango === 'Personalizado' && fechaInicio && fechaFin) {
      params.set('fechaInicio', fechaInicio)
      params.set('fechaFin', fechaFin)
    } else {
      const { dias } = rangoToParam(rango)
      params.set('dias', dias)
    }

    fetch(`/api/panel?${params}`).then(r => r.json()).then(d => {
      setData(d)
      setLoading(false)
    })
  }, [selectedClienteId, rango, fechaInicio, fechaFin])

  const getStreakDisplay = () => {
    if (!data) return null
    const { racha, diasSinReportar } = data

    if (diasSinReportar === 0 && racha > 0) {
      return (
        <span style={{ color: '#0891B2', fontWeight: 600, fontSize: 14 }}>
          🔥 Racha de {racha} días
        </span>
      )
    }
    if (diasSinReportar === 1) return <span style={{ color: '#D97706' }}>⚠️ 1 día sin reportar</span>
    if (diasSinReportar === 2) return <span style={{ color: '#EA580C' }}>⚠️⚠️ 2 días sin reportar</span>
    if (diasSinReportar === 3) return <span style={{ color: '#EF4444' }}>❄️ Se enfría — 3 días sin reportar</span>
    if (diasSinReportar === 4) return <span style={{ color: '#EF4444', fontWeight: 700 }}>❄️🥶 FRÍO — 4 días sin reportar</span>
    if (diasSinReportar >= 5) return <span style={{ color: '#7F1D1D', fontWeight: 700 }}>💀 INACTIVO — {diasSinReportar} días sin reportar</span>
    return null
  }

  const getXPProgress = () => {
    if (!data) return { pct: 0, nextLevel: 100, xpInLevel: 0, xpNeeded: 100 }
    const { xp, nivel } = data
    const xpInLevel = xp - nivel.min
    const xpNeeded = nivel.max - nivel.min + 1
    const pct = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100))
    const nextXP = nivel.max + 1
    return { pct, nextLevel: nextXP, xpInLevel, xpNeeded }
  }

  const formatCash = (n: number) => `€${n.toLocaleString('es-ES', { minimumFractionDigits: 0 })}`
  const formatPct = (n: number) => `${Math.min(100, n)}%`

  if (!user) return null

  const { pct, nextLevel } = getXPProgress()

  const cardBgStreak = data?.diasSinReportar === 4 ? '#FEF2F2' : data && data.diasSinReportar >= 5 ? '#FEE2E2' : '#fff'

  return (
    <ToastProvider>
      <AppLayout user={user} title="Panel de Control">
        <div className="p-6">
          {/* Client selector for admin */}
          {user.rol === 'admin' && (
            <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '2px solid #E2E8F0' }}>
              {clientes.map(c => (
                <button key={c.id} onClick={() => setSelectedClienteId(c.id)}
                  style={{
                    padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
                    borderBottom: selectedClienteId === c.id ? '2px solid #0891B2' : '2px solid transparent',
                    marginBottom: -2, color: selectedClienteId === c.id ? '#0891B2' : '#94A3B8',
                    fontWeight: selectedClienteId === c.id ? 600 : 400, fontSize: 14, fontFamily: 'inherit',
                  }}>
                  {c.nombre}
                </button>
              ))}
            </div>
          )}

          {/* Date range tabs */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid #E2E8F0', justifyContent: 'flex-end' }}>
            {RANGOS.map(r => (
              <button key={r} onClick={() => setRango(r)}
                style={{
                  padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: rango === r ? '2px solid #0891B2' : '2px solid transparent',
                  marginBottom: -1, color: rango === r ? '#0891B2' : '#94A3B8',
                  fontWeight: rango === r ? 600 : 400, fontSize: 13, fontFamily: 'inherit',
                }}>
                {r}
              </button>
            ))}
          </div>

          {rango === 'Personalizado' && (
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
              <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)}
                style={{ height: 38, border: '1px solid #E2E8F0', borderRadius: 8, padding: '0 12px', fontFamily: 'inherit' }} />
              <span style={{ color: '#94A3B8' }}>—</span>
              <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)}
                style={{ height: 38, border: '1px solid #E2E8F0', borderRadius: 8, padding: '0 12px', fontFamily: 'inherit' }} />
            </div>
          )}

          {/* XP Progress Card */}
          {loading ? (
            <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20, marginBottom: 24 }}>
              <div className="skeleton" style={{ height: 16, width: '40%', marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 8, width: '100%', borderRadius: 8 }} />
            </div>
          ) : data && (
            <div style={{
              backgroundColor: cardBgStreak, border: '1px solid #E2E8F0', borderRadius: 12,
              padding: 20, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>
                    {data.xp} XP
                  </span>
                  <span style={{ fontSize: 13, color: '#94A3B8', marginLeft: 8 }}>
                    — {nextLevel} XP para Nivel {data.nivel.nombre} →
                  </span>
                  <span style={{
                    display: 'inline-block', marginLeft: 12, padding: '2px 10px',
                    backgroundColor: data.nivel.color + '20', color: data.nivel.color,
                    borderRadius: 20, fontSize: 12, fontWeight: 600,
                  }}>
                    {data.nivel.nombre}
                  </span>
                </div>
                <div style={{ fontSize: 14 }}>{getStreakDisplay()}</div>
              </div>
              <div style={{ height: 8, backgroundColor: '#E0F2FE', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#0891B2', borderRadius: 8, transition: 'width 0.5s ease' }} />
              </div>

              {/* Badges */}
              {data.logros.length > 0 && (
                <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {data.logros.map(l => (
                    <span key={l.badge} title={l.badge} style={{
                      padding: '3px 10px', backgroundColor: '#F0F9FF', color: '#0891B2',
                      borderRadius: 20, fontSize: 12, fontWeight: 500,
                    }}>
                      🏅 {l.badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bottleneck Alerts */}
          {data && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {data.stats.pct_respuesta < 15 && data.stats.dms_enviados > 0 && (
                <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 8, padding: '12px 16px', color: '#92400E', fontSize: 13 }}>
                  ⚠️ Tasa de respuesta baja — solo {data.stats.pct_respuesta}%. Revisa tus mensajes de outbound.
                </div>
              )}
              {data.stats.pct_show_rate < 70 && data.stats.calls_agendadas > 0 && (
                <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 8, padding: '12px 16px', color: '#92400E', fontSize: 13 }}>
                  ⚠️ Show rate bajo — solo {data.stats.pct_show_rate}%. Revisa tu secuencia de post-booking.
                </div>
              )}
              {data.stats.pct_close_rate < 20 && data.stats.calls_realizadas > 0 && (
                <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 8, padding: '12px 16px', color: '#92400E', fontSize: 13 }}>
                  ⚠️ Close rate bajo — solo {data.stats.pct_close_rate}%. Revisa tu script de ventas.
                </div>
              )}
            </div>
          )}

          {/* Stat Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
            {loading ? Array(14).fill(0).map((_, i) => <SkeletonCard key={i} />) : data && (<>
              <StatCard label="DMs Enviados" value={data.stats.dms_enviados} />
              <StatCard label="DMs Respondidos" value={data.stats.dms_respondidos} />
              <StatCard label="% Respuesta" value={formatPct(data.stats.pct_respuesta)} />
              <StatCard label="Dolor Excavado" value={data.stats.dolor_excavado} />
              <StatCard label="Calls Propuestas" value={data.stats.calls_propuestas} />
              <StatCard label="Calls Agendadas" value={data.stats.calls_agendadas} />
              <StatCard label="% Conv. DM→Call" value={formatPct(data.stats.pct_conv_dm_call)} />
              <StatCard label="Calls Realizadas" value={data.stats.calls_realizadas} />
              <StatCard label="% Show Rate" value={formatPct(data.stats.pct_show_rate)} />
              <StatCard label="Ventas Cerradas" value={data.stats.ventas_cerradas} />
              <StatCard label="% Close Rate" value={formatPct(data.stats.pct_close_rate)} />
              <StatCard label="Cash Cobrado" value={formatCash(data.stats.cash_cobrado)} />
              <StatCard label="Reels Publicados" value={data.stats.reels_publicados} />
              <StatCard label="Media DMs/Día" value={data.stats.media_dms_dia} />
            </>)}
          </div>

          {/* Charts 2x2 */}
          {!loading && data && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { title: 'DMs Enviados en el Tiempo', key: 'dms_enviados' as const },
                { title: 'Calls Agendadas en el Tiempo', key: 'calls_agendadas' as const },
                { title: '% Respuesta en el Tiempo', key: 'pct_respuesta' as const },
                { title: 'Cash Cobrado en el Tiempo', key: 'cash_cobrado' as const },
              ].map(({ title, key }) => (
                <div key={key} style={{
                  backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 12,
                  padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', marginBottom: 16 }}>{title}</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data.timeline} style={{ backgroundColor: '#F0F9FF' }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0F9FF" />
                      <XAxis dataKey="fecha" tick={{ fontSize: 10, fill: '#94A3B8' }} tickFormatter={v => v.slice(5)} />
                      <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Line type="monotone" dataKey={key} stroke="#0891B2" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          )}
        </div>
      </AppLayout>
    </ToastProvider>
  )
}
