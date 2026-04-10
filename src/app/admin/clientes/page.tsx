'use client'

import { useState, useEffect, useCallback } from 'react'
import AppLayout from '@/components/AppLayout'
import { ToastProvider, useToast } from '@/components/Toast'
import { Search, Plus, MoreVertical, Edit2, Eye, ToggleLeft, Trash2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface User { id: number; email: string; rol: string; clienteId: number | null; nombre: string; primerNombre: string }
interface Cliente {
  id: number; nombre: string; email: string; nicho: string | null; oferta: string | null;
  tier: string; fecha_inicio: string | null; estado: string;
}

function ClienteModal({ item, onClose, onSave }: { item: Cliente | null; onClose: () => void; onSave: () => void }) {
  const { addToast } = useToast()
  const [form, setForm] = useState({
    nombre: item?.nombre || '',
    apellido: '',
    email: item?.email || '',
    password: '',
    tier: item?.tier || 'Pro',
    fecha_inicio: item?.fecha_inicio?.split('T')[0] || '',
    nicho: item?.nicho || '',
    oferta: item?.oferta || '',
    estado: item?.estado || 'activo',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let res: Response
      if (item) {
        res = await fetch(`/api/clientes/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      } else {
        res = await fetch('/api/clientes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      }
      const data = await res.json()
      if (res.ok) { addToast(item ? 'Cliente actualizado' : 'Cliente creado', 'success'); onSave(); onClose() }
      else addToast(data.error || 'Error', 'error')
    } finally { setLoading(false) }
  }

  const inputStyle = { width: '100%', height: 38, border: '1px solid #E2E8F0', borderRadius: 8, padding: '0 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }
  const labelStyle: React.CSSProperties = { fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94A3B8', display: 'block', marginBottom: 6 }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, width: '90%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 24 }}>
          {item ? 'Editar Cliente' : 'Añadir Cliente'}
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="grid grid-cols-2 gap-4">
            <div><label style={labelStyle}>Nombre *</label><input required value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} style={inputStyle} /></div>
            <div><label style={labelStyle}>Apellido</label><input value={form.apellido} onChange={e => setForm(f => ({ ...f, apellido: e.target.value }))} style={inputStyle} /></div>
            <div><label style={labelStyle}>Email *</label><input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} /></div>
            {!item && <div><label style={labelStyle}>Contraseña *</label><input required type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={inputStyle} /></div>}
            <div>
              <label style={labelStyle}>Tier</label>
              <select value={form.tier} onChange={e => setForm(f => ({ ...f, tier: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                {['Starter','Pro','Socio'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>Fecha Inicio</label><input type="date" value={form.fecha_inicio} onChange={e => setForm(f => ({ ...f, fecha_inicio: e.target.value }))} style={inputStyle} /></div>
            <div><label style={labelStyle}>Nicho</label><input value={form.nicho} onChange={e => setForm(f => ({ ...f, nicho: e.target.value }))} style={inputStyle} /></div>
            <div><label style={labelStyle}>Oferta</label><input value={form.oferta} onChange={e => setForm(f => ({ ...f, oferta: e.target.value }))} style={inputStyle} /></div>
            <div>
              <label style={labelStyle}>Estado</label>
              <select value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, height: 40, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>Cancelar</button>
            <button type="submit" disabled={loading} style={{ flex: 1, height: 40, backgroundColor: '#0891B2', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600 }}>
              {loading ? 'Guardando...' : item ? 'Actualizar' : 'Crear Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ClientesContent() {
  const { addToast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<User | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [modal, setModal] = useState<{ open: boolean; item: Cliente | null }>({ open: false, item: null })
  const [menuOpen, setMenuOpen] = useState<number | null>(null)

  useEffect(() => { fetch('/api/auth/me').then(r => r.json()).then(setUser) }, [])

  const loadClientes = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/clientes')
    const data = await res.json()
    setClientes(data.clientes || [])
    setLoading(false)
  }, [])

  useEffect(() => { loadClientes() }, [loadClientes])

  // Auto-open modal if ?new=1
  useEffect(() => {
    if (searchParams.get('new') === '1') setModal({ open: true, item: null })
  }, [searchParams])

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar a ${nombre}? Esta acción no se puede deshacer.`)) return
    await fetch(`/api/clientes/${id}`, { method: 'DELETE' })
    setClientes(prev => prev.filter(c => c.id !== id))
    addToast('Cliente eliminado', 'success')
    setMenuOpen(null)
  }

  const handleToggleEstado = async (c: Cliente) => {
    const newEstado = c.estado === 'activo' ? 'inactivo' : 'activo'
    await fetch(`/api/clientes/${c.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...c, estado: newEstado }),
    })
    setClientes(prev => prev.map(cl => cl.id === c.id ? { ...cl, estado: newEstado } : cl))
    addToast(`Cliente ${newEstado === 'activo' ? 'activado' : 'desactivado'}`, 'success')
    setMenuOpen(null)
  }

  const filtered = clientes.filter(c =>
    !busqueda || c.nombre.toLowerCase().includes(busqueda.toLowerCase()) || c.email?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const headerColStyle: React.CSSProperties = { padding: '0 16px', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#94A3B8', fontWeight: 600, textAlign: 'left' }
  const colStyle: React.CSSProperties = { padding: '0 16px', fontSize: 14, color: '#0F172A' }

  if (!user) return null

  return (
    <div className="p-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Clientes</h1>
          <p style={{ fontSize: 13, color: '#94A3B8' }}>{clientes.length} cliente{clientes.length !== 1 ? 's' : ''} registrado{clientes.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setModal({ open: true, item: null })}
          style={{ height: 36, backgroundColor: '#0891B2', color: '#fff', border: 'none', borderRadius: 8, padding: '0 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={14} /> Añadir Cliente
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16, maxWidth: 320 }}>
        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
        <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o email..."
          style={{ width: '100%', height: 38, border: '1px solid #E2E8F0', borderRadius: 8, paddingLeft: 32, fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', height: 40 }}>
              <th style={headerColStyle}>Nombre</th>
              <th style={headerColStyle}>Email</th>
              <th style={headerColStyle}>Tier</th>
              <th style={headerColStyle}>Fecha Inicio</th>
              <th style={headerColStyle}>Nicho / Oferta</th>
              <th style={headerColStyle}>Estado</th>
              <th style={headerColStyle}></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 48, color: '#94A3B8' }}>Cargando...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 64 }}>
                  <div style={{ fontSize: 40, color: '#D1D5DB', marginBottom: 12 }}>👥</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>No hay clientes todavía</div>
                  <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 }}>Añade tu primer cliente para empezar</div>
                  <button onClick={() => setModal({ open: true, item: null })}
                    style={{ height: 36, backgroundColor: '#0891B2', color: '#fff', border: 'none', borderRadius: 8, padding: '0 20px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                    + Añadir Cliente
                  </button>
                </td>
              </tr>
            )}
            {!loading && filtered.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9', height: 56 }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ ...colStyle, fontWeight: 600 }}>{c.nombre}</td>
                <td style={{ ...colStyle, color: '#475569' }}>{c.email}</td>
                <td style={colStyle}>
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: 20,
                    backgroundColor: c.tier === 'Socio' ? '#F0FDF4' : c.tier === 'Pro' ? '#E0F2FE' : '#F8FAFC',
                    color: c.tier === 'Socio' ? '#16A34A' : c.tier === 'Pro' ? '#0891B2' : '#475569',
                    fontSize: 12, fontWeight: 500,
                  }}>
                    {c.tier}
                  </span>
                </td>
                <td style={{ ...colStyle, color: '#475569' }}>
                  {c.fecha_inicio ? new Date(c.fecha_inicio).toLocaleDateString('es-ES') : '—'}
                </td>
                <td style={{ ...colStyle, color: '#475569', fontSize: 13 }}>
                  {c.nicho || c.oferta ? `${c.nicho || ''}${c.nicho && c.oferta ? ' / ' : ''}${c.oferta || ''}` : '—'}
                </td>
                <td style={colStyle}>
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: 20,
                    backgroundColor: c.estado === 'activo' ? '#F0FDF4' : '#FEF2F2',
                    color: c.estado === 'activo' ? '#16A34A' : '#EF4444',
                    fontSize: 12, fontWeight: 500,
                  }}>
                    {c.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={colStyle}>
                  <div style={{ position: 'relative' }}>
                    <button onClick={() => setMenuOpen(menuOpen === c.id ? null : c.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#94A3B8', borderRadius: 4 }}>
                      <MoreVertical size={16} />
                    </button>
                    {menuOpen === c.id && (
                      <div style={{
                        position: 'absolute', right: 0, top: '100%', zIndex: 100, backgroundColor: '#fff',
                        border: '1px solid #E2E8F0', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        minWidth: 160, padding: 4,
                      }}>
                        <button onClick={() => { setModal({ open: true, item: c }); setMenuOpen(null) }}
                          style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, color: '#0F172A', borderRadius: 4, fontFamily: 'inherit' }}>
                          <Edit2 size={13} /> Editar
                        </button>
                        <button onClick={() => { router.push(`/panel?clienteId=${c.id}`); setMenuOpen(null) }}
                          style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, color: '#0F172A', borderRadius: 4, fontFamily: 'inherit' }}>
                          <Eye size={13} /> Ver Panel
                        </button>
                        <button onClick={() => handleToggleEstado(c)}
                          style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, color: '#0F172A', borderRadius: 4, fontFamily: 'inherit' }}>
                          <ToggleLeft size={13} /> {c.estado === 'activo' ? 'Desactivar' : 'Activar'}
                        </button>
                        <div style={{ height: 1, backgroundColor: '#E2E8F0', margin: '4px 0' }} />
                        <button onClick={() => handleDelete(c.id, c.nombre)}
                          style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, color: '#EF4444', borderRadius: 4, fontFamily: 'inherit' }}>
                          <Trash2 size={13} /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal.open && (
        <ClienteModal
          item={modal.item}
          onClose={() => setModal({ open: false, item: null })}
          onSave={loadClientes}
        />
      )}
    </div>
  )
}

export default function ClientesPage() {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => { fetch('/api/auth/me').then(r => r.json()).then(setUser) }, [])
  if (!user) return null

  return (
    <ToastProvider>
      <AppLayout user={user} title="Clientes">
        <ClientesContent />
      </AppLayout>
    </ToastProvider>
  )
}
