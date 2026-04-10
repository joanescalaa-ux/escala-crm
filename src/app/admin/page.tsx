'use client'

import { useState, useEffect } from 'react'
import AppLayout from '@/components/AppLayout'
import { ToastProvider } from '@/components/Toast'
import Link from 'next/link'

interface User { id: number; email: string; rol: string; clienteId: number | null; nombre: string; primerNombre: string }
interface ClienteOverview {
  id: number; nombre: string; email: string; tier: string; estado: string;
  racha: number; diasSinReportar: number;
  dms_enviados: number; calls_propuestas: number; calls_agendadas: number; calls_realizadas: number;
  ventas_cerradas: number; cash_cobrado: number; pct_respuesta: number; pct_show_rate: number;
  cash_semana: number; xp: number; nivel: { nombre: string; color: string };
}

const RANGOS = ['7 días', '30 días', 'Todo', 'Personalizado']

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [clientes, setClientes] = useState<ClienteOverview[]>([])
  const [mejorCliente, setMejorCliente] = useState<ClienteOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [rango, setRango] = useState('30 días')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')

  useEffect(() => { fetch('/api/auth/me').then(r => r.json()).then(setUser) }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (rango === 'Personalizado' && fechaInicio && fechaFin) {
      params.set('fechaInicio', fechaInicio)
      params.set('fechaFin', fechaFin)
    } else if (rango === '7 días') params.set('dias', '7')
    else if (rango === '30 días') params.set('dias', '30')
    else params.set('dias', 'todo')

    fetch(`/api/admin?${params}`).then(r => r.json()).then(d => {
      setClientes(d.clientes || [])
      setMejorCliente(d.mejorCliente || null)
      setLoading(false)
    })
  }, [rango, fechaInicio, fechaFin])

  const getStreakLabel = (c: ClienteOverview) => {
    if (c.diasSinReportar === 0 && c.racha > 0) return { text: `🔥 Racha de ${c.racha} días`, color: '#0891B2' }
    if (c.diasSinReportar >= 3) return { text: `💀 INACTIVO`, color: '#EF4444' }
    if (c.diasSinReportar >= 1) return { text: `⚠️ ${c.diasSinReportar}d sin reportar`, color: '#D97706' }
    return { text: '—', color: '#94A3B8' }
  }

  if (!user) return null

  return (
    <ToastProvider>
      <AppLayout user={user} title="Vista General">
        <div className="p-6">
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Vista General</h1>
            <p style={{ fontSize: 13, color: '#94A3B8' }}>Detecta cuellos de botella. Asesora con precisión.</p>
          </div>

          {/* Date range tabs */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid #E2E8F0', justifyContent: 'flex-end' }}>
            {RANGOS.map(r => (
              <button key={r} onClick={() => setRango(r)}
                style={{ padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', borderBottom: rango === r ? '2px solid #0891B2' : '2px solid transparent', marginBottom: -1, color: rango === r ? '#0891B2' : '#94A3B8', fontWeight: rango === r ? 600 : 400, fontSize: 13, fontFamily: 'inherit' }}>
                {r}
              </button>
            ))}
          </div>

          {rango === 'Personalizado' && (
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
              <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} style={{ height: 38, border: '1px solid #E2E8F0', borderRadius: 8, padding: '0 12px', fontFamily: 'inherit' }} />
              <span style={{ color: '#94A3B8' }}>—</span>
              <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} style={{ height: 38, border: '1px solid #E2E8F0', borderRadius: 8, padding: '0 12px', fontFamily: 'inherit' }} />
            </div>
          )}

          {/* Best client card */}
          {mejorCliente && mejorCliente.cash_semana > 0 && (
            <div style={{
              backgroundColor: '#fff', border: '2px solid #EAB308', borderRadius: 12, padding: 20,
              marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <span style={{ fontSize: 32 }}>🏆</span>
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94A3B8', marginBottom: 4 }}>Mejor Cliente Esta Semana</div>
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 700, color: '#0F172A' }}>
                  {mejorCliente.nombre}
                </div>
                <div style={{ fontSize: 14, color: '#EAB308', fontWeight: 600 }}>
                  €{mejorCliente.cash_semana.toLocaleString('es-ES')} esta semana
                </div>
              </div>
            </div>
          )}

          {/* Client cards grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {Array(4).fill(0).map((_, i) => (
                <div key={i} style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
                  <div className="skeleton" style={{ height: 48 }} />
                  <div style={{ padding: 16 }}>
                    <div className="skeleton" style={{ height: 60, marginBottom: 8 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : clientes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 64, color: '#94A3B8' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>No hay clientes todavía</div>
              <div style={{ fontSize: 13 }}>
                <Link href="/admin/clientes" style={{ color: '#0891B2' }}>Añade tu primer cliente</Link> para ver la vista general.
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {clientes.map(c => {
                const streak = getStreakLabel(c)
                const hasProblem = c.diasSinReportar >= 3
                const cardBorder = hasProblem ? '1px solid #E2E8F0' : '1px solid #E2E8F0'
                const leftBorder = c.diasSinReportar >= 3 ? '3px solid #EF4444' : '1px solid #E2E8F0'

                const problems = []
                if (c.pct_respuesta < 15 && c.dms_enviados > 0) problems.push('↓ Baja Tasa Respuesta')
                if (c.pct_show_rate < 70 && c.calls_agendadas > 0) problems.push('↓ Bajo Show Rate')
                if (c.dms_enviados < 10) problems.push('⚠️ Pocos DMs')

                return (
                  <div key={c.id}
                    style={{
                      backgroundColor: '#fff', border: cardBorder, borderLeft: leftBorder,
                      borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                  >
                    {/* Card Header */}
                    <div style={{ backgroundColor: '#0F172A', padding: '0 16px', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 600, color: '#fff' }}>{c.nombre}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: streak.color }}>{streak.text}</span>
                    </div>

                    {/* Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '12px 16px', gap: 12 }}>
                      {[
                        { label: 'DMs', value: c.dms_enviados },
                        { label: 'Calls Prop.', value: c.calls_propuestas },
                        { label: 'Calls Ag.', value: c.calls_agendadas },
                        { label: 'Realizadas', value: c.calls_realizadas },
                        { label: 'Ventas', value: c.ventas_cerradas },
                        { label: 'Cash', value: `€${Math.round(c.cash_cobrado).toLocaleString()}` },
                        { label: '% Resp.', value: `${c.pct_respuesta}%` },
                        { label: '% Show', value: `${c.pct_show_rate}%` },
                      ].map(m => (
                        <div key={m.label} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#94A3B8', marginBottom: 2 }}>{m.label}</div>
                          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 700, color: '#0F172A' }}>{m.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom badges */}
                    <div style={{ padding: '8px 16px 12px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {problems.length === 0 ? (
                        <span style={{ fontSize: 12, color: '#16A34A', fontWeight: 500 }}>✓ En Buen Camino</span>
                      ) : problems.map(p => (
                        <span key={p} style={{ fontSize: 11, backgroundColor: '#FEF2F2', color: '#EF4444', padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>{p}</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </AppLayout>
    </ToastProvider>
  )
}
