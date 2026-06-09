'use client'

import { useState, useEffect } from 'react'
import AppLayout from '@/components/AppLayout'
import { ToastProvider } from '@/components/Toast'

interface User { id: number; email: string; rol: string; clienteId: number | null; nombre: string; primerNombre: string }
interface RankingEntry {
  clienteId: number; nombre: string; totalCash: number; totalCalls: number;
  racha: number; xp: number; nivel: { nombre: string; color: string };
}

const METRICAS = [
  { key: 'cash', label: 'Cash Cobrado' },
  { key: 'calls', label: 'Calls Agendadas' },
  { key: 'racha', label: 'Racha' },
  { key: 'xp', label: 'XP' },
]

export default function RankingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [metrica, setMetrica] = useState('cash')
  const [ranking, setRanking] = useState<RankingEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetch('/api/auth/me').then(r => r.json()).then(setUser) }, [])

  useEffect(() => {
    setLoading(true)
    fetch(`/api/ranking?metrica=${metrica}`).then(r => r.json()).then(d => {
      setRanking(d.ranking || [])
      setLoading(false)
    })
  }, [metrica])

  const getMetricaValue = (entry: RankingEntry) => {
    if (metrica === 'cash') return `€${entry.totalCash.toLocaleString('es-ES')}`
    if (metrica === 'calls') return entry.totalCalls.toString()
    if (metrica === 'racha') return `${entry.racha} días`
    return `${entry.xp} XP`
  }

  if (!user) return null

  return (
    <ToastProvider>
      <AppLayout user={user} title="Ranking">
        <div className="p-6 max-w-3xl mx-auto">
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 48, fontWeight: 300, color: '#0F172A', marginBottom: 8 }}>
              Ranking
            </h1>
            <p style={{ fontSize: 16, color: '#94A3B8' }}>Mira quién lidera.</p>
          </div>

          {/* Tab switcher */}
          <div style={{ display: 'flex', borderBottom: '2px solid #E2E8F0', marginBottom: 32, height: 48 }}>
            {METRICAS.map(m => (
              <button key={m.key} onClick={() => setMetrica(m.key)}
                style={{
                  flex: 1, background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: metrica === m.key ? '2px solid #0891B2' : '2px solid transparent',
                  marginBottom: -2, color: metrica === m.key ? '#0891B2' : '#94A3B8',
                  fontWeight: metrica === m.key ? 600 : 400, fontSize: 14, fontFamily: 'inherit',
                }}>
                {m.label}
              </button>
            ))}
          </div>

          {/* Ranking list */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {Array(5).fill(0).map((_, i) => (
                <div key={i} style={{ height: 72, borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 24, padding: '0 16px' }}>
                  <div className="skeleton" style={{ width: 40, height: 40 }} />
                  <div className="skeleton" style={{ width: 160, height: 18 }} />
                  <div className="skeleton" style={{ marginLeft: 'auto', width: 100, height: 24 }} />
                </div>
              ))}
            </div>
          ) : ranking.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 64, color: '#94A3B8' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🏆</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>No hay datos todavía</div>
              <div style={{ fontSize: 13 }}>El ranking aparecerá cuando haya clientes activos con reportes.</div>
            </div>
          ) : (
            <div>
              {ranking.map((entry, i) => (
                <div key={entry.clienteId}
                  style={{
                    height: 72, borderBottom: '1px solid #E2E8F0', display: 'flex',
                    alignItems: 'center', position: 'relative', overflow: 'hidden',
                  }}
                >
                  {/* Decorative number */}
                  <div style={{
                    fontFamily: 'Sora, sans-serif', fontSize: 64, fontWeight: 800,
                    color: '#F0F9FF', position: 'absolute', left: 0, top: '50%',
                    transform: 'translateY(-50%)', lineHeight: 1, userSelect: 'none',
                  }}>
                    {i + 1}
                  </div>

                  {/* Content */}
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1, paddingLeft: 56 }}>
                    {/* Medal for top 3 */}
                    {i === 0 && <span style={{ marginRight: 8, fontSize: 20 }}>🥇</span>}
                    {i === 1 && <span style={{ marginRight: 8, fontSize: 20 }}>🥈</span>}
                    {i === 2 && <span style={{ marginRight: 8, fontSize: 20 }}>🥉</span>}

                    <div>
                      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                        {entry.nombre}
                        <span style={{
                          display: 'inline-block', padding: '2px 8px', borderRadius: 20,
                          backgroundColor: entry.nivel.color + '20', color: entry.nivel.color,
                          fontSize: 11, fontWeight: 600,
                        }}>
                          {entry.nivel.nombre}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metric value */}
                  <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 700, color: '#0891B2' }}>
                    {getMetricaValue(entry)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AppLayout>
    </ToastProvider>
  )
}
