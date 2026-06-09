'use client'

interface TopBarProps {
  title: string
  onEnviarReporte?: () => void
  showReporteButton?: boolean
}

export default function TopBar({ title, onEnviarReporte, showReporteButton = false }: TopBarProps) {
  const now = new Date()
  const fecha = now.toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div style={{
      height: 46,
      backgroundColor: '#fff',
      borderBottom: '1px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9CA3AF', fontWeight: 500 }}>
        {title}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 12, color: '#D1D5DB' }}>{fecha}</span>
        {showReporteButton && (
          <button onClick={onEnviarReporte} style={{
            height: 28, border: '1px solid #0A0A0A', color: '#0A0A0A',
            backgroundColor: 'transparent', fontSize: 11, letterSpacing: '0.1em',
            padding: '0 14px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
            borderRadius: 6, textTransform: 'uppercase',
          }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#0A0A0A'; e.currentTarget.style.color = '#F8F284' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#0A0A0A' }}
          >
            Enviar reporte
          </button>
        )}
      </div>
    </div>
  )
}
