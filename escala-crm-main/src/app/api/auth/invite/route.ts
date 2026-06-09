import { NextRequest, NextResponse } from 'next/server'
import { initDb } from '@/lib/initDb'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

async function ensureInvitesTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS invitaciones (
      id SERIAL PRIMARY KEY,
      codigo TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      cliente_id INTEGER REFERENCES clientes(id),
      usado BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)
}

// GET: list all invites (admin only)
export async function GET() {
  await initDb()
  await ensureInvitesTable()
  const session = await getSession()
  if (!session || session.rol !== 'admin') return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const result = await query(`
    SELECT i.*, c.nombre as cliente_nombre
    FROM invitaciones i
    LEFT JOIN clientes c ON i.cliente_id = c.id
    ORDER BY i.created_at DESC
  `)
  return NextResponse.json({ invitaciones: result.rows })
}

// POST: create invite code for a client email (admin only)
export async function POST(req: NextRequest) {
  await initDb()
  await ensureInvitesTable()
  const session = await getSession()
  if (!session || session.rol !== 'admin') return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const { email, cliente_id } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 })

  // Delete any previous unused invite for this email
  await query(`DELETE FROM invitaciones WHERE email = $1 AND usado = false`, [email.toLowerCase()])

  // Generate short readable code: ESCALA-XXXX
  const code = 'ESCALA-' + uuidv4().split('-')[0].toUpperCase()

  await query(
    `INSERT INTO invitaciones (codigo, email, cliente_id) VALUES ($1, $2, $3)`,
    [code, email.toLowerCase(), cliente_id || null]
  )

  return NextResponse.json({ codigo: code, email })
}
