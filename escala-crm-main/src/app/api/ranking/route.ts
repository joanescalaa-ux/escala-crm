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
  const metrica = searchParams.get('metrica') || 'cash'

  const clientes = await query(`SELECT * FROM clientes WHERE estado = 'activo' ORDER BY nombre`)

  const ranking = await Promise.all(clientes.rows.map(async (cliente: { id: number; nombre: string }) => {
    const stats = await query(
      `SELECT
        COALESCE(SUM(cash_cobrado), 0) as total_cash,
        COALESCE(SUM(calls_agendadas), 0) as total_calls,
        COALESCE(SUM(ventas_cerradas), 0) as total_ventas,
        COUNT(*) as total_reportes
       FROM reportes_diarios WHERE cliente_id = $1`,
      [cliente.id]
    )

    const s = stats.rows[0]
    const racha = await calcularRacha(cliente.id)

    const contenidoCount = await query(
      `SELECT COUNT(*) as c FROM contenido WHERE cliente_id = $1`,
      [cliente.id]
    )

    const xp = calcularXP(
      parseInt(s.total_reportes),
      parseInt(s.total_calls),
      parseInt(s.total_ventas),
      parseInt(contenidoCount.rows[0].c)
    )

    const nivel = getNivel(xp)

    return {
      clienteId: cliente.id,
      nombre: cliente.nombre,
      totalCash: parseFloat(s.total_cash),
      totalCalls: parseInt(s.total_calls),
      racha,
      xp,
      nivel,
    }
  }))

  let sorted = [...ranking]
  if (metrica === 'cash') sorted.sort((a, b) => b.totalCash - a.totalCash)
  else if (metrica === 'calls') sorted.sort((a, b) => b.totalCalls - a.totalCalls)
  else if (metrica === 'racha') sorted.sort((a, b) => b.racha - a.racha)
  else if (metrica === 'xp') sorted.sort((a, b) => b.xp - a.xp)

  return NextResponse.json({ ranking: sorted })
}
