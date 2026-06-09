import { NextRequest, NextResponse } from 'next/server'
import { initDb } from '@/lib/initDb'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { calcularRacha, calcularXP, getNivel } from '@/lib/gamification'

export async function GET(req: NextRequest) {
  await initDb()
  const session = await getSession()
  if (!session || session.rol !== 'admin') return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const dias = searchParams.get('dias')
  const fechaInicio = searchParams.get('fechaInicio')
  const fechaFin = searchParams.get('fechaFin')

  let dateFilter = ''
  const baseParams: unknown[] = []

  if (fechaInicio && fechaFin) {
    dateFilter = `AND fecha >= '${fechaInicio}' AND fecha <= '${fechaFin}'`
  } else if (dias && dias !== 'todo') {
    dateFilter = `AND fecha >= CURRENT_DATE - INTERVAL '${parseInt(dias)} days'`
  }

  const clientes = await query(`SELECT * FROM clientes ORDER BY nombre`)

  const data = await Promise.all(clientes.rows.map(async (cliente: { id: number; nombre: string; email: string; tier: string; estado: string }) => {
    const stats = await query(
      `SELECT
        COALESCE(SUM(dms_enviados), 0) as dms_enviados,
        COALESCE(SUM(calls_propuestas), 0) as calls_propuestas,
        COALESCE(SUM(calls_agendadas), 0) as calls_agendadas,
        COALESCE(SUM(calls_realizadas), 0) as calls_realizadas,
        COALESCE(SUM(ventas_cerradas), 0) as ventas_cerradas,
        COALESCE(SUM(cash_cobrado), 0) as cash_cobrado,
        COALESCE(SUM(dms_respondidos), 0) as dms_respondidos,
        COUNT(*) as total_reportes
       FROM reportes_diarios WHERE cliente_id = $1 ${dateFilter}`,
      [cliente.id]
    )

    const weekStats = await query(
      `SELECT COALESCE(SUM(cash_cobrado), 0) as cash_semana
       FROM reportes_diarios WHERE cliente_id = $1 AND fecha >= CURRENT_DATE - INTERVAL '7 days'`,
      [cliente.id]
    )

    const racha = await calcularRacha(cliente.id)

    const lastReport = await query(
      `SELECT fecha FROM reportes_diarios WHERE cliente_id = $1 ORDER BY fecha DESC LIMIT 1`,
      [cliente.id]
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

    const s = stats.rows[0]
    const dmsEnviados = parseInt(s.dms_enviados)
    const dmsRespondidos = parseInt(s.dms_respondidos)
    const callsAgendadas = parseInt(s.calls_agendadas)
    const callsRealizadas = parseInt(s.calls_realizadas)

    const pctRespuesta = dmsEnviados > 0 ? Math.min(100, Math.round(dmsRespondidos / dmsEnviados * 100)) : 0
    const pctShowRate = callsAgendadas > 0 ? Math.min(100, Math.round(callsRealizadas / callsAgendadas * 100)) : 0

    const contenidoCount = await query(
      `SELECT COUNT(*) as c FROM contenido WHERE cliente_id = $1`,
      [cliente.id]
    )

    const xp = calcularXP(
      parseInt(s.total_reportes),
      callsAgendadas,
      parseInt(s.ventas_cerradas),
      parseInt(contenidoCount.rows[0].c)
    )
    const nivel = getNivel(xp)

    return {
      id: cliente.id,
      nombre: cliente.nombre,
      email: cliente.email,
      tier: cliente.tier,
      estado: cliente.estado,
      racha,
      diasSinReportar,
      dms_enviados: dmsEnviados,
      calls_propuestas: parseInt(s.calls_propuestas),
      calls_agendadas: callsAgendadas,
      calls_realizadas: callsRealizadas,
      ventas_cerradas: parseInt(s.ventas_cerradas),
      cash_cobrado: parseFloat(s.cash_cobrado),
      cash_semana: parseFloat(weekStats.rows[0].cash_semana),
      pct_respuesta: pctRespuesta,
      pct_show_rate: pctShowRate,
      xp,
      nivel,
    }
  }))

  // Best client this week
  const mejorCliente = [...data].sort((a, b) => b.cash_semana - a.cash_semana)[0] || null

  return NextResponse.json({ clientes: data, mejorCliente })
}
