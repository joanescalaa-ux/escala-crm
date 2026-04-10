import { NextRequest, NextResponse } from 'next/server'
import { initDb } from '@/lib/initDb'
import { query } from '@/lib/db'

async function validateApiKey(req: NextRequest): Promise<boolean> {
  const key = req.headers.get('x-api-key')
  if (!key) return false
  const result = await query(`SELECT id FROM api_keys WHERE key = $1`, [key])
  return result.rows.length > 0
}

export async function POST(req: NextRequest) {
  await initDb()
  if (!await validateApiKey(req)) {
    return NextResponse.json({ error: 'API key inválida' }, { status: 401 })
  }

  const body = await req.json()
  const {
    clienteId, igHandle, etapa = 'Sin Contactar', estadoConversacion = null,
    fuenteLead = null, calidadLead = null, nicho = null, notas = null,
  } = body

  if (!clienteId || !igHandle) {
    return NextResponse.json({ error: 'clienteId e igHandle requeridos' }, { status: 400 })
  }

  const result = await query(
    `INSERT INTO leads (cliente_id, ig_handle, etapa, estado_conversacion, fuente_lead, calidad_lead, nicho, notas)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [clienteId, igHandle, etapa, estadoConversacion, fuenteLead, calidadLead, nicho, notas]
  )

  return NextResponse.json({ lead: result.rows[0] })
}
