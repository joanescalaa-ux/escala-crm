import { query } from './db'

export const BADGES = {
  PRIMER_PASO: { key: 'Primer Paso', desc: 'Primer reporte enviado' },
  EN_RACHA: { key: 'En Racha', desc: '7 días consecutivos de reportes' },
  IMPARABLE: { key: 'Imparable', desc: '30 días consecutivos de reportes' },
  MAQUINA_CASH: { key: 'Máquina de Cash', desc: '€10.000 en cash cobrado total' },
  REY_SETTING: { key: 'Rey del Setting', desc: '100 calls agendadas totales' },
  CLOSER: { key: 'Closer', desc: '10 ventas cerradas totales' },
}

export function getNivel(xp: number): { nombre: string; color: string; min: number; max: number } {
  if (xp >= 1000) return { nombre: 'Diamante', color: '#06B6D4', min: 1000, max: 9999 }
  if (xp >= 500) return { nombre: 'Platino', color: '#8B5CF6', min: 500, max: 999 }
  if (xp >= 250) return { nombre: 'Oro', color: '#EAB308', min: 250, max: 499 }
  if (xp >= 100) return { nombre: 'Plata', color: '#9CA3AF', min: 100, max: 249 }
  return { nombre: 'Bronce', color: '#CD7F32', min: 0, max: 99 }
}

export function calcularXP(reportes: number, callsAgendadas: number, ventasCerradas: number, contenidos: number): number {
  return reportes * 10 + callsAgendadas * 5 + ventasCerradas * 20 + contenidos * 3
}

export async function calcularRacha(clienteId: number): Promise<number> {
  const result = await query(
    `SELECT fecha FROM reportes_diarios WHERE cliente_id = $1 ORDER BY fecha DESC`,
    [clienteId]
  )
  if (result.rows.length === 0) return 0

  const fechas = result.rows.map((r: { fecha: Date | string }) => {
    const d = new Date(r.fecha)
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  })

  let racha = 0
  const hoy = new Date()
  const hoyNorm = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())

  for (let i = 0; i < fechas.length; i++) {
    const expected = new Date(hoyNorm)
    expected.setDate(hoyNorm.getDate() - i)
    if (fechas[i].getTime() === expected.getTime()) {
      racha++
    } else {
      break
    }
  }
  return racha
}

export async function checkAndAwardBadges(clienteId: number): Promise<string[]> {
  const newBadges: string[] = []

  // Check existing badges
  const existing = await query(`SELECT badge FROM logros WHERE cliente_id = $1`, [clienteId])
  const earnedBadges = new Set(existing.rows.map((r: { badge: string }) => r.badge))

  // Primer Paso
  if (!earnedBadges.has(BADGES.PRIMER_PASO.key)) {
    const rep = await query(`SELECT COUNT(*) as c FROM reportes_diarios WHERE cliente_id = $1`, [clienteId])
    if (parseInt(rep.rows[0].c) >= 1) {
      await query(`INSERT INTO logros (cliente_id, badge) VALUES ($1, $2)`, [clienteId, BADGES.PRIMER_PASO.key])
      newBadges.push(BADGES.PRIMER_PASO.key)
    }
  }

  // En Racha - 7 days
  if (!earnedBadges.has(BADGES.EN_RACHA.key)) {
    const racha = await calcularRacha(clienteId)
    if (racha >= 7) {
      await query(`INSERT INTO logros (cliente_id, badge) VALUES ($1, $2)`, [clienteId, BADGES.EN_RACHA.key])
      newBadges.push(BADGES.EN_RACHA.key)
    }
  }

  // Imparable - 30 days
  if (!earnedBadges.has(BADGES.IMPARABLE.key)) {
    const racha = await calcularRacha(clienteId)
    if (racha >= 30) {
      await query(`INSERT INTO logros (cliente_id, badge) VALUES ($1, $2)`, [clienteId, BADGES.IMPARABLE.key])
      newBadges.push(BADGES.IMPARABLE.key)
    }
  }

  // Máquina de Cash - €10,000
  if (!earnedBadges.has(BADGES.MAQUINA_CASH.key)) {
    const cash = await query(`SELECT SUM(cash_cobrado) as total FROM reportes_diarios WHERE cliente_id = $1`, [clienteId])
    if (parseFloat(cash.rows[0].total || 0) >= 10000) {
      await query(`INSERT INTO logros (cliente_id, badge) VALUES ($1, $2)`, [clienteId, BADGES.MAQUINA_CASH.key])
      newBadges.push(BADGES.MAQUINA_CASH.key)
    }
  }

  // Rey del Setting - 100 calls agendadas
  if (!earnedBadges.has(BADGES.REY_SETTING.key)) {
    const calls = await query(`SELECT SUM(calls_agendadas) as total FROM reportes_diarios WHERE cliente_id = $1`, [clienteId])
    if (parseInt(calls.rows[0].total || 0) >= 100) {
      await query(`INSERT INTO logros (cliente_id, badge) VALUES ($1, $2)`, [clienteId, BADGES.REY_SETTING.key])
      newBadges.push(BADGES.REY_SETTING.key)
    }
  }

  // Closer - 10 ventas cerradas
  if (!earnedBadges.has(BADGES.CLOSER.key)) {
    const ventas = await query(`SELECT SUM(ventas_cerradas) as total FROM reportes_diarios WHERE cliente_id = $1`, [clienteId])
    if (parseInt(ventas.rows[0].total || 0) >= 10) {
      await query(`INSERT INTO logros (cliente_id, badge) VALUES ($1, $2)`, [clienteId, BADGES.CLOSER.key])
      newBadges.push(BADGES.CLOSER.key)
    }
  }

  return newBadges
}

export function getStreakEmoji(dias: number): string {
  if (dias >= 30) return '👑'
  if (dias >= 14) return '🏆'
  if (dias >= 7) return '💎'
  if (dias >= 3) return '⚡'
  return '🔥'
}

export function getPenalizacion(diasSinReportar: number): string {
  if (diasSinReportar >= 5) return '💀 INACTIVO'
  if (diasSinReportar === 4) return '(Fantasma)'
  if (diasSinReportar === 3) return '(Frío)'
  if (diasSinReportar === 2) return '(Flojo)'
  return ''
}
