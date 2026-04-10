'use client'

import { useState, useEffect } from 'react'
import AppLayout from '@/components/AppLayout'
import { ToastProvider, useToast } from '@/components/Toast'
import { Plus, Edit2, Trash2 } from 'lucide-react'

interface User { id: number; email: string; rol: string; clienteId: number | null; nombre: string; primerNombre: string }
interface Cliente { id: number; nombre: string }
interface Contenido {
  id: number; cliente_id: number; fecha_publicacion: string; plataforma: string;
  tipo_contenido: string; gancho: string | null; notas_caption: string | null;
  etiqueta_fuente: string | null; seguidores_icp: number; comentarios: number;
  guardados: number; dms_recibidos: number; visualizaciones: number;
}

const PLATAFORMAS = ['Instagram Reel','Instagram Story','Instagram Carrusel','YouTube','TikTok','LinkedIn']
const TIPOS = ['Gancho/Hook','Talking Head','Educativo','Behind the Scenes','Caso de Estudio','Testimonio','Oferta Directa','Controversia','Resultado','Otro']

const PLATAFORMA_COLORS: Record<string, { bg: string; color: string }> = {
  'Instagram Reel': { bg: '#FCE7F3', color: '#EC4899' },
  'Instagram Story': { bg: '#F3E8FF', color: '#A855F7' },
  'Instagram Carrusel': { bg: '#EEF2FF', color: '#6366F1' },
  'YouTube': { bg: '#FEE2E2', color: '#EF4444' },
  'TikTok': { bg: '#F3F4F6', color: '#111827' },
  'LinkedIn': { bg: '#DBEAFE', color: '#2563EB' },
}

