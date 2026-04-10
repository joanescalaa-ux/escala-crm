import { NextRequest, NextResponse } from 'next/server'
import { initDb } from '@/lib/initDb'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { checkAndAwardBadges, calcularRacha } from '@/lib/gamification'

export async function GET(req: NextRequest) {
  await initDb()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const clienteIdParam = searchParams.get('clienteId')
  const dias = searchParams.get('dias')
  const fechaInicio = searchParams.get('fechaInicio')
  const fechaFin = searchParams.get('fechaFin')

  const clienteId = session.rol === 'admin' ? (clienteIdParam ? parseInt(clienteIdParam) : null) : session.clienteId

  if (!clienteId) return NextResponse.json({ reportes: [] })

  let dateFilter = ''
  const params: unknown[] = [clienteId]

  if (fechaInicio && fechaFin) {
    params.push(fechaInicio, fechaFin)
    dateFilter = `AND fecha >= $2 AND fecha <= $3`
  } else if (dias && dias !== 'todo') {
    params.push(parseInt(dias))
    dateFilter = `AND fecha >= CURRENT_DATE - ($2 || ' days')::INTERVAL`
  }

  const result = await query(
    `SELECT * FROM reportes_diarios WHERE cliente_id = $1 ${dateFilter} ORDER BY fecha DESC`,
    params
  )

  return NextResponse.json({ reportes: result.rows })
}

export async function POST(req: NextRequest) {
  await initDb()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const {
    clienteId: bodyClienteId,
    fecha,
    dms_enviados = 0,
    dms_respondidos = 0,
    dolor_excavado = 0,
    calls_propuestas = 0,
    calls_agendadas = 0,
    calls_realizadas = 0,
    ventas_cerradas = 0,
    cash_cobrado = 0,
    reels_publicados = 0,
    stories_publicadas = 0,
    leads_revividos = 0,
    notas_del_dia = '',
  } = body

  const clienteId = session.rol === 'admin' ? bodyClienteId : session.clienteId
  if (!clienteId) return NextResponse.json({ error: 'clienteId requerido' }, { status: 400 })

  await query(
    `INSERT INTO reportes_diarios
      (cliente_id, fecha, dms_enviados, dms_respondidos, dolor_excavado, calls_propuestas,
       calls_agendadas, calls_realizadas, ventas_cerradas, cash_cobrado, reels_publicados,
       stories_publicadas, leads_revividos, notas_del_dia)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     ON CONFLICT (cliente_id, fecha) DO UPDATE SET
       dms_enviados=$3, dms_respondidos=$4, dolor_excavado=$5, calls_propuestas=$6,
       calls_agendadas=$7, calls_realizadas=$8, ventas_cerradas=$9, cash_cobrado=$10,
       reels_publicados=$11, stories_publicadas=$12, leads_revividos=$13, notas_del_dia=$14`,
    [clienteId, fecha, dms_enviados, dms_respondidos, dolor_excavado, calls_propuestas,
     calls_agendadas, calls_realizadas, ventas_cerradas, cash_cobrado, reels_publicados,
     stories_publicadas, leads_revividos, notas_del_dia]
  )

  const racha = await calcularRacha(clienteId)
  const newBadges = await checkAndAwardBadges(clienteId)

  return NextResponse.json({ success: true, racha, newBadges })
}
