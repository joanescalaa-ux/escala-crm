import { NextRequest, NextResponse } from 'next/server'
import { initDb } from '@/lib/initDb'
import { query } from '@/lib/db'

async function validateApiKey(req: NextRequest): Promise<boolean> {
  const key = req.headers.get('x-api-key')
  if (!key) return false
  const result = await query(`SELECT id FROM api_keys WHERE key = $1`, [key])
  return result.rows.length > 0
}

export async function GET(req: NextRequest) {
  await initDb()
  if (!await validateApiKey(req)) {
    return NextResponse.json({ error: 'API key inválida' }, { status: 401 })
  }

  const result = await query(`SELECT * FROM clientes ORDER BY nombre`)
  return NextResponse.json({ clientes: result.rows })
}
