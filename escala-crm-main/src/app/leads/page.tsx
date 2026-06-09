'use client'

import { useState, useEffect, useRef } from 'react'
import AppLayout from '@/components/AppLayout'
import { ToastProvider, useToast } from '@/components/Toast'
import { Search, Plus, ChevronDown } from 'lucide-react'

interface User { id: number; email: string; rol: string; clienteId: number | null; nombre: string; primerNombre: string }
interface Cliente { id: number; nombre: string }
interface Lead {
  id: number; cliente_id: number; ig_handle: string; etapa: string;
  estado_conversacion: string | null; ultimo_contacto: string | null; fecha_call: string | null;
  asistencia: string | null; resultado_call: string | null; cash_cobrado: number;
  fuente_lead: string | null; calidad_lead: string | null; nicho: string | null; notas: string | null;
}

const ETAPAS = ['Sin Contactar','DM Enviado','Conversación','Dolor Excavado','Recurso Enviado','Call Propuesta','Call Agendada','Post-Booking','Call Realizada','Seguimiento 1','Seguimiento 2','Seguimiento 3','Cerrado','Descartado']
const ESTADO_CONV = ['Primer DM','Rapport','Abrirme Yo','Objetivo Tangible','Por Qué Profundo','Coste de No Actuar','Propuesta Call','Call Agendada','VSL Enviado','Reprogramar','Cancelada','Quemado','Seguimiento Post-Call','Seguimiento Visto','Seguimiento Valor']
const CALIDAD = ['Excelente','Bueno','Regular','Bajo']
const RESULTADO = ['PIF','Cuotas','Seguimiento','No Cierre','No Se Presentó']
const ASISTENCIA = ['Sí','No']

const ETAPA_COLORS: Record<string, { bg: string; color: string }> = {
  'Sin Contactar': { bg: '#F4F4F5', color: '#71717A' },
  'DM Enviado': { bg: '#EFF6FF', color: '#3B82F6' },
  'Conversación': { bg: '#F0FDFA', color: '#0F766E' },
  'Dolor Excavado': { bg: '#FFF7ED', color: '#EA580C' },
  'Recurso Enviado': { bg: '#EEF2FF', color: '#4F46E5' },
  'Call Propuesta': { bg: '#FDF4FF', color: '#9333EA' },
  'Call Agendada': { bg: '#F0FDF4', color: '#16A34A' },
  'Post-Booking': { bg: '#ECFDF5', color: '#059669' },
  'Call Realizada': { bg: '#F5F3FF', color: '#7C3AED' },
  'Seguimiento 1': { bg: '#FFFBEB', color: '#D97706' },
  'Seguimiento 2': { bg: '#FFFBEB', color: '#D97706' },
  'Seguimiento 3': { bg: '#FFFBEB', color: '#D97706' },
  'Cerrado': { bg: '#052E16', color: '#FFFFFF' },
  'Descartado': { bg: '#FEE2E2', color: '#991B1B' },
}

function EtapaBadge({ etapa }: { etapa: string }) {
  const c = ETAPA_COLORS[etapa] || { bg: '#F4F4F5', color: '#71717A' }
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 4,
      backgroundColor: c.bg, color: c.color, fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap',
    }}>
      {etapa}
    </span>
  )
}

