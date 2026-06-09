import { NextRequest, NextResponse } from 'next/server'
import { initDb } from '@/lib/initDb'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await initDb()
  const session = await getSession()
  if (!session || session.rol !== 'admin') return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const { id } = await params
  const result = await query(`SELECT * FROM clientes WHERE id = $1`, [parseInt(id)])
  if (result.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  return NextResponse.json({ cliente: result.rows[0] })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await initDb()
  const session = await getSession()
  if (!session || session.rol !== 'admin') return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const { nombre, email, nicho, oferta, tier, fecha_inicio, estado, notas } = body

  await query(
    `UPDATE clientes SET nombre=$1, email=$2, nicho=$3, oferta=$4, tier=$5, fecha_inicio=$6, estado=$7, notas=$8
     WHERE id=$9`,
    [nombre, email, nicho, oferta, tier, fecha_inicio || null, estado, notas, parseInt(id)]
  )

  return NextResponse.json({ success: true })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await initDb()
  const session = await getSession()
  if (!session || session.rol !== 'admin') return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const { id } = await params
  await query(`DELETE FROM clientes WHERE id = $1`, [parseInt(id)])
  return NextResponse.json({ success: true })
}
