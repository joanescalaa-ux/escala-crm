import { NextRequest, NextResponse } from 'next/server'
import { initDb } from '@/lib/initDb'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { calcularRacha, calcularXP, getNivel } from '@/lib/gamification'

export async function GET(req: NextRequest) {
  await initDb()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const clienteIdParam = searchParams.get('clienteId')
  const dias = searchParams.get('dias')
  const fechaInicio = searchParams.get('fechaInicio')
  const fechaFin = searchParams.get('fechaFin')

  const clienteId = session.rol === 'admin'
    ? (clienteIdParam ? parseInt(clienteIdParam) : null)
    : session.clienteId

  if (!clienteId) return NextResponse.json({ error: 'clienteId requerido' }, { status: 400 })

  let dateFilter = ''
  const params: unknown[] = [clienteId]

  if (fechaInicio && fechaFin) {
    params.push(fechaInicio, fechaFin)
    dateFilter = `AND fecha >= $2 AND fecha <= $3`
  } else if (dias && dias !== 'todo') {
    params.push(parseInt(dias))
    dateFilter = `AND fecha >= CURRENT_DATE - ($2 || ' days')::INTERVAL`
  }

  const statsResult = await query(
    `SELECT
      COALESCE(SUM(dms_enviados), 0) as dms_enviados,
      COALESCE(SUM(dms_respondidos), 0) as dms_respondidos,
      COALESCE(SUM(dolor_excavado), 0) as dolor_excavado,
      COALESCE(SUM(calls_propuestas), 0) as calls_propuestas,
      COALESCE(SUM(calls_agendadas), 0) as calls_agendadas,
      COALESCE(SUM(calls_realizadas), 0) as calls_realizadas,
      COALESCE(SUM(ventas_cerradas), 0) as ventas_cerradas,
      COALESCE(SUM(cash_cobrado), 0) as cash_cobrado,
      COALESCE(SUM(reels_publicados), 0) as reels_publicados,
      COUNT(DISTINCT fecha) as dias_reportados
     FROM reportes_diarios WHERE cliente_id = $1 ${dateFilter}`,
    params
  )

  // Timeline data
  const timelineResult = await query(
    `SELECT fecha, dms_enviados, calls_agendadas, cash_cobrado,
      CASE WHEN dms_enviados > 0 THEN ROUND(dms_respondidos::numeric / dms_enviados * 100, 1) ELSE 0 END as pct_respuesta
     FROM reportes_diarios WHERE cliente_id = $1 ${dateFilter} ORDER BY fecha ASC`,
    params
  )

  const racha = await calcularRacha(clienteId)

  // All-time XP
  const allStats = await query(
    `SELECT
      COUNT(*) as total_reportes,
      COALESCE(SUM(calls_agendadas), 0) as total_calls,
      COALESCE(SUM(ventas_cerradas), 0) as total_ventas
     FROM reportes_diarios WHERE cliente_id = $1`,
    [clienteId]
  )

  const contenidoCount = await query(
    `SELECT COUNT(*) as c FROM contenido WHERE cliente_id = $1`,
    [clienteId]
  )

  const xp = calcularXP(
    parseInt(allStats.rows[0].total_reportes),
    parseInt(allStats.rows[0].total_calls),
    parseInt(allStats.rows[0].total_ventas),
    parseInt(contenidoCount.rows[0].c)
  )

  const nivel = getNivel(xp)

  // Badges
  const logros = await query(
    `SELECT badge, earned_at FROM logros WHERE cliente_id = $1 ORDER BY earned_at ASC`,
    [clienteId]
  )

  // Last report date
  const lastReport = await query(
    `SELECT fecha FROM reportes_diarios WHERE cliente_id = $1 ORDER BY fecha DESC LIMIT 1`,
    [clienteId]
  )

  const lastFecha = lastReport.rows[0]?.fecha
  let diasSinReportar = 0
  if (lastFecha) {
    const hoy = new Date()
    const last = new Date(lastFecha)
    const diffMs = hoy.getTime() - last.getTime()
    diasSinReportar = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (racha > 0) diasSinReportar = 0
  } else {
    diasSinReportar = 999
  }

  const s = statsResult.rows[0]
  const dmsEnviados = parseInt(s.dms_enviados)
  const dmsRespondidos = parseInt(s.dms_respondidos)
  const callsAgendadas = parseInt(s.calls_agendadas)
  const callsRealizadas = parseInt(s.calls_realizadas)
  const ventasCerradas = parseInt(s.ventas_cerradas)
  const diasReportados = parseInt(s.dias_reportados)

  const pctRespuesta = dmsEnviados > 0 ? Math.min(100, Math.round(dmsRespondidos / dmsEnviados * 100)) : 0
  const pctConvDMCall = dmsEnviados > 0 ? Math.min(100, Math.round(callsAgendadas / dmsEnviados * 100)) : 0
  const pctShowRate = callsAgendadas > 0 ? Math.min(100, Math.round(callsRealizadas / callsAgendadas * 100)) : 0
  const pctCloseRate = callsRealizadas > 0 ? Math.min(100, Math.round(ventasCerradas / callsRealizadas * 100)) : 0
  const mediaDMs = diasReportados > 0 ? Math.round(dmsEnviados / diasReportados) : 0

  return NextResponse.json({
    stats: {
      dms_enviados: dmsEnviados,
      dms_respondidos: dmsRespondidos,
      pct_respuesta: pctRespuesta,
      dolor_excavado: parseInt(s.dolor_excavado),
      calls_propuestas: parseInt(s.calls_propuestas),
      calls_agendadas: callsAgendadas,
      pct_conv_dm_call: pctConvDMCall,
      calls_realizadas: callsRealizadas,
      pct_show_rate: pctShowRate,
      ventas_cerradas: ventasCerradas,
      pct_close_rate: pctCloseRate,
      cash_cobrado: parseFloat(s.cash_cobrado),
      reels_publicados: parseInt(s.reels_publicados),
      media_dms_dia: mediaDMs,
    },
    timeline: timelineResult.rows,
    racha,
    diasSinReportar,
    xp,
    nivel,
    logros: logros.rows,
  })
}
