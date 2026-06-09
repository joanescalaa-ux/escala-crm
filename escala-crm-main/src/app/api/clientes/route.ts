import { NextRequest, NextResponse } from 'next/server'
import { initDb } from '@/lib/initDb'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET() {
  await initDb()
  const session = await getSession()
  if (!session || session.rol !== 'admin') return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const result = await query(`SELECT * FROM clientes ORDER BY nombre ASC`)
  return NextResponse.json({ clientes: result.rows })
}

export async function POST(req: NextRequest) {
  await initDb()
  const session = await getSession()
  if (!session || session.rol !== 'admin') return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const body = await req.json()
  const { nombre, apellido, email, password, tier = 'Pro', fecha_inicio, nicho, oferta, estado = 'activo' } = body

  if (!nombre || !email || !password) {
    return NextResponse.json({ error: 'Nombre, email y contraseña requeridos' }, { status: 400 })
  }

  // Create cliente record
  const clienteResult = await query(
    `INSERT INTO clientes (nombre, email, nicho, oferta, tier, fecha_inicio, estado)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [nombre, email, nicho, oferta, tier, fecha_inicio || null, estado]
  )
  const cliente = clienteResult.rows[0]

  // Create user account
  const hash = await bcrypt.hash(password, 10)
  await query(
    `INSERT INTO usuarios (nombre, apellido, email, password, rol, cliente_id)
     VALUES ($1, $2, $3, $4, 'cliente', $5)
     ON CONFLICT (email) DO UPDATE SET cliente_id = $5`,
    [nombre, apellido || '', email.toLowerCase(), hash, cliente.id]
  )

  return NextResponse.json({ cliente })
}
