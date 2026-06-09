import { NextRequest, NextResponse } from 'next/server'
import { initDb } from '@/lib/initDb'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'

async function ensureFasesTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS fases_desbloqueadas (
      id SERIAL PRIMARY KEY,
      cliente_id INTEGER REFERENCES clientes(id),
      fase INTEGER NOT NULL,
      desbloqueada_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(cliente_id, fase)
    )
  `)
}

// GET - returns unlocked phases for a client
export async function GET(req: NextRequest) {
  await initDb()
  await ensureFasesTable()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const clienteId = searchParams.get('clienteId') || session.clienteId

  if (!clienteId) return NextResponse.json({ desbloqueadas: [1] })

  const result = await query(
    `SELECT fase FROM fases_desbloqueadas WHERE cliente_id = $1 ORDER BY fase ASC`,
    [clienteId]
  )

  const fases = result.rows.map(r => r.fase)
  // Always include fase 1
  if (!fases.includes(1)) fases.unshift(1)

  return NextResponse.json({ desbloqueadas: fases })
}

// POST - admin unlocks/locks a phase for a client
export async function POST(req: NextRequest) {
  await initDb()
  await ensureFasesTable()
  const session = await getSession()
  if (!session || session.rol !== 'admin') return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const { cliente_id, fase, desbloquear } = await req.json()

  if (desbloquear) {
    await query(
      `INSERT INTO fases_desbloqueadas (cliente_id, fase) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [cliente_id, fase]
    )
  } else {
    if (fase === 1) return NextResponse.json({ error: 'No puedes bloquear la fase 1' }, { status: 400 })
    await query(
      `DELETE FROM fases_desbloqueadas WHERE cliente_id = $1 AND fase = $2`,
      [cliente_id, fase]
    )
  }

  const result = await query(
    `SELECT fase FROM fases_desbloqueadas WHERE cliente_id = $1 ORDER BY fase ASC`,
    [cliente_id]
  )
  const fases = result.rows.map(r => r.fase)
  if (!fases.includes(1)) fases.unshift(1)

  return NextResponse.json({ desbloqueadas: fases })
}
