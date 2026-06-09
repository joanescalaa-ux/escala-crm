import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { initDb } from '@/lib/initDb'

export async function GET() {
  await initDb()
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const primerNombre = session.nombre?.split(' ')[0] || session.nombre
  return NextResponse.json({
    id: session.id,
    email: session.email,
    rol: session.rol,
    clienteId: session.clienteId,
    nombre: session.nombre,
    primerNombre,
  })
}