function ContenidoModal({
  clienteId, item, onClose, onSave,
}: {
  clienteId: number; item: Contenido | null; onClose: () => void; onSave: (c: Contenido) => void
}) {
  const { addToast } = useToast()
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    fecha_publicacion: item?.fecha_publicacion?.split('T')[0] || today,
    plataforma: item?.plataforma || 'Instagram Reel',
    tipo_contenido: item?.tipo_contenido || 'Gancho/Hook',
    gancho: item?.gancho || '',
    notas_caption: item?.notas_caption || '',
    etiqueta_fuente: item?.etiqueta_fuente || '',
    seguidores_icp: item?.seguidores_icp ?? 0,
    comentarios: item?.comentarios ?? 0,
    guardados: item?.guardados ?? 0,
    dms_recibidos: item?.dms_recibidos ?? 0,
    visualizaciones: item?.visualizaciones ?? 0,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let res: Response
      if (item) {
        res = await fetch(`/api/contenido/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        if (res.ok) { addToast('Contenido actualizado', 'success'); onSave({ ...item, ...form }); onClose() }
      } else {
        res = await fetch('/api/contenido', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clienteId, ...form }) })
        if (res.ok) { const data = await res.json(); addToast('Contenido registrado', 'success'); onSave(data.contenido); onClose() }
      }
      if (!res.ok) addToast('Error al guardar', 'error')
    } finally { setLoading(false) }
  }

  const inputStyle = { width: '100%', height: 38, border: '1px solid #E2E8F0', borderRadius: 8, padding: '0 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }
  const labelStyle: React.CSSProperties = { fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94A3B8', display: 'block', marginBottom: 6 }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, width: '90%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 24 }}>
          {item ? 'Editar Contenido' : 'Registrar Contenido'}
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Fecha Publicación</label>
              <input type="date" value={form.fecha_publicacion} onChange={e => setForm(f => ({ ...f, fecha_publicacion: e.target.value }))} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Plataforma</label>
              <select value={form.plataforma} onChange={e => setForm(f => ({ ...f, plataforma: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                {PLATAFORMAS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tipo de Contenido</label>
              <select value={form.tipo_contenido} onChange={e => setForm(f => ({ ...f, tipo_contenido: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Etiqueta Fuente</label>
              <input value={form.etiqueta_fuente} onChange={e => setForm(f => ({ ...f, etiqueta_fuente: e.target.value }))} placeholder='ej. "Hook de Dolor Fitness"' style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Gancho (primera frase)</label>
            <input value={form.gancho} onChange={e => setForm(f => ({ ...f, gancho: e.target.value }))} placeholder="¿Cuál fue el gancho/primera frase?" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Notas (ángulo, CTA o tema)</label>
            <input value={form.notas_caption} onChange={e => setForm(f => ({ ...f, notas_caption: e.target.value }))} placeholder="Ángulo, CTA o tema principal" style={inputStyle} />
          </div>
          <div className="grid grid-cols-5 gap-3">
            {(['seguidores_icp','comentarios','guardados','dms_recibidos','visualizaciones'] as const).map(k => (
              <div key={k}>
                <label style={{ ...labelStyle, fontSize: 9 }}>{k.replace('_', ' ').replace('_', ' ')}</label>
                <input type="number" min="0" value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: parseInt(e.target.value) || 0 }))} style={inputStyle} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, height: 40, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>Cancelar</button>
            <button type="submit" disabled={loading} style={{ flex: 1, height: 40, backgroundColor: '#0891B2', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600 }}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ContenidoContent() {
  const { addToast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null)
  const [items, setItems] = useState<Contenido[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; item: Contenido | null }>({ open: false, item: null })

  useEffect(() => { fetch('/api/auth/me').then(r => r.json()).then(u => { setUser(u); if (u.clienteId) setSelectedClienteId(u.clienteId) }) }, [])
  useEffect(() => {
    if (user?.rol === 'admin') {
      fetch('/api/clientes').then(r => r.json()).then(d => { setClientes(d.clientes || []); if (d.clientes?.length > 0) setSelectedClienteId(d.clientes[0].id) })
    }
  }, [user])
  useEffect(() => {
    if (!selectedClienteId) return
    setLoading(true)
    fetch(`/api/contenido?clienteId=${selectedClienteId}`).then(r => r.json()).then(d => { setItems(d.contenido || []); setLoading(false) })
  }, [selectedClienteId])

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este contenido?')) return
    await fetch(`/api/contenido/${id}`, { method: 'DELETE' })
    setItems(prev => prev.filter(i => i.id !== id))
    addToast('Contenido eliminado', 'success')
  }

  const handleSave = (c: Contenido) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === c.id)
      if (existing) return prev.map(i => i.id === c.id ? c : i)
      return [c, ...prev]
    })
  }

  const totals = items.reduce((acc, i) => ({
    seguidores_icp: acc.seguidores_icp + (i.seguidores_icp || 0),
    comentarios: acc.comentarios + (i.comentarios || 0),
    guardados: acc.guardados + (i.guardados || 0),
    dms_recibidos: acc.dms_recibidos + (i.dms_recibidos || 0),
    visualizaciones: acc.visualizaciones + (i.visualizaciones || 0),
  }), { seguidores_icp: 0, comentarios: 0, guardados: 0, dms_recibidos: 0, visualizaciones: 0 })

  // Insights
  const byPlataforma = PLATAFORMAS.map(p => ({
    plataforma: p,
    dms: items.filter(i => i.plataforma === p).reduce((s, i) => s + i.dms_recibidos, 0),
  })).sort((a, b) => b.dms - a.dms)
  const mejorPlataforma = byPlataforma[0]

  const byTipo = TIPOS.map(t => ({
    tipo: t,
    icp: items.filter(i => i.tipo_contenido === t).reduce((s, i) => s + i.seguidores_icp, 0),
  })).sort((a, b) => b.icp - a.icp)
  const mejorTipo = byTipo[0]

  const vistaDM = totals.visualizaciones > 0 ? ((totals.dms_recibidos / totals.visualizaciones) * 100).toFixed(2) : '0.00'

  const statCardStyle = {
    backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 12,
    padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  }
  const colStyle: React.CSSProperties = { padding: '0 12px', fontSize: 13, color: '#0F172A' }
  const headerColStyle: React.CSSProperties = { padding: '0 12px', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#94A3B8', fontWeight: 600 }

  if (!user) return null

  return (
    <div className="p-6">
      {/* Admin tabs */}
      {user.rol === 'admin' && (
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '2px solid #E2E8F0' }}>
          {clientes.map(c => (
            <button key={c.id} onClick={() => setSelectedClienteId(c.id)}
              style={{ padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', borderBottom: selectedClienteId === c.id ? '2px solid #0891B2' : '2px solid transparent', marginBottom: -2, color: selectedClienteId === c.id ? '#0891B2' : '#94A3B8', fontWeight: selectedClienteId === c.id ? 600 : 400, fontSize: 14, fontFamily: 'inherit' }}>
              {c.nombre}
            </button>
          ))}
        </div>
      )}

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 700, color: '#0F172A' }}>Contenido</div>
        {selectedClienteId && (
          <button onClick={() => setModal({ open: true, item: null })}
            style={{ height: 36, backgroundColor: '#0891B2', color: '#fff', border: 'none', borderRadius: 8, padding: '0 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={14} /> Registrar Contenido
          </button>
        )}
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Seguidores ICP', value: totals.seguidores_icp },
          { label: 'Comentarios', value: totals.comentarios },
          { label: 'Guardados', value: totals.guardados },
          { label: 'DMs Recibidos', value: totals.dms_recibidos },
          { label: 'Visualizaciones', value: totals.visualizaciones },
        ].map(s => (
          <div key={s.label} style={statCardStyle}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#94A3B8', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 700, color: '#0F172A' }}>{s.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      {!loading && items.length === 0 ? (
        <div style={statCardStyle}>
          <div style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 40, color: '#D1D5DB', marginBottom: 12 }}>✏️</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>Aún no hay contenido registrado</div>
            <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 }}>Empieza a trackear tus posts para ver qué contenido genera pipeline</div>
            {selectedClienteId && (
              <button onClick={() => setModal({ open: true, item: null })}
                style={{ height: 36, backgroundColor: '#0891B2', color: '#fff', border: 'none', borderRadius: 8, padding: '0 20px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                + Registrar Contenido
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1100 }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', height: 40 }}>
                  {['Fecha','Plataforma','Tipo','Gancho','Seg. ICP','Comentarios','Guardados','DMs','Views','Fuente','Acciones'].map(h => (
                    <th key={h} style={headerColStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const pc = PLATAFORMA_COLORS[item.plataforma] || { bg: '#F4F4F5', color: '#71717A' }
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9', height: 48 }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.querySelector('.row-actions')?.setAttribute('style', 'display:flex;gap:8px;') }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.querySelector('.row-actions')?.setAttribute('style', 'display:none;') }}
                    >
                      <td style={colStyle}>{item.fecha_publicacion?.split('T')[0]}</td>
                      <td style={colStyle}>
                        <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, backgroundColor: pc.bg, color: pc.color, fontSize: 11, fontWeight: 500 }}>
                          {item.plataforma}
                        </span>
                      </td>
                      <td style={colStyle}>{item.tipo_contenido}</td>
                      <td style={{ ...colStyle, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.gancho}</td>
                      <td style={colStyle}>{item.seguidores_icp}</td>
                      <td style={colStyle}>{item.comentarios}</td>
                      <td style={colStyle}>{item.guardados}</td>
                      <td style={colStyle}>{item.dms_recibidos}</td>
                      <td style={colStyle}>{item.visualizaciones}</td>
                      <td style={{ ...colStyle, fontSize: 11, color: '#94A3B8' }}>{item.etiqueta_fuente}</td>
                      <td style={colStyle}>
                        <div className="row-actions" style={{ display: 'none', gap: 8 }}>
                          <button onClick={() => setModal({ open: true, item })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4 }}>
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: 4 }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Insights */}
      {items.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div style={statCardStyle}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#94A3B8', marginBottom: 8 }}>Mejor Plataforma por DMs</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>{mejorPlataforma?.plataforma || '—'}</div>
            <div style={{ fontSize: 13, color: '#0891B2', marginTop: 4 }}>{mejorPlataforma?.dms || 0} DMs recibidos</div>
          </div>
          <div style={statCardStyle}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#94A3B8', marginBottom: 8 }}>Mejor Tipo por Seg. ICP</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>{mejorTipo?.tipo || '—'}</div>
            <div style={{ fontSize: 13, color: '#0891B2', marginTop: 4 }}>{mejorTipo?.icp || 0} seguidores ICP</div>
          </div>
          <div style={statCardStyle}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#94A3B8', marginBottom: 8 }}>Tasa Vista-a-DM</div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Sora, sans-serif', color: '#0F172A' }}>{vistaDM}%</div>
          </div>
        </div>
      )}

      {modal.open && selectedClienteId && (
        <ContenidoModal
          clienteId={selectedClienteId}
          item={modal.item}
          onClose={() => setModal({ open: false, item: null })}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

export default function ContenidoPage() {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => { fetch('/api/auth/me').then(r => r.json()).then(setUser) }, [])
  if (!user) return null

  return (
    <ToastProvider>
      <AppLayout user={user} title="Contenido">
        <ContenidoContent />
      </AppLayout>
    </ToastProvider>
  )
}
