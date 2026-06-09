import { NextRequest, NextResponse } from 'next/server'
import { initDb } from '@/lib/initDb'
import { query } from '@/lib/db'
import { checkAndAwardBadges, calcularRacha } from '@/lib/gamification'

async function validateApiKey(req: NextRequest): Promise<boolean> {
  const key = req.headers.get('x-api-key')
  if (!key) return false
  const result = await query(`SELECT id FROM api_keys WHERE key = $1`, [key])
  return result.rows.length > 0
}

export async function POST(req: NextRequest) {
  await initDb()
  if (!await validateApiKey(req)) {
    return NextResponse.json({ error: 'API key inválida' }, { status: 401 })
  }

  const body = await req.json()
  const {
    clienteId, fecha,
    dmsEnviados = 0, dmsRespondidos = 0, dolorExcavado = 0,
    callsPropuestas = 0, callsAgendadas = 0, callsRealizadas = 0,
    ventasCerradas = 0, cashCobrado = 0, reelsPublicados = 0,
    storiesPublicadas = 0, leadsRevividos = 0, notasDelDia = '',
  } = body

  if (!clienteId || !fecha) {
    return NextResponse.json({ error: 'clienteId y fecha requeridos' }, { status: 400 })
  }

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
    [clienteId, fecha, dmsEnviados, dmsRespondidos, dolorExcavado, callsPropuestas,
     callsAgendadas, callsRealizadas, ventasCerradas, cashCobrado, reelsPublicados,
     storiesPublicadas, leadsRevividos, notasDelDia]
  )

  const racha = await calcularRacha(clienteId)
  const newBadges = await checkAndAwardBadges(clienteId)

  return NextResponse.json({ success: true, racha, newBadges })
}
