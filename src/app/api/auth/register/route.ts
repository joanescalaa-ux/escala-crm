import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { initDb } from '@/lib/initDb'
import { query } from '@/lib/db'

export async function POST(req: NextRequest) {
  await initDb()
  const { nombre, apellido, email, password, clienteId } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
  }

  const existing = await query(`SELECT id FROM usuarios WHERE email = $1`, [email.toLowerCase()])
  if (existing.rows.length > 0) {
    return NextResponse.json({ error: 'Email ya registrado' }, { status: 409 })
  }

  const hash = await bcrypt.hash(password, 10)
  const result = await query(
    `INSERT INTO usuarios (nombre, apellido, email, password, rol, cliente_id) VALUES ($1, $2, $3, $4, 'cliente', $5) RETURNING id, nombre, email, rol, cliente_id`,
    [nombre, apellido, email.toLowerCase(), hash, clienteId || null]
  )

  const user = result.rows[0]

  // Trigger webhook if configured
  try {
    const webhookResult = await query(`SELECT value FROM configuracion WHERE key = 'webhook_ghl'`)
    const webhookUrl = webhookResult.rows[0]?.value
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email }),
      })
    }
  } catch {
    // Webhook failure is non-critical
  }

  return NextResponse.json({ success: true, userId: user.id })
}
