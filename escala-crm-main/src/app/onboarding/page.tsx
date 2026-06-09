'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, ChevronRight, Instagram, Zap, Target, Settings, PartyPopper } from 'lucide-react'

interface OnboardingData {
  paso_actual: number
  completado: boolean
  nombre_completo?: string
  instagram_handle?: string
  nicho?: string
  facturacion_actual?: string
  meses_activo?: string
  mayor_problema?: string
  intentos_previos?: string
  objetivo_90_dias?: string
  horas_disponibles?: string
  motivacion?: string
  compromiso_confirmado?: boolean
  tiene_instagram?: boolean
  tiene_manychat?: boolean
  tiene_ghl?: boolean
  link_notion?: string
}

const PASOS = [
  { num: 1, label: 'Tu perfil', icon: Instagram },
  { num: 2, label: 'Situación actual', icon: Target },
  { num: 3, label: 'Tu objetivo', icon: Zap },
  { num: 4, label: 'Setup técnico', icon: Settings },
  { num: 5, label: 'Listo', icon: PartyPopper },
]

const INPUT_STYLE = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid #E2E8F0',
  borderRadius: 10,
  fontSize: 14,
  fontFamily: 'inherit',
  color: '#0F172A',
  outline: 'none',
  transition: 'border-color 0.15s',
  boxSizing: 'border-box' as const,
}

const LABEL_STYLE = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#374151',
  marginBottom: 6,
}

const HINT_STYLE = {
  fontSize: 11,
  color: '#94A3B8',
  marginTop: 4,
}

