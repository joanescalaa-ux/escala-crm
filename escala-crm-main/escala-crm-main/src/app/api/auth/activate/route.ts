import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { initDb } from '@/lib/initDb'
import { query } from '@/lib/db'
import { setSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  await initDb()
  const { codigo, password, confirmPassword } = await req.json()

  if (!codigo || !password) {
    return NextResponse.json({ error: 'Código y contraseña requeridos' }, { status: 400 })
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Las contraseñas no coinciden' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 })
  }

  // Find invite
  const inviteResult = await query(
    `SELECT * FROM invitaciones WHERE UPPER(codigo) = UPPER($1)`,
    [codigo.trim()]
  )

  if (inviteResult.rows.length === 0) {
    return NextResponse.json({ error: 'Código de invitación no válido' }, { status: 404 })
  }

  const invite = inviteResult.rows[0]

  if (invite.usado) {
    return NextResponse.json({ error: 'Este código ya ha sido utilizado. Contacta con Joan.' }, { status: 409 })
  }

  // Check if user already exists for this email
  const existingUser = await query(
    `SELECT id FROM usuarios WHERE LOWER(email) = $1`,
    [invite.email]
  )

  const hash = await bcrypt.hash(password, 10)
  let userId: number

  if (existingUser.rows.length > 0) {
    // User exists (created by admin), just set password
    await query(
      `UPDATE usuarios SET password = $1 WHERE LOWER(email) = $2`,
      [hash, invite.email]
    )
    userId = existingUser.rows[0].id
  } else {
    // Create user linked to client
    const newUser = await query(
      `INSERT INTO usuarios (email, password, rol, cliente_id) VALUES ($1, $2, 'cliente', $3) RETURNING id`,
      [invite.email, hash, invite.cliente_id || null]
    )
    userId = newUser.rows[0].id
  }

  // Mark invite as used
  await query(`UPDATE invitaciones SET usado = true WHERE id = $1`, [invite.id])

  // Get full user to create session
  const userResult = await query(
    `SELECT id, nombre, email, rol, cliente_id FROM usuarios WHERE id = $1`,
    [userId]
  )
  const user = userResult.rows[0]

  await setSession({
    id: user.id,
    email: user.email,
    rol: user.rol,
    clienteId: user.cliente_id,
    nombre: user.nombre || user.email,
  })

  return NextResponse.json({ success: true })
}
