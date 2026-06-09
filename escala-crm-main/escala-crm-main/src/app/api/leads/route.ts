import { NextRequest, NextResponse } from 'next/server'
import { initDb } from '@/lib/initDb'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  await initDb()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const clienteIdParam = searchParams.get('clienteId')
  const clienteId = session.rol === 'admin' ? (clienteIdParam ? parseInt(clienteIdParam) : null) : session.clienteId

  if (!clienteId) return NextResponse.json({ leads: [] })

  const result = await query(
    `SELECT * FROM leads WHERE cliente_id = $1 ORDER BY created_at DESC`,
    [clienteId]
  )

  return NextResponse.json({ leads: result.rows })
}

export async function POST(req: NextRequest) {
  await initDb()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const {
    clienteId: bodyClienteId,
    ig_handle,
    etapa = 'Sin Contactar',
    estado_conversacion = null,
    ultimo_contacto = null,
    fecha_call = null,
    asistencia = null,
    resultado_call = null,
    cash_cobrado = 0,
    fuente_lead = null,
    calidad_lead = null,
    nicho = null,
    notas = null,
  } = body

  const clienteId = session.rol === 'admin' ? bodyClienteId : session.clienteId
  if (!clienteId || !ig_handle) return NextResponse.json({ error: 'Datos requeridos' }, { status: 400 })

  const result = await query(
    `INSERT INTO leads (cliente_id, ig_handle, etapa, estado_conversacion, ultimo_contacto, fecha_call,
      asistencia, resultado_call, cash_cobrado, fuente_lead, calidad_lead, nicho, notas)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
    [clienteId, ig_handle, etapa, estado_conversacion, ultimo_contacto, fecha_call,
     asistencia, resultado_call, cash_cobrado, fuente_lead, calidad_lead, nicho, notas]
  )

  return NextResponse.json({ lead: result.rows[0] })
}
