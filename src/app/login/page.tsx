'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Error al iniciar sesión')
          return
        }
        router.push('/reporte')
        router.refresh()
      } else {
        if (form.password !== form.confirmPassword) {
          setError('Las contraseñas no coinciden')
          return
        }
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: form.nombre,
            apellido: form.apellido,
            email: form.email,
            password: form.password,
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Error al registrar')
          return
        }
        // Auto login
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password }),
        })
        router.push('/reporte')
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#0F172A' }}
    >
      <div
        className="w-full"
        style={{ maxWidth: 420 }}
      >
        {/* Card */}
        <div
          className="bg-white p-8"
          style={{ borderRadius: 24, boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.5px',
                fontFamily: 'Sora, sans-serif',
              }}
            >
              ESCALA
            </div>
            <div style={{ color: '#94A3B8', fontSize: 11, marginTop: 4 }}>
              Joan Escala Consulting
            </div>
          </div>

          {/* Toggle */}
          <div
            className="flex mb-6"
            style={{ borderBottom: '2px solid #E2E8F0' }}
          >
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className="flex-1 pb-3 text-sm font-medium transition-colors"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  borderBottom: mode === m ? '2px solid #0891B2' : '2px solid transparent',
                  marginBottom: -2,
                  color: mode === m ? '#0891B2' : '#94A3B8',
                  fontFamily: 'inherit',
                  fontWeight: mode === m ? 600 : 400,
                }}
              >
                {m === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94A3B8', display: 'block', marginBottom: 6 }}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nombre}
                    onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                    style={{
                      width: '100%', height: 38, border: '1px solid #E2E8F0',
                      borderRadius: 8, padding: '0 12px', fontSize: 14,
                      fontFamily: 'inherit', outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94A3B8', display: 'block', marginBottom: 6 }}>
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={form.apellido}
                    onChange={e => setForm(f => ({ ...f, apellido: e.target.value }))}
                    style={{
                      width: '100%', height: 38, border: '1px solid #E2E8F0',
                      borderRadius: 8, padding: '0 12px', fontSize: 14,
                      fontFamily: 'inherit', outline: 'none',
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94A3B8', display: 'block', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={{
                  width: '100%', height: 38, border: '1px solid #E2E8F0',
                  borderRadius: 8, padding: '0 12px', fontSize: 14,
                  fontFamily: 'inherit', outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94A3B8', display: 'block', marginBottom: 6 }}>
                Contraseña
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                style={{
                  width: '100%', height: 38, border: '1px solid #E2E8F0',
                  borderRadius: 8, padding: '0 12px', fontSize: 14,
                  fontFamily: 'inherit', outline: 'none',
                }}
              />
            </div>

            {mode === 'register' && (
              <div>
                <label style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94A3B8', display: 'block', marginBottom: 6 }}>
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  style={{
                    width: '100%', height: 38, border: '1px solid #E2E8F0',
                    borderRadius: 8, padding: '0 12px', fontSize: 14,
                    fontFamily: 'inherit', outline: 'none',
                  }}
                />
              </div>
            )}

            {error && (
              <div
                className="text-sm"
                style={{ color: '#EF4444', backgroundColor: '#FEF2F2', padding: '10px 12px', borderRadius: 8 }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: 44, backgroundColor: loading ? '#7EC8DC' : '#0891B2',
                color: '#ffffff', border: 'none', borderRadius: 8, fontSize: 13,
                fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', marginTop: 4, transition: 'background-color 0.2s',
              }}
            >
              {loading ? 'Cargando...' : mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
