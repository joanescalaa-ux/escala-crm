import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { initDb } from '@/lib/initDb'
import { query } from '@/lib/db'
import { setSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await initDb()

    const body = await req.json()
    const email = (body.email || '').trim().toLowerCase()
    const password = (body.password || '').trim()

    console.log('[login] email recibido:', email)
    console.log('[login] password length:', password.length)

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
    }

    const result = await query(`SELECT id, nombre, apellido, email, password, rol, cliente_id FROM usuarios WHERE email = $1`, [email])
    const user = result.rows[0]

    console.log('[login] usuario encontrado:', user ? `id=${user.id} email=${user.email}` : 'NO ENCONTRADO')

    if (!user) {
      // Try case-insensitive fallback
      const fallback = await query(`SELECT id, nombre, apellido, email, password, rol, cliente_id FROM usuarios WHERE LOWER(email) = $1`, [email])
      const fallbackUser = fallback.rows[0]
      console.log('[login] fallback usuario:', fallbackUser ? `id=${fallbackUser.id} email=${fallbackUser.email}` : 'NO ENCONTRADO')

      if (!fallbackUser) {
        return NextResponse.json({ error: 'Credenciales inválidas — usuario no encontrado' }, { status: 401 })
      }

      const validFallback = await bcrypt.compare(password, fallbackUser.password)
      console.log('[login] bcrypt.compare (fallback):', validFallback)

      if (!validFallback) {
        return NextResponse.json({ error: 'Credenciales inválidas — contraseña incorrecta' }, { status: 401 })
      }

      await setSession({
        id: fallbackUser.id,
        email: fallbackUser.email,
        rol: fallbackUser.rol,
        clienteId: fallbackUser.cliente_id,
        nombre: fallbackUser.nombre || fallbackUser.email,
      })

      return NextResponse.json({
        success: true,
        user: { id: fallbackUser.id, email: fallbackUser.email, rol: fallbackUser.rol, nombre: fallbackUser.nombre }
      })
    }

    const valid = await bcrypt.compare(password, user.password)
    console.log('[login] bcrypt.compare:', valid)
    console.log('[login] hash en DB (primeros 20 chars):', user.password?.substring(0, 20))

    if (!valid) {
      return NextResponse.json({ error: 'Credenciales inválidas — contraseña incorrecta' }, { status: 401 })
    }

    await setSession({
      id: user.id,
      email: user.email,
      rol: user.rol,
      clienteId: user.cliente_id,
      nombre: user.nombre || user.email,
    })

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, rol: user.rol, nombre: user.nombre }
    })

  } catch (err) {
    console.error('[login] error:', err)
    return NextResponse.json({ error: 'Error interno del servidor', detail: String(err) }, { status: 500 })
  }
}
