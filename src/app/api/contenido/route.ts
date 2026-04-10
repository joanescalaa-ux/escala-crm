import { NextRequest, NextResponse } from 'next/server'
import { initDb } from '@/lib/initDb'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  await initDb()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const clienteIdParam = searchParams.get('clienteId')
  const clienteId = session.rol === 'admin' ? (clienteIdParam ? parseInt(clienteIdParam) : null) : session.clienteId

  if (!clienteId) return NextResponse.json({ contenido: [] })

  const result = await query(
    `SELECT * FROM contenido WHERE cliente_id = $1 ORDER BY fecha_publicacion DESC, created_at DESC`,
    [clienteId]
  )

  return NextResponse.json({ contenido: result.rows })
}

export async function POST(req: NextRequest) {
  await initDb()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const {
    clienteId: bodyClienteId,
    fecha_publicacion,
    plataforma,
    tipo_contenido,
    gancho = null,
    notas_caption = null,
    etiqueta_fuente = null,
    seguidores_icp = 0,
    comentarios = 0,
    guardados = 0,
    dms_recibidos = 0,
    visualizaciones = 0,
  } = body

  const clienteId = session.rol === 'admin' ? bodyClienteId : session.clienteId
  if (!clienteId) return NextResponse.json({ error: 'clienteId requerido' }, { status: 400 })

  const result = await query(
    `INSERT INTO contenido (cliente_id, fecha_publicacion, plataforma, tipo_contenido, gancho,
      notas_caption, etiqueta_fuente, seguidores_icp, comentarios, guardados, dms_recibidos, visualizaciones)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [clienteId, fecha_publicacion, plataforma, tipo_contenido, gancho,
     notas_caption, etiqueta_fuente, seguidores_icp, comentarios, guardados, dms_recibidos, visualizaciones]
  )

  return NextResponse.json({ contenido: result.rows[0] })
}
