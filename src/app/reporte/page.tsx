'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import AppLayout from '@/components/AppLayout'
import { useToast, ToastProvider } from '@/components/Toast'

interface User {
  id: number
  email: string
  rol: string
  clienteId: number | null
  nombre: string
  primerNombre: string
}

interface Cliente {
  id: number
  nombre: string
}

interface CelebrationData {
  racha: number
  newBadges: string[]
}

function playSuccessSound() {
  try {
    const ctx = new AudioContext()
    const notes = [523, 659, 784]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.18)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.18)
      osc.start(ctx.currentTime + i * 0.18)
      osc.stop(ctx.currentTime + i * 0.18 + 0.18)
    })
  } catch {
    // Web Audio API not available
  }
}

function ReporteContent() {
  const { addToast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [celebration, setCelebration] = useState<CelebrationData | null>(null)
  const confettiRef = useRef<typeof import('canvas-confetti') | null>(null)

  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    fecha: today,
    dms_enviados: '',
    dms_respondidos: '',
    dolor_excavado: '',
    calls_propuestas: '',
    calls_agendadas: '',
    calls_realizadas: '',
    ventas_cerradas: '',
    cash_cobrado: '',
    reels_publicados: '',
    stories_publicadas: '',
    leads_revividos: '',
    notas_del_dia: '',
  })

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(data => {
      setUser(data)
      if (data.clienteId) setSelectedClienteId(data.clienteId)
    })
  }, [])

  useEffect(() => {
    if (user?.rol === 'admin') {
      fetch('/api/clientes').then(r => r.json()).then(data => {
        setClientes(data.clientes || [])
        if (data.clientes?.length > 0 && !selectedClienteId) {
          setSelectedClienteId(data.clientes[0].id)
        }
      })
    }
  }, [user, selectedClienteId])

  useEffect(() => {
    import('canvas-confetti').then(m => { confettiRef.current = m.default })
  }, [])

  const getSaludo = () => {
    const hora = new Date().getHours()
    const nombre = user?.primerNombre || ''
    if (hora < 12) return `Buenos días, ${nombre} — vamos a por ello.`
    if (hora < 17) return `Buenas tardes, ${nombre} — ¿cómo va el día?`
    return `Hora del reporte, ${nombre}. Vamos a ver esos números.`
  }

  const getEmojiRacha = (dias: number) => {
    if (dias >= 30) return '👑'
    if (dias >= 14) return '🏆'
    if (dias >= 7) return '💎'
    if (dias >= 3) return '⚡'
    return '🔥'
  }

  const fireConfetti = useCallback(() => {
    if (!confettiRef.current) return
    const confetti = confettiRef.current
    confetti({ particleCount: 100, spread: 80, origin: { x: 0.1, y: 0.6 }, colors: ['#0891B2', '#F59E0B', '#ffffff', '#10B981'] })
    confetti({ particleCount: 100, spread: 80, origin: { x: 0.9, y: 0.6 }, colors: ['#0891B2', '#F59E0B', '#ffffff', '#10B981'] })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClienteId) {
      addToast('Selecciona un cliente', 'error')
      return
    }
    setLoading(true)

    try {
      const res = await fetch('/api/reportes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: selectedClienteId,
          ...form,
          dms_enviados: parseInt(form.dms_enviados) || 0,
          dms_respondidos: parseInt(form.dms_respondidos) || 0,
          dolor_excavado: parseInt(form.dolor_excavado) || 0,
          calls_propuestas: parseInt(form.calls_propuestas) || 0,
          calls_agendadas: parseInt(form.calls_agendadas) || 0,
          calls_realizadas: parseInt(form.calls_realizadas) || 0,
          ventas_cerradas: parseInt(form.ventas_cerradas) || 0,
          cash_cobrado: parseFloat(form.cash_cobrado) || 0,
          reels_publicados: parseInt(form.reels_publicados) || 0,
          stories_publicadas: parseInt(form.stories_publicadas) || 0,
          leads_revividos: parseInt(form.leads_revividos) || 0,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        addToast(data.error || 'Error al enviar reporte', 'error')
        return
      }

      fireConfetti()
      playSuccessSound()
      setCelebration({ racha: data.racha, newBadges: data.newBadges || [] })
      setTimeout(() => setCelebration(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', height: 38, border: '1px solid #E2E8F0', borderRadius: 8,
    padding: '0 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none',
    backgroundColor: '#fff',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '0.15em',
    color: '#94A3B8', display: 'block', marginBottom: 6,
  }

  const sectionLabelStyle: React.CSSProperties = {
    fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '0.15em',
    color: '#94A3B8', marginBottom: 16, display: 'block',
  }

  const f = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value })),
    style: inputStyle,
  })

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="skeleton" style={{ width: 200, height: 20 }} />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
          Reporte del Día
        </h1>
        <p style={{ fontSize: 13, color: '#94A3B8' }}>{getSaludo()}</p>
      </div>

      {/* Form Card */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <form onSubmit={handleSubmit}>
          {/* Client selector + Date */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label style={labelStyle}>Cliente</label>
              {user.rol === 'admin' ? (
                <select
                  value={selectedClienteId || ''}
                  onChange={e => setSelectedClienteId(parseInt(e.target.value))}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="">Seleccionar cliente...</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={user.nombre}
                  disabled
                  style={{ ...inputStyle, backgroundColor: '#F8FAFC', color: '#94A3B8', cursor: 'not-allowed' }}
                />
              )}
            </div>
            <div>
              <label style={labelStyle}>Fecha</label>
              <input type="date" {...f('fecha')} />
            </div>
          </div>

          {/* MÉTRICAS DE HOY */}
          <span style={sectionLabelStyle}>Métricas de Hoy</span>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div><label style={labelStyle}>DMs Enviados</label><input type="number" min="0" {...f('dms_enviados')} /></div>
            <div><label style={labelStyle}>DMs Respondidos</label><input type="number" min="0" {...f('dms_respondidos')} /></div>
            <div><label style={labelStyle}>Dolor Excavado</label><input type="number" min="0" {...f('dolor_excavado')} /></div>
            <div><label style={labelStyle}>Calls Propuestas</label><input type="number" min="0" {...f('calls_propuestas')} /></div>
            <div><label style={labelStyle}>Calls Agendadas</label><input type="number" min="0" {...f('calls_agendadas')} /></div>
            <div><label style={labelStyle}>Calls Realizadas</label><input type="number" min="0" {...f('calls_realizadas')} /></div>
            <div><label style={labelStyle}>Ventas Cerradas</label><input type="number" min="0" {...f('ventas_cerradas')} /></div>
            <div><label style={labelStyle}>Leads Revividos</label><input type="number" min="0" {...f('leads_revividos')} /></div>
            <div />
          </div>

          {/* Cash */}
          <div className="mb-6">
            <label style={labelStyle}>Cash Cobrado (€)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: 14 }}>€</span>
              <input type="number" min="0" step="0.01"
                value={form.cash_cobrado}
                onChange={e => setForm(f => ({ ...f, cash_cobrado: e.target.value }))}
                style={{ ...inputStyle, paddingLeft: 28 }}
              />
            </div>
          </div>

          {/* CONTENIDO DE HOY */}
          <span style={sectionLabelStyle}>Contenido de Hoy</span>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div><label style={labelStyle}>Reels Publicados</label><input type="number" min="0" {...f('reels_publicados')} /></div>
            <div><label style={labelStyle}>Stories Publicadas</label><input type="number" min="0" {...f('stories_publicadas')} /></div>
            <div />
          </div>

          {/* NOTAS */}
          <span style={sectionLabelStyle}>Notas</span>
          <div className="mb-6">
            <label style={labelStyle}>Notas del Día</label>
            <textarea
              rows={3}
              value={form.notas_del_dia}
              onChange={e => setForm(prev => ({ ...prev, notas_del_dia: e.target.value }))}
              placeholder="¿Qué has aprendido hoy? ¿Qué bloqueo tienes?"
              style={{
                width: '100%', border: '1px solid #E2E8F0', borderRadius: 8, padding: 12,
                fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'vertical',
              }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', height: 48, backgroundColor: loading ? '#7EC8DC' : '#0891B2',
              color: '#fff', border: 'none', borderRadius: 8, fontSize: 12,
              fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              transition: 'background-color 0.2s',
            }}
          >
            {loading ? 'Enviando...' : 'Enviar Reporte'}
          </button>
        </form>
      </div>

      {/* Celebration Modal */}
      {celebration && (
        <div
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
        >
          <div
            className="celebration-enter"
            style={{
              backgroundColor: '#fff', borderRadius: 24, padding: 40, textAlign: 'center',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)', maxWidth: 360, width: '90%',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>
              {getEmojiRacha(celebration.racha)}
            </div>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 26, fontWeight: 700, color: '#0891B2', marginBottom: 8 }}>
              ¡Reporte Enviado!
            </div>
            <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 8 }}>
              +10 XP ganados
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>
              🔥 Racha de {celebration.racha} días
            </div>
            {celebration.newBadges.map(badge => (
              <div key={badge} style={{ fontSize: 13, color: '#F59E0B', marginTop: 8 }}>
                🏅 ¡Nuevo Badge: {badge}!
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ReportePage() {
  return (
    <ToastProvider>
      <ReporteWithLayout />
    </ToastProvider>
  )
}

function ReporteWithLayout() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(setUser)
  }, [])

  if (!user) return null

  return (
    <AppLayout user={user} title="Reporte Diario" showReporteButton={false}>
      <ReporteContent />
    </AppLayout>
  )
}
