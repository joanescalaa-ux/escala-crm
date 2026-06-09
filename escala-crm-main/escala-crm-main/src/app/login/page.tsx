'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react'

type Mode = 'login' | 'activate'

const AMARILLO = '#F8F284'
const NEGRO = '#0A0A0A'
const GRIS = '#6B7280'
const BORDE = '#E5E7EB'

const inputStyle = {
  width: '100%',
  height: 46,
  border: `1px solid ${BORDE}`,
  borderRadius: 10,
  padding: '0 14px',
  fontSize: 14,
  fontFamily: 'inherit',
  color: NEGRO,
  outline: 'none',
  backgroundColor: '#FAFAFA',
  boxSizing: 'border-box' as const,
  transition: 'border-color 0.15s',
}

const labelStyle = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: GRIS,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  marginBottom: 6,
}

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showPass2, setShowPass2] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [activateForm, setActivateForm] = useState({ codigo: '', password: '', confirmPassword: '' })

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al iniciar sesión'); return }
      router.push('/programa')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = async () => {
    setError('')
    if (!activateForm.codigo.trim()) { setError('Introduce tu código de invitación'); return }
    if (activateForm.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return }
    if (activateForm.password !== activateForm.confirmPassword) { setError('Las contraseñas no coinciden'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activateForm),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al activar cuenta'); return }
      router.push('/onboarding')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: NEGRO,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            backgroundColor: AMARILLO,
            borderRadius: 12,
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: NEGRO, fontFamily: 'Sora, sans-serif' }}>E</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: 'Sora, sans-serif', letterSpacing: '-0.3px' }}>
            ESCALA
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 3, letterSpacing: '0.15em' }}>
            MAESTRÍA DE ESCALA
          </div>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: 18,
          padding: '32px 32px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        }}>

          {/* Tab toggle */}
          <div style={{
            display: 'flex',
            backgroundColor: '#F3F4F6',
            borderRadius: 10,
            padding: 3,
            marginBottom: 28,
          }}>
            {([
              { key: 'login', label: 'Iniciar sesión' },
              { key: 'activate', label: 'Activar cuenta' },
            ] as { key: Mode; label: string }[]).map(({ key, label }) => (
              <button key={key} onClick={() => { setMode(key); setError('') }}
                style={{
                  flex: 1,
                  height: 36,
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  backgroundColor: mode === key ? '#fff' : 'transparent',
                  color: mode === key ? NEGRO : GRIS,
                  boxShadow: mode === key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  autoComplete="email"
                  value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  style={inputStyle}
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label style={labelStyle}>Contraseña</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={loginForm.password}
                    onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    style={{ ...inputStyle, paddingRight: 44 }}
                    placeholder="••••••••"
                  />
                  <button onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: GRIS, padding: 0 }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#DC2626' }}>
                  {error}
                </div>
              )}

              <button onClick={handleLogin} disabled={loading}
                style={{
                  width: '100%', height: 46, backgroundColor: loading ? '#555' : NEGRO,
                  color: AMARILLO, border: 'none', borderRadius: 10, fontSize: 14,
                  fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8, marginTop: 4,
                  transition: 'background-color 0.2s',
                }}>
                {loading ? 'Entrando...' : <>Entrar <ArrowRight size={16} /></>}
              </button>

              <div style={{ textAlign: 'center', marginTop: 4 }}>
                <span style={{ fontSize: 12, color: GRIS }}>¿Primera vez? </span>
                <button onClick={() => { setMode('activate'); setError('') }}
                  style={{ fontSize: 12, color: NEGRO, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>
                  Activa tu cuenta con tu código
                </button>
              </div>
            </div>
          )}

          {/* ACTIVATE FORM */}
          {mode === 'activate' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ backgroundColor: '#FAFAFA', border: '1px solid #E5E7EB', borderRadius: 10, padding: '12px 14px', fontSize: 12, color: GRIS, lineHeight: 1.6 }}>
                Joan te habrá enviado un código de invitación con el formato <strong style={{ color: NEGRO, fontFamily: 'monospace' }}>ESCALA-XXXXXXXX</strong>. Introdúcelo aquí y crea tu contraseña.
              </div>

              <div>
                <label style={labelStyle}>Código de invitación</label>
                <input
                  type="text"
                  value={activateForm.codigo}
                  onChange={e => setActivateForm(f => ({ ...f, codigo: e.target.value.toUpperCase() }))}
                  style={{ ...inputStyle, fontFamily: 'monospace', letterSpacing: '0.1em', fontSize: 15 }}
                  placeholder="ESCALA-XXXXXXXX"
                />
              </div>

              <div>
                <label style={labelStyle}>Crear contraseña</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={activateForm.password}
                    onChange={e => setActivateForm(f => ({ ...f, password: e.target.value }))}
                    style={{ ...inputStyle, paddingRight: 44 }}
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: GRIS, padding: 0 }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Password strength dots */}
                <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                  {[4, 6, 8, 10].map(min => (
                    <div key={min} style={{
                      flex: 1, height: 3, borderRadius: 2,
                      backgroundColor: activateForm.password.length >= min ? AMARILLO : '#E5E7EB',
                      transition: 'background-color 0.2s',
                    }} />
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Confirmar contraseña</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass2 ? 'text' : 'password'}
                    value={activateForm.confirmPassword}
                    onChange={e => setActivateForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    style={{
                      ...inputStyle, paddingRight: 44,
                      borderColor: activateForm.confirmPassword && activateForm.password !== activateForm.confirmPassword ? '#EF4444' : BORDE,
                    }}
                    placeholder="Repite la contraseña"
                  />
                  <button onClick={() => setShowPass2(!showPass2)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: GRIS, padding: 0 }}>
                    {showPass2 ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {activateForm.confirmPassword && activateForm.password === activateForm.confirmPassword && (
                    <div style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)', color: '#16A34A' }}>
                      <Check size={16} />
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#DC2626' }}>
                  {error}
                </div>
              )}

              <button onClick={handleActivate} disabled={loading}
                style={{
                  width: '100%', height: 46, backgroundColor: loading ? '#555' : NEGRO,
                  color: AMARILLO, border: 'none', borderRadius: 10, fontSize: 14,
                  fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8, marginTop: 4,
                  transition: 'background-color 0.2s',
                }}>
                {loading ? 'Activando...' : <>Activar cuenta <ArrowRight size={16} /></>}
              </button>

              <div style={{ textAlign: 'center' }}>
                <button onClick={() => { setMode('login'); setError('') }}
                  style={{ fontSize: 12, color: GRIS, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  ¿Ya tienes cuenta? Inicia sesión
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
          © 2026 Joan Escala Consulting · Palma de Mallorca
        </div>
      </div>
    </div>
  )
}
