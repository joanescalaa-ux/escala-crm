import { NextRequest, NextResponse } from 'next/server'
import { initDb } from '@/lib/initDb'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await initDb()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const {
    fecha_publicacion, plataforma, tipo_contenido, gancho, notas_caption,
    etiqueta_fuente, seguidores_icp = 0, comentarios = 0, guardados = 0,
    dms_recibidos = 0, visualizaciones = 0,
  } = body

  await query(
    `UPDATE contenido SET fecha_publicacion=$1, plataforma=$2, tipo_contenido=$3, gancho=$4,
      notas_caption=$5, etiqueta_fuente=$6, seguidores_icp=$7, comentarios=$8, guardados=$9,
      dms_recibidos=$10, visualizaciones=$11 WHERE id=$12`,
    [fecha_publicacion, plataforma, tipo_contenido, gancho, notas_caption,
     etiqueta_fuente, seguidores_icp, comentarios, guardados, dms_recibidos, visualizaciones, parseInt(id)]
  )

  return NextResponse.json({ success: true })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await initDb()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  await query(`DELETE FROM contenido WHERE id = $1`, [parseInt(id)])
  return NextResponse.json({ success: true })
}
