import { NextRequest, NextResponse } from 'next/server'
import { initDb } from '@/lib/initDb'
import { query } from '@/lib/db'
import { getSession, setSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  await initDb()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const result = await query(
    `SELECT id, nombre, apellido, email, rol, cliente_id, fecha_nacimiento, nicho, oferta,
      fecha_inicio_programa, foto_perfil, created_at FROM usuarios WHERE id = $1`,
    [session.id]
  )

  if (result.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  // API key (admin only)
  let apiKey = null
  let webhookGhl = null
  if (session.rol === 'admin') {
    const keyResult = await query(`SELECT key FROM api_keys ORDER BY id LIMIT 1`)
    apiKey = keyResult.rows[0]?.key

    const webhookResult = await query(`SELECT value FROM configuracion WHERE key = 'webhook_ghl'`)
    webhookGhl = webhookResult.rows[0]?.value
  }

  return NextResponse.json({ user: result.rows[0], apiKey, webhookGhl })
}

export async function PUT(req: NextRequest) {
  await initDb()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const { nombre, apellido, email, fecha_nacimiento, nicho, oferta, fecha_inicio_programa, foto_perfil } = body

  await query(
    `UPDATE usuarios SET nombre=$1, apellido=$2, email=$3, fecha_nacimiento=$4, nicho=$5, oferta=$6,
      fecha_inicio_programa=$7, foto_perfil=$8 WHERE id=$9`,
    [nombre, apellido, email, fecha_nacimiento || null, nicho, oferta, fecha_inicio_programa || null, foto_perfil, session.id]
  )

  // Refresh session
  await setSession({
    id: session.id,
    email: email || session.email,
    rol: session.rol,
    clienteId: session.clienteId,
    nombre: nombre || session.nombre,
  })

  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  await initDb()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const { action, currentPassword, newPassword, webhookGhl } = body

  if (action === 'change_password') {
    const user = await query(`SELECT password FROM usuarios WHERE id = $1`, [session.id])
    const valid = await bcrypt.compare(currentPassword, user.rows[0].password)
    if (!valid) return NextResponse.json({ error: 'Contraseña actual incorrecta' }, { status: 400 })

    const hash = await bcrypt.hash(newPassword, 10)
    await query(`UPDATE usuarios SET password=$1 WHERE id=$2`, [hash, session.id])
    return NextResponse.json({ success: true })
  }

  if (action === 'regenerate_api_key' && session.rol === 'admin') {
    const newKey = uuidv4()
    await query(`DELETE FROM api_keys`)
    await query(`INSERT INTO api_keys (key) VALUES ($1)`, [newKey])
    return NextResponse.json({ apiKey: newKey })
  }

  if (action === 'save_webhook' && session.rol === 'admin') {
    await query(
      `INSERT INTO configuracion (key, value) VALUES ('webhook_ghl', $1)
       ON CONFLICT (key) DO UPDATE SET value = $1`,
      [webhookGhl]
    )
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Acción desconocida' }, { status: 400 })
}