function ProgressBar({ paso, total }: { paso: number; total: number }) {
  const pct = Math.round(((paso - 1) / (total - 1)) * 100)
  return (
    <div style={{ height: 4, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden', marginBottom: 32 }}>
      <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#0891B2', borderRadius: 4, transition: 'width 0.4s ease' }} />
    </div>
  )
}

function StepIndicator({ pasoActual }: { pasoActual: number }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 32, justifyContent: 'center' }}>
      {PASOS.map((p) => {
        const done = pasoActual > p.num
        const active = pasoActual === p.num
        return (
          <div key={p.num} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: done ? '#0891B2' : active ? '#0F172A' : '#F1F5F9',
              color: done || active ? '#fff' : '#94A3B8',
              fontSize: 12, fontWeight: 600, flexShrink: 0, transition: 'all 0.3s',
            }}>
              {done ? <CheckCircle size={16} /> : p.num}
            </div>
            <span style={{ fontSize: 12, color: active ? '#0F172A' : '#94A3B8', fontWeight: active ? 600 : 400, display: 'none' }}>
              {p.label}
            </span>
            {p.num < PASOS.length && (
              <div style={{ width: 24, height: 1, backgroundColor: done ? '#0891B2' : '#E2E8F0', transition: 'background-color 0.3s' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<OnboardingData>({ paso_actual: 1, completado: false })
  const [form, setForm] = useState<Record<string, string | boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/onboarding')
      .then(r => r.json())
      .then(d => {
        if (d.onboarding) {
          setData(d.onboarding)
          if (d.onboarding.completado) {
            router.push('/programa')
          }
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  const set = (key: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => { const e = { ...prev }; delete e[key]; return e })
  }

  const val = (key: string, fallback: string | boolean = '') => {
    if (form[key] !== undefined) return form[key]
    return (data as Record<string, unknown>)[key] ?? fallback
  }

  const validate = (paso: number): boolean => {
    const e: Record<string, string> = {}
    if (paso === 1) {
      if (!val('nombre_completo')) e.nombre_completo = 'Campo requerido'
      if (!val('instagram_handle')) e.instagram_handle = 'Campo requerido'
      if (!val('nicho')) e.nicho = 'Campo requerido'
    }
    if (paso === 2) {
      if (!val('facturacion_actual')) e.facturacion_actual = 'Campo requerido'
      if (!val('mayor_problema')) e.mayor_problema = 'Campo requerido'
    }
    if (paso === 3) {
      if (!val('objetivo_90_dias')) e.objetivo_90_dias = 'Campo requerido'
      if (!val('horas_disponibles')) e.horas_disponibles = 'Campo requerido'
      if (!val('compromiso_confirmado')) e.compromiso_confirmado = 'Debes confirmar tu compromiso'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const siguiente = async () => {
    if (!validate(data.paso_actual)) return
    setSaving(true)
    const nextPaso = data.paso_actual + 1

    await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paso: nextPaso, datos: { ...form } }),
    })

    setData(prev => ({ ...prev, ...form, paso_actual: nextPaso }))
    setForm({})
    setSaving(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const finalizar = async () => {
    setSaving(true)
    await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paso: 5, datos: {} }),
    })
    setSaving(false)
    router.push('/programa')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
        <div style={{ color: '#94A3B8', fontSize: 14 }}>Cargando...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 16px' }}>
      {/* Header */}
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.3em', color: '#94A3B8', fontWeight: 300, marginBottom: 8 }}>MAESTRÍA DE ESCALA</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>Bienvenido al programa</div>
        <div style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>Tardas menos de 5 minutos. Solo una vez.</div>
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 560, backgroundColor: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', padding: '40px 40px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <StepIndicator pasoActual={data.paso_actual} />
        <ProgressBar paso={data.paso_actual} total={PASOS.length} />

        {/* PASO 1 */}
        {data.paso_actual === 1 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', fontFamily: 'Sora, sans-serif', marginBottom: 4 }}>Tu perfil</div>
              <div style={{ fontSize: 13, color: '#64748B' }}>Para personalizar el programa a tu situación.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={LABEL_STYLE}>Nombre completo</label>
                <input style={{ ...INPUT_STYLE, borderColor: errors.nombre_completo ? '#EF4444' : '#E2E8F0' }}
                  value={val('nombre_completo') as string}
                  onChange={e => set('nombre_completo', e.target.value)}
                  placeholder="Juan García" />
                {errors.nombre_completo && <div style={{ ...HINT_STYLE, color: '#EF4444' }}>{errors.nombre_completo}</div>}
              </div>
              <div>
                <label style={LABEL_STYLE}>Tu Instagram (@handle)</label>
                <input style={{ ...INPUT_STYLE, borderColor: errors.instagram_handle ? '#EF4444' : '#E2E8F0' }}
                  value={val('instagram_handle') as string}
                  onChange={e => set('instagram_handle', e.target.value.replace('@', ''))}
                  placeholder="tuhandle" />
                <div style={HINT_STYLE}>Sin la @. Ej: juangarcia.coach</div>
                {errors.instagram_handle && <div style={{ ...HINT_STYLE, color: '#EF4444' }}>{errors.instagram_handle}</div>}
              </div>
              <div>
                <label style={LABEL_STYLE}>Tu nicho o especialidad</label>
                <input style={{ ...INPUT_STYLE, borderColor: errors.nicho ? '#EF4444' : '#E2E8F0' }}
                  value={val('nicho') as string}
                  onChange={e => set('nicho', e.target.value)}
                  placeholder="Coach de mindfulness para emprendedores" />
                {errors.nicho && <div style={{ ...HINT_STYLE, color: '#EF4444' }}>{errors.nicho}</div>}
              </div>
            </div>
          </div>
        )}

        {/* PASO 2 */}
        {data.paso_actual === 2 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', fontFamily: 'Sora, sans-serif', marginBottom: 4 }}>Tu situación actual</div>
              <div style={{ fontSize: 13, color: '#64748B' }}>Honestidad total aquí. Esto nos ayuda a priorizar.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={LABEL_STYLE}>Facturación actual (mensual aprox.)</label>
                <select style={{ ...INPUT_STYLE, cursor: 'pointer', borderColor: errors.facturacion_actual ? '#EF4444' : '#E2E8F0' }}
                  value={val('facturacion_actual') as string}
                  onChange={e => set('facturacion_actual', e.target.value)}>
                  <option value="">Selecciona...</option>
                  <option>Menos de 1.000€/mes</option>
                  <option>1.000 - 2.000€/mes</option>
                  <option>2.000 - 3.500€/mes</option>
                  <option>3.500 - 5.000€/mes</option>
                  <option>Más de 5.000€/mes</option>
                </select>
                {errors.facturacion_actual && <div style={{ ...HINT_STYLE, color: '#EF4444' }}>{errors.facturacion_actual}</div>}
              </div>
              <div>
                <label style={LABEL_STYLE}>¿Cuánto llevas en el mercado?</label>
                <select style={{ ...INPUT_STYLE, cursor: 'pointer' }}
                  value={val('meses_activo') as string}
                  onChange={e => set('meses_activo', e.target.value)}>
                  <option value="">Selecciona...</option>
                  <option>Menos de 6 meses</option>
                  <option>6 - 12 meses</option>
                  <option>1 - 2 años</option>
                  <option>Más de 2 años</option>
                </select>
              </div>
              <div>
                <label style={LABEL_STYLE}>¿Cuál es tu mayor problema ahora mismo?</label>
                <textarea
                  style={{ ...INPUT_STYLE, minHeight: 100, resize: 'vertical', borderColor: errors.mayor_problema ? '#EF4444' : '#E2E8F0' }}
                  value={val('mayor_problema') as string}
                  onChange={e => set('mayor_problema', e.target.value)}
                  placeholder="Creo contenido pero no me llegan clientes, no sé cómo convertir seguidores en ventas..." />
                {errors.mayor_problema && <div style={{ ...HINT_STYLE, color: '#EF4444' }}>{errors.mayor_problema}</div>}
              </div>
              <div>
                <label style={LABEL_STYLE}>¿Qué has intentado antes sin resultado?</label>
                <textarea
                  style={{ ...INPUT_STYLE, minHeight: 80, resize: 'vertical' }}
                  value={val('intentos_previos') as string}
                  onChange={e => set('intentos_previos', e.target.value)}
                  placeholder="He comprado cursos, he probado anuncios, he cambiado de nicho..." />
                <div style={HINT_STYLE}>Opcional, pero muy útil.</div>
              </div>
            </div>
          </div>
        )}

        {/* PASO 3 */}
        {data.paso_actual === 3 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', fontFamily: 'Sora, sans-serif', marginBottom: 4 }}>Tu objetivo y compromiso</div>
              <div style={{ fontSize: 13, color: '#64748B' }}>Sin objetivo claro no hay sistema que funcione.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={LABEL_STYLE}>¿Cuál es tu objetivo en los próximos 180 días?</label>
                <textarea
                  style={{ ...INPUT_STYLE, minHeight: 90, resize: 'vertical', borderColor: errors.objetivo_90_dias ? '#EF4444' : '#E2E8F0' }}
                  value={val('objetivo_90_dias') as string}
                  onChange={e => set('objetivo_90_dias', e.target.value)}
                  placeholder="Llegar a 5 clientes activos en mi mentoria a 1.500€/mes cada uno..." />
                <div style={HINT_STYLE}>Sé específico: número de clientes, precio, ingresos mensuales.</div>
                {errors.objetivo_90_dias && <div style={{ ...HINT_STYLE, color: '#EF4444' }}>{errors.objetivo_90_dias}</div>}
              </div>
              <div>
                <label style={LABEL_STYLE}>¿Cuántas horas semanales puedes dedicar al programa?</label>
                <select style={{ ...INPUT_STYLE, cursor: 'pointer', borderColor: errors.horas_disponibles ? '#EF4444' : '#E2E8F0' }}
                  value={val('horas_disponibles') as string}
                  onChange={e => set('horas_disponibles', e.target.value)}>
                  <option value="">Selecciona...</option>
                  <option>Menos de 5h/semana</option>
                  <option>5 - 10h/semana</option>
                  <option>10 - 20h/semana</option>
                  <option>Más de 20h/semana</option>
                </select>
                {errors.horas_disponibles && <div style={{ ...HINT_STYLE, color: '#EF4444' }}>{errors.horas_disponibles}</div>}
              </div>
              <div>
                <label style={LABEL_STYLE}>¿Por qué ahora? ¿Qué te ha llevado a entrar en el programa?</label>
                <textarea
                  style={{ ...INPUT_STYLE, minHeight: 80, resize: 'vertical' }}
                  value={val('motivacion') as string}
                  onChange={e => set('motivacion', e.target.value)}
                  placeholder="Estoy harto de trabajar mucho sin resultados, quiero un sistema que funcione..." />
              </div>

              {/* Compromiso */}
              <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0C4A6E', marginBottom: 12 }}>Compromiso del programa</div>
                <div style={{ fontSize: 12, color: '#075985', lineHeight: 1.7, marginBottom: 16 }}>
                  Para activar la garantía y sacar el máximo resultado me comprometo a:<br />
                  ✓ Ver todos los módulos del programa<br />
                  ✓ Publicar mínimo 3 Reels por semana<br />
                  ✓ Entregar todos los entregables en cada fase<br />
                  ✓ Reportar mis métricas diarias en el panel
                </div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={val('compromiso_confirmado', false) as boolean}
                    onChange={e => set('compromiso_confirmado', e.target.checked)}
                    style={{ marginTop: 2, width: 16, height: 16, cursor: 'pointer', accentColor: '#0891B2' }}
                  />
                  <span style={{ fontSize: 13, color: '#0F172A', fontWeight: 500 }}>
                    Confirmo que entiendo y acepto estos compromisos
                  </span>
                </label>
                {errors.compromiso_confirmado && <div style={{ ...HINT_STYLE, color: '#EF4444', marginTop: 8 }}>{errors.compromiso_confirmado}</div>}
              </div>
            </div>
          </div>
        )}

        {/* PASO 4 */}
        {data.paso_actual === 4 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', fontFamily: 'Sora, sans-serif', marginBottom: 4 }}>Setup técnico</div>
              <div style={{ fontSize: 13, color: '#64748B' }}>¿Qué tienes ya listo? No pasa nada si falta algo, lo configuramos juntos.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { key: 'tiene_instagram', label: 'Cuenta de Instagram activa (mínimo 100 seguidores)', hint: 'La plataforma principal del sistema' },
                { key: 'tiene_manychat', label: 'ManyChat conectado a tu Instagram', hint: 'Para automatizar respuestas con keywords' },
                { key: 'tiene_ghl', label: 'GoHighLevel (GHL) configurado', hint: 'CRM para gestionar tus leads y automatizaciones' },
              ].map(({ key, label, hint }) => (
                <label key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px', backgroundColor: val(key, false) ? '#F0FDF4' : '#F8FAFC', borderRadius: 10, border: `1px solid ${val(key, false) ? '#86EFAC' : '#E2E8F0'}`, cursor: 'pointer', transition: 'all 0.2s' }}>
                  <input type="checkbox" checked={val(key, false) as boolean} onChange={e => set(key, e.target.checked)}
                    style={{ marginTop: 2, width: 16, height: 16, cursor: 'pointer', accentColor: '#0891B2' }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{label}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{hint}</div>
                  </div>
                </label>
              ))}
              <div style={{ marginTop: 4 }}>
                <label style={LABEL_STYLE}>Link a tu Notion del programa <span style={{ fontWeight: 400, color: '#94A3B8' }}>(opcional)</span></label>
                <input style={INPUT_STYLE}
                  value={val('link_notion') as string}
                  onChange={e => set('link_notion', e.target.value)}
                  placeholder="https://notion.so/..." />
                <div style={HINT_STYLE}>Si ya tienes acceso a tu workspace de Notion, pégalo aquí.</div>
              </div>
            </div>
          </div>
        )}

        {/* PASO 5 - Completado */}
        {data.paso_actual === 5 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', fontFamily: 'Sora, sans-serif', marginBottom: 8 }}>
              ¡Todo listo, {(data.nombre_completo || 'campeón').split(' ')[0]}!
            </div>
            <div style={{ fontSize: 14, color: '#64748B', marginBottom: 32, lineHeight: 1.7 }}>
              Tu onboarding está completado.<br />
              Ya tienes acceso a tu portal del programa y al panel de métricas.
            </div>

            <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 12, padding: 20, marginBottom: 28, textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0C4A6E', marginBottom: 12 }}>Tus próximos pasos</div>
              {[
                'Entra a tu portal y revisa el plan de 180 días',
                'Empieza el Módulo 1 del curso hoy',
                'Haz tu primer reporte diario mañana',
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#0891B2', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ fontSize: 13, color: '#0F172A' }}>{step}</span>
                </div>
              ))}
            </div>

            <button
              onClick={finalizar}
              disabled={saving}
              style={{
                width: '100%', padding: '14px 0', backgroundColor: '#0F172A', color: '#fff',
                border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
                fontFamily: 'inherit', letterSpacing: '0.03em',
              }}>
              {saving ? 'Entrando...' : 'Ir a mi portal →'}
            </button>
          </div>
        )}

        {/* Navigation */}
        {data.paso_actual < 5 && (
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={siguiente}
              disabled={saving}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 28px', backgroundColor: '#0F172A', color: '#fff',
                border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
                fontFamily: 'inherit',
              }}>
              {saving ? 'Guardando...' : 'Siguiente'}
              {!saving && <ChevronRight size={16} />}
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 24, fontSize: 11, color: '#CBD5E1' }}>
        Paso {data.paso_actual} de {PASOS.length} · Maestría de Escala
      </div>
    </div>
  )
}
