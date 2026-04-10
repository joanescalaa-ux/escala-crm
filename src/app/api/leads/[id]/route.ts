import { NextRequest, NextResponse } from 'next/server'
import { initDb } from '@/lib/initDb'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await initDb()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const allowed = [
    'ig_handle', 'etapa', 'estado_conversacion', 'ultimo_contacto', 'fecha_call',
    'asistencia', 'resultado_call', 'cash_cobrado', 'fuente_lead', 'calidad_lead', 'nicho', 'notas'
  ]

  const updates: string[] = []
  const values: unknown[] = []
  let i = 1

  for (const key of allowed) {
    if (key in body) {
      updates.push(`${key} = $${i}`)
      values.push(body[key])
      i++
    }
  }

  if (updates.length === 0) return NextResponse.json({ error: 'Sin cambios' }, { status: 400 })

  values.push(parseInt(id))
  await query(`UPDATE leads SET ${updates.join(', ')} WHERE id = $${i}`, values)

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
  await query(`DELETE FROM leads WHERE id = $1`, [parseInt(id)])
  return NextResponse.json({ success: true })
}
