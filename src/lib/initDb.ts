import { query } from './db'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

// Use globalThis so the promise persists within a single serverless instance.
// If the promise rejects (connection error), it resets so the next request retries.
const g = global as typeof global & { _dbInitPromise?: Promise<void> }

export async function initDb(): Promise<void> {
  if (!g._dbInitPromise) {
    g._dbInitPromise = _doInit().catch((err) => {
      // Reset so next request retries
      g._dbInitPromise = undefined
      throw err
    })
  }
  return g._dbInitPromise
}

async function _doInit(): Promise<void> {
  console.log('🔄 Inicializando base de datos...')

  await query(`
    CREATE TABLE IF NOT EXISTS clientes (
      id SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      email TEXT,
      nicho TEXT,
      oferta TEXT,
      tier TEXT DEFAULT 'Pro',
      fecha_inicio DATE,
      estado TEXT DEFAULT 'activo',
      notas TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nombre TEXT,
      apellido TEXT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      rol TEXT DEFAULT 'cliente',
      cliente_id INTEGER REFERENCES clientes(id),
      fecha_nacimiento DATE,
      nicho TEXT,
      oferta TEXT,
      fecha_inicio_programa DATE,
      foto_perfil TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS reportes_diarios (
      id SERIAL PRIMARY KEY,
      cliente_id INTEGER REFERENCES clientes(id),
      fecha DATE NOT NULL,
      dms_enviados INTEGER DEFAULT 0,
      dms_respondidos INTEGER DEFAULT 0,
      dolor_excavado INTEGER DEFAULT 0,
      calls_propuestas INTEGER DEFAULT 0,
      calls_agendadas INTEGER DEFAULT 0,
      calls_realizadas INTEGER DEFAULT 0,
      ventas_cerradas INTEGER DEFAULT 0,
      cash_cobrado NUMERIC DEFAULT 0,
      reels_publicados INTEGER DEFAULT 0,
      stories_publicadas INTEGER DEFAULT 0,
      leads_revividos INTEGER DEFAULT 0,
      notas_del_dia TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(cliente_id, fecha)
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      cliente_id INTEGER REFERENCES clientes(id),
      ig_handle TEXT NOT NULL,
      etapa TEXT DEFAULT 'Sin Contactar',
      estado_conversacion TEXT,
      ultimo_contacto DATE,
      fecha_call DATE,
      asistencia TEXT,
      resultado_call TEXT,
      cash_cobrado NUMERIC DEFAULT 0,
      fuente_lead TEXT,
      calidad_lead TEXT,
      nicho TEXT,
      notas TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS contenido (
      id SERIAL PRIMARY KEY,
      cliente_id INTEGER REFERENCES clientes(id),
      fecha_publicacion DATE,
      plataforma TEXT,
      tipo_contenido TEXT,
      gancho TEXT,
      notas_caption TEXT,
      etiqueta_fuente TEXT,
      seguidores_icp INTEGER DEFAULT 0,
      comentarios INTEGER DEFAULT 0,
      guardados INTEGER DEFAULT 0,
      dms_recibidos INTEGER DEFAULT 0,
      visualizaciones INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id SERIAL PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS logros (
      id SERIAL PRIMARY KEY,
      cliente_id INTEGER REFERENCES clientes(id),
      badge TEXT NOT NULL,
      earned_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS configuracion (
      id SERIAL PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      value TEXT
    )
  `)

  // Seed admin user — always ensure hash is correct
  const hash = await bcrypt.hash('escala2026', 10)
  console.log('🔑 Hash generado para escala2026 (primeros 20):', hash.substring(0, 20))

  const adminCheck = await query(`SELECT id, password FROM usuarios WHERE LOWER(email) = 'joan@escala.io'`)
  if (adminCheck.rows.length === 0) {
    await query(
      `INSERT INTO usuarios (nombre, apellido, email, password, rol) VALUES ($1, $2, $3, $4, $5)`,
      ['Joan', 'Escala', 'joan@escala.io', hash, 'admin']
    )
    console.log('✅ Admin creado: joan@escala.io / escala2026')
  } else {
    // Update the hash in case the stored one is wrong
    await query(`UPDATE usuarios SET password = $1 WHERE LOWER(email) = 'joan@escala.io'`, [hash])
    console.log('✅ Admin ya existe — hash de contraseña actualizado')
  }

  // Seed API key
  const keyCheck = await query(`SELECT id FROM api_keys LIMIT 1`)
  if (keyCheck.rows.length === 0) {
    const apiKey = uuidv4()
    await query(`INSERT INTO api_keys (key) VALUES ($1)`, [apiKey])
    console.log(`✅ API Key: ${apiKey}`)
  }

  console.log('✅ Base de datos inicializada correctamente')
}
