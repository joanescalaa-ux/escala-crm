import { NextRequest, NextResponse } from 'next/server'
import { initDb } from '@/lib/initDb'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'

// Ensure onboarding table exists
async function ensureOnboardingTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS onboarding (
      id SERIAL PRIMARY KEY,
      cliente_id INTEGER REFERENCES clientes(id) UNIQUE,
      paso_actual INTEGER DEFAULT 1,
      completado BOOLEAN DEFAULT FALSE,
      -- Paso 1: Datos personales
      nombre_completo TEXT,
      instagram_handle TEXT,
      nicho TEXT,
      -- Paso 2: Situación actual
      facturacion_actual TEXT,
      meses_activo TEXT,
      mayor_problema TEXT,
      intentos_previos TEXT,
      -- Paso 3: Objetivo y compromiso
      objetivo_90_dias TEXT,
      horas_disponibles TEXT,
      motivacion TEXT,
      compromiso_confirmado BOOLEAN DEFAULT FALSE,
      -- Paso 4: Setup técnico
      tiene_instagram BOOLEAN DEFAULT FALSE,
      tiene_manychat BOOLEAN DEFAULT FALSE,
      tiene_ghl BOOLEAN DEFAULT FALSE,
      link_notion TEXT,
      -- Paso 5: Completado
      fecha_completado TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `)
}

export async function GET() {
  await initDb()
  await ensureOnboardingTable()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const clienteId = session.clienteId
  if (!clienteId) return NextResponse.json({ error: 'No tienes cliente asociado' }, { status: 400 })

  const result = await query(`SELECT * FROM onboarding WHERE cliente_id = $1`, [clienteId])
  
  if (result.rows.length === 0) {
    // Create initial record
    const newRecord = await query(
      `INSERT INTO onboarding (cliente_id, paso_actual) VALUES ($1, 1) RETURNING *`,
      [clienteId]
    )
    return NextResponse.json({ onboarding: newRecord.rows[0] })
  }

  return NextResponse.json({ onboarding: result.rows[0] })
}

export async function POST(req: NextRequest) {
  await initDb()
  await ensureOnboardingTable()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const clienteId = session.clienteId
  if (!clienteId) return NextResponse.json({ error: 'No tienes cliente asociado' }, { status: 400 })

  const body = await req.json()
  const { paso, datos } = body

  // Build dynamic update query
  const fields: string[] = ['paso_actual = $2', 'updated_at = NOW()']
  const values: unknown[] = [clienteId, paso]
  let idx = 3

  const allowedFields: Record<number, string[]> = {
    1: ['nombre_completo', 'instagram_handle', 'nicho'],
    2: ['facturacion_actual', 'meses_activo', 'mayor_problema', 'intentos_previos'],
    3: ['objetivo_90_dias', 'horas_disponibles', 'motivacion', 'compromiso_confirmado'],
    4: ['tiene_instagram', 'tiene_manychat', 'tiene_ghl', 'link_notion'],
    5: ['fecha_completado', 'completado'],
  }

  const allowed = allowedFields[paso] || []
  for (const field of allowed) {
    if (datos[field] !== undefined) {
      fields.push(`${field} = $${idx}`)
      values.push(datos[field])
      idx++
    }
  }

  if (paso === 5) {
    fields.push(`completado = true`)
    fields.push(`fecha_completado = NOW()`)
  }

  await query(
    `INSERT INTO onboarding (cliente_id, paso_actual) VALUES ($1, $2)
     ON CONFLICT (cliente_id) DO UPDATE SET ${fields.join(', ')}`,
    values
  )

  const updated = await query(`SELECT * FROM onboarding WHERE cliente_id = $1`, [clienteId])
  return NextResponse.json({ onboarding: updated.rows[0] })
}
