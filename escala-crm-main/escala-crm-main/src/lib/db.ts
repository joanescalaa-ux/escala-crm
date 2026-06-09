import { Pool } from 'pg'

const g = global as typeof global & { _pool?: Pool }

if (!g._pool) {
  const connectionString = process.env.DATABASE_URL

  // Force SSL for any remote URL (Supabase, Render, Railway, etc.)
  const isRemote = connectionString?.includes('@') && !connectionString?.includes('localhost') && !connectionString?.includes('127.0.0.1')

  g._pool = new Pool({
    connectionString,
    ssl: isRemote ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  })

  g._pool.on('error', (err) => {
    console.error('Pool error:', err)
  })
}

export const pool = g._pool

export async function query(text: string, params?: unknown[]) {
  const client = await pool.connect()
  try {
    return await client.query(text, params)
  } finally {
    client.release()
  }
}
