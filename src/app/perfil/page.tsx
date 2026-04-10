'use client'

import { useState, useEffect, useRef } from 'react'
import AppLayout from '@/components/AppLayout'
import { ToastProvider, useToast } from '@/components/Toast'
import { Camera, Copy, RefreshCw } from 'lucide-react'

interface User { id: number; email: string; rol: string; clienteId: number | null; nombre: string; primerNombre: string }
interface ProfileData {
  id: number; nombre: string; apellido: string; email: string; rol: string;
  fecha_nacimiento: string | null; nicho: string | null; oferta: string | null;
  fecha_inicio_programa: string | null; foto_perfil: string | null; created_at: string;
}

function PerfilContent() {
  const { addToast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [webhookGhl, setWebhookGhl] = useState('')
  const [loading, setLoading] = useState(false)
  const [pwForm, setPwForm] = useState({ current: '', nueva: '', confirmar: '' })
  const [savingPw, setSavingPw] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(setUser)
    fetch('/api/perfil').then(r => r.json()).then(d => {
      if (d.user) {
        setProfile(d.user)
        setApiKey(d.apiKey)
        setWebhookGhl(d.webhookGhl || '')
      }
    })
  }, [])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string
      setProfile(p => p ? { ...p, foto_perfil: base64 } : p)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!profile) return
    setLoading(true)
    try {
      const res = await fetch('/api/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (res.ok) addToast('Perfil actualizado', 'success')
      else addToast('Error al guardar', 'error')
    } finally { setLoading(false) }
  }

  const handleChangePassword = async () => {
    if (pwForm.nueva !== pwForm.confirmar) { addToast('Las contraseñas no coinciden', 'error'); return }
    setSavingPw(true)
    try {
      const res = await fetch('/api/perfil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change_password', currentPassword: pwForm.current, newPassword: pwForm.nueva }),
      })
      const data = await res.json()
      if (res.ok) { addToast('Contraseña actualizada', 'success'); setPwForm({ current: '', nueva: '', confirmar: '' }) }
      else addToast(data.error || 'Error', 'error')
    } finally { setSavingPw(false) }
  }

  const handleRegenerateKey = async () => {
    const res = await fetch('/api/perfil', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'regenerate_api_key' }) })
    const data = await res.json()
    if (data.apiKey) { setApiKey(data.apiKey); addToast('API Key regenerada', 'success') }
  }

  const handleSaveWebhook = async () => {
    const res = await fetch('/api/perfil', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'save_webhook', webhookGhl }) })
    if (res.ok) addToast('Webhook guardado', 'success')
  }

  const inputStyle = { width: '100%', height: 38, border: '1px solid #E2E8F0', borderRadius: 8, padding: '0 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none', backgroundColor: '#fff' }
  const labelStyle: React.CSSProperties = { fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94A3B8', display: 'block', marginBottom: 6 }
  const sectionStyle = { backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }

  if (!user || !profile) return null

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 700, color: '#0F172A', marginBottom: 24 }}>Perfil</h1>

      {/* Avatar + Info */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          {/* Avatar */}
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', overflow: 'hidden',
              backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 700, color: '#0891B2',
            }}>
              {profile.foto_perfil ? (
                <img src={profile.foto_perfil} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                (profile.nombre || 'U').charAt(0).toUpperCase()
              )}
            </div>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0,
              transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
            >
              <Camera size={20} color="#fff" />
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
          </div>

          {/* User info */}
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>
              {profile.nombre} {profile.apellido}
            </div>
            <span style={{
              display: 'inline-block', padding: '2px 10px', borderRadius: 20, marginTop: 4,
              backgroundColor: profile.rol === 'admin' ? '#E0F2FE' : '#F0FDF4',
              color: profile.rol === 'admin' ? '#0891B2' : '#16A34A', fontSize: 12, fontWeight: 600,
            }}>
              {profile.rol === 'admin' ? 'Consultor' : 'Cliente'}
            </span>
            <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 6 }}>
              Miembro desde {new Date(profile.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}
            </div>
          </div>
        </div>

        {/* Form grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Nombre</label>
            <input value={profile.nombre || ''} onChange={e => setProfile(p => p ? { ...p, nombre: e.target.value } : p)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Apellido</label>
            <input value={profile.apellido || ''} onChange={e => setProfile(p => p ? { ...p, apellido: e.target.value } : p)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={profile.email || ''} onChange={e => setProfile(p => p ? { ...p, email: e.target.value } : p)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Fecha de Nacimiento</label>
            <input type="date" value={profile.fecha_nacimiento?.split('T')[0] || ''} onChange={e => setProfile(p => p ? { ...p, fecha_nacimiento: e.target.value } : p)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Nicho</label>
            <input value={profile.nicho || ''} onChange={e => setProfile(p => p ? { ...p, nicho: e.target.value } : p)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Oferta</label>
            <input value={profile.oferta || ''} onChange={e => setProfile(p => p ? { ...p, oferta: e.target.value } : p)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Fecha Inicio Programa</label>
            <input type="date" value={profile.fecha_inicio_programa?.split('T')[0] || ''} onChange={e => setProfile(p => p ? { ...p, fecha_inicio_programa: e.target.value } : p)} style={inputStyle} />
          </div>
        </div>

        <button onClick={handleSave} disabled={loading}
          style={{ marginTop: 20, height: 36, backgroundColor: loading ? '#7EC8DC' : '#0891B2', color: '#fff', border: 'none', borderRadius: 8, padding: '0 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {/* Change Password */}
      <div style={sectionStyle}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>Cambiar Contraseña</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div><label style={labelStyle}>Contraseña Actual</label><input type="password" value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} style={inputStyle} /></div>
          <div><label style={labelStyle}>Nueva Contraseña</label><input type="password" value={pwForm.nueva} onChange={e => setPwForm(f => ({ ...f, nueva: e.target.value }))} style={inputStyle} /></div>
          <div><label style={labelStyle}>Confirmar Contraseña</label><input type="password" value={pwForm.confirmar} onChange={e => setPwForm(f => ({ ...f, confirmar: e.target.value }))} style={inputStyle} /></div>
          <button onClick={handleChangePassword} disabled={savingPw}
            style={{ height: 36, backgroundColor: savingPw ? '#7EC8DC' : '#0891B2', color: '#fff', border: 'none', borderRadius: 8, padding: '0 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', alignSelf: 'flex-start' }}>
            {savingPw ? 'Guardando...' : 'Cambiar Contraseña'}
          </button>
        </div>
      </div>

      {/* Admin section */}
      {user.rol === 'admin' && (
        <div style={sectionStyle}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>Configuración Admin</div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>API Key</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{
                flex: 1, height: 38, border: '1px solid #E2E8F0', borderRadius: 8, padding: '0 12px',
                fontSize: 13, fontFamily: 'monospace', display: 'flex', alignItems: 'center',
                backgroundColor: '#F8FAFC', color: '#475569', overflow: 'hidden',
              }}>
                {apiKey || 'No API key generada'}
              </div>
              {apiKey && (
                <button onClick={() => { navigator.clipboard.writeText(apiKey); addToast('API Key copiada', 'success') }}
                  style={{ height: 38, border: '1px solid #E2E8F0', borderRadius: 8, padding: '0 12px', backgroundColor: '#F8FAFC', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'inherit' }}>
                  <Copy size={14} /> Copiar
                </button>
              )}
              <button onClick={handleRegenerateKey}
                style={{ height: 38, border: '1px solid #E2E8F0', borderRadius: 8, padding: '0 12px', backgroundColor: '#F8FAFC', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'inherit' }}>
                <RefreshCw size={14} /> Regenerar
              </button>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Webhook GHL (URL)</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={webhookGhl} onChange={e => setWebhookGhl(e.target.value)} placeholder="https://..." style={{ ...inputStyle, flex: 1 }} />
              <button onClick={handleSaveWebhook}
                style={{ height: 38, backgroundColor: '#0891B2', color: '#fff', border: 'none', borderRadius: 8, padding: '0 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Guardar
              </button>
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 6 }}>
              Se enviará nombre + email cuando un nuevo cliente se registre.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PerfilPage() {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => { fetch('/api/auth/me').then(r => r.json()).then(setUser) }, [])
  if (!user) return null

  return (
    <ToastProvider>
      <AppLayout user={user} title="Perfil">
        <PerfilContent />
      </AppLayout>
    </ToastProvider>
  )
}