function InlineDropdown({
  value, options, onSelect, placeholder = '—',
}: {
  value: string | null; options: string[]; onSelect: (v: string) => void; placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setOpen(!open)} style={{
        background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        fontSize: 13, color: value ? '#0F172A' : '#94A3B8', display: 'flex', alignItems: 'center', gap: 4,
        padding: '2px 4px', borderRadius: 4,
      }}>
        {value || placeholder}
        <ChevronDown size={12} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, zIndex: 100, backgroundColor: '#fff',
          border: '1px solid #E2E8F0', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          minWidth: 180, maxHeight: 240, overflowY: 'auto', padding: 4,
        }}>
          {options.map(opt => (
            <div key={opt} onClick={() => { onSelect(opt); setOpen(false) }}
              style={{
                padding: '7px 12px', cursor: 'pointer', fontSize: 13, borderRadius: 4,
                backgroundColor: value === opt ? '#F0F9FF' : 'transparent',
                color: value === opt ? '#0891B2' : '#0F172A',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = value === opt ? '#F0F9FF' : 'transparent')}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AddLeadModal({ clienteId, onClose, onAdd }: { clienteId: number; onClose: () => void; onAdd: (l: Lead) => void }) {
  const { addToast } = useToast()
  const [form, setForm] = useState({ ig_handle: '', etapa: 'Sin Contactar', estado_conversacion: '', fuente_lead: '', calidad_lead: '', nicho: '', notas: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteId, ...form }),
      })
      const data = await res.json()
      if (!res.ok) { addToast(data.error || 'Error', 'error'); return }
      addToast('Lead añadido', 'success')
      onAdd(data.lead)
      onClose()
    } finally { setLoading(false) }
  }

  const inputStyle = { width: '100%', height: 38, border: '1px solid #E2E8F0', borderRadius: 8, padding: '0 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }
  const labelStyle: React.CSSProperties = { fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94A3B8', display: 'block', marginBottom: 6 }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, width: '90%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 24 }}>Añadir Lead</div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={labelStyle}>@ Instagram *</label><input required value={form.ig_handle} onChange={e => setForm(f => ({ ...f, ig_handle: e.target.value }))} placeholder="@usuario" style={inputStyle} /></div>
          <div><label style={labelStyle}>Etapa</label>
            <select value={form.etapa} onChange={e => setForm(f => ({ ...f, etapa: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
              {ETAPAS.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label style={labelStyle}>Fuente</label><input value={form.fuente_lead} onChange={e => setForm(f => ({ ...f, fuente_lead: e.target.value }))} style={inputStyle} /></div>
            <div><label style={labelStyle}>Calidad</label>
              <select value={form.calidad_lead} onChange={e => setForm(f => ({ ...f, calidad_lead: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">—</option>
                {CALIDAD.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div><label style={labelStyle}>Nicho</label><input value={form.nicho} onChange={e => setForm(f => ({ ...f, nicho: e.target.value }))} style={inputStyle} /></div>
          <div><label style={labelStyle}>Notas</label><input value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} style={inputStyle} /></div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, height: 40, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>Cancelar</button>
            <button type="submit" disabled={loading} style={{ flex: 1, height: 40, backgroundColor: '#0891B2', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600 }}>
              {loading ? 'Añadiendo...' : 'Añadir Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function LeadsContent() {
  const { addToast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroEtapa, setFiltroEtapa] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [showModal, setShowModal] = useState(false)

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

  const loadLeads = async (clienteId: number) => {
    setLoading(true)
    const res = await fetch(`/api/leads?clienteId=${clienteId}`)
    const data = await res.json()
    setLeads(data.leads || [])
    setLoading(false)
  }

  useEffect(() => {
    if (selectedClienteId) loadLeads(selectedClienteId)
  }, [selectedClienteId])

  const updateLead = async (id: number, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!res.ok) addToast('Error al actualizar', 'error')
  }

  const filteredLeads = leads.filter(l => {
    const matchEtapa = filtroEtapa === 'Todos' || l.etapa === filtroEtapa
    const matchBusqueda = !busqueda || l.ig_handle.toLowerCase().includes(busqueda.toLowerCase())
    return matchEtapa && matchBusqueda
  })

  const colStyle: React.CSSProperties = { padding: '0 12px', fontSize: 13, color: '#0F172A', whiteSpace: 'nowrap' }
  const headerColStyle: React.CSSProperties = { padding: '0 12px', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#94A3B8', fontWeight: 600 }

  if (!user) return null

  return (
    <div className="p-6">
      {/* Admin tabs */}
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

      {/* Filter row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '0 0 240px' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por @ de Instagram..."
            style={{ width: '100%', height: 36, border: '1px solid #E2E8F0', borderRadius: 8, paddingLeft: 32, paddingRight: 12, fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
          />
        </div>

        {/* Etapa pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, flex: 1 }}>
          {['Todos', ...ETAPAS].map(e => (
            <button key={e} onClick={() => setFiltroEtapa(e)}
              style={{
                padding: '4px 12px', borderRadius: 8, border: `1px solid ${filtroEtapa === e ? '#0891B2' : '#E2E8F0'}`,
                backgroundColor: filtroEtapa === e ? '#0891B2' : '#fff',
                color: filtroEtapa === e ? '#fff' : '#94A3B8', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
              }}>
              {e}
            </button>
          ))}
        </div>

        {/* Add lead button */}
        {selectedClienteId && (
          <button onClick={() => setShowModal(true)}
            style={{
              height: 36, border: '1px solid #0891B2', color: '#0891B2', backgroundColor: 'transparent',
              borderRadius: 8, padding: '0 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
            }}>
            <Plus size={14} /> Añadir Lead
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1200 }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', height: 40 }}>
                <th style={headerColStyle}>@ Instagram</th>
                <th style={headerColStyle}>Etapa</th>
                <th style={headerColStyle}>Estado Convo</th>
                <th style={headerColStyle}>Último Contacto</th>
                <th style={headerColStyle}>Fecha Call</th>
                <th style={headerColStyle}>Asistencia</th>
                <th style={headerColStyle}>Resultado</th>
                <th style={headerColStyle}>Cash</th>
                <th style={headerColStyle}>Fuente</th>
                <th style={headerColStyle}>Calidad</th>
                <th style={headerColStyle}>Nicho</th>
                <th style={headerColStyle}>Notas</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={12} style={{ textAlign: 'center', padding: 48, color: '#94A3B8' }}>Cargando leads...</td></tr>
              )}
              {!loading && filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={12} style={{ textAlign: 'center', padding: 64 }}>
                    <div style={{ color: '#D1D5DB', fontSize: 40, marginBottom: 12 }}>👥</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>No hay leads todavía</div>
                    <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 }}>Empieza a añadir leads para gestionar tu pipeline</div>
                    {selectedClienteId && (
                      <button onClick={() => setShowModal(true)}
                        style={{ height: 36, backgroundColor: '#0891B2', color: '#fff', border: 'none', borderRadius: 8, padding: '0 20px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                        + Añadir Lead
                      </button>
                    )}
                  </td>
                </tr>
              )}
              {!loading && filteredLeads.map(lead => (
                <tr key={lead.id} style={{ borderBottom: '1px solid #F1F5F9', height: 52 }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ ...colStyle, color: '#0891B2', fontWeight: 600 }}>
                    <span style={{ color: '#F59E0B' }}>@</span>{lead.ig_handle.replace('@', '')}
                  </td>
                  <td style={colStyle}>
                    <InlineDropdown value={lead.etapa} options={ETAPAS}
                      onSelect={v => updateLead(lead.id, { etapa: v })}
                    />
                  </td>
                  <td style={colStyle}>
                    <InlineDropdown value={lead.estado_conversacion} options={ESTADO_CONV}
                      onSelect={v => updateLead(lead.id, { estado_conversacion: v })}
                    />
                  </td>
                  <td style={colStyle}>
                    <input type="date" value={lead.ultimo_contacto || ''}
                      onChange={e => updateLead(lead.id, { ultimo_contacto: e.target.value || null })}
                      style={{ border: 'none', background: 'none', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', color: '#0F172A' }}
                    />
                  </td>
                  <td style={colStyle}>
                    <input type="date" value={lead.fecha_call || ''}
                      onChange={e => updateLead(lead.id, { fecha_call: e.target.value || null })}
                      style={{ border: 'none', background: 'none', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', color: '#0F172A' }}
                    />
                  </td>
                  <td style={colStyle}>
                    <InlineDropdown value={lead.asistencia} options={ASISTENCIA}
                      onSelect={v => updateLead(lead.id, { asistencia: v })}
                    />
                  </td>
                  <td style={colStyle}>
                    <InlineDropdown value={lead.resultado_call} options={RESULTADO}
                      onSelect={v => updateLead(lead.id, { resultado_call: v })}
                    />
                  </td>
                  <td style={colStyle}>
                    <input type="number" value={lead.cash_cobrado || 0}
                      onBlur={e => updateLead(lead.id, { cash_cobrado: parseFloat(e.target.value) || 0 })}
                      onChange={e => setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, cash_cobrado: parseFloat(e.target.value) || 0 } : l))}
                      style={{ border: 'none', background: 'none', fontSize: 13, fontFamily: 'inherit', width: 80, color: '#0F172A' }}
                    />
                  </td>
                  <td style={colStyle}>
                    <input type="text" value={lead.fuente_lead || ''}
                      onBlur={e => updateLead(lead.id, { fuente_lead: e.target.value || null })}
                      onChange={e => setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, fuente_lead: e.target.value } : l))}
                      style={{ border: 'none', background: 'none', fontSize: 13, fontFamily: 'inherit', width: 120, color: '#0F172A' }}
                    />
                  </td>
                  <td style={colStyle}>
                    <InlineDropdown value={lead.calidad_lead} options={CALIDAD}
                      onSelect={v => updateLead(lead.id, { calidad_lead: v })}
                    />
                  </td>
                  <td style={colStyle}>
                    <input type="text" value={lead.nicho || ''}
                      onBlur={e => updateLead(lead.id, { nicho: e.target.value || null })}
                      onChange={e => setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, nicho: e.target.value } : l))}
                      style={{ border: 'none', background: 'none', fontSize: 13, fontFamily: 'inherit', width: 100, color: '#0F172A' }}
                    />
                  </td>
                  <td style={colStyle}>
                    <input type="text" value={lead.notas || ''}
                      onBlur={e => updateLead(lead.id, { notas: e.target.value || null })}
                      onChange={e => setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, notas: e.target.value } : l))}
                      style={{ border: 'none', background: 'none', fontSize: 13, fontFamily: 'inherit', width: 160, color: '#0F172A' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedClienteId && (
        <AddLeadModal
          clienteId={selectedClienteId}
          onClose={() => setShowModal(false)}
          onAdd={lead => setLeads(prev => [lead, ...prev])}
        />
      )}
    </div>
  )
}

export default function LeadsPage() {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => { fetch('/api/auth/me').then(r => r.json()).then(setUser) }, [])
  if (!user) return null

  return (
    <ToastProvider>
      <AppLayout user={user} title="Pipeline de Leads">
        <LeadsContent />
      </AppLayout>
    </ToastProvider>
  )
}
