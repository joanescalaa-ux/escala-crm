'use client'

interface TopBarProps {
  title: string
  onEnviarReporte?: () => void
  showReporteButton?: boolean
}

export default function TopBar({ title, onEnviarReporte, showReporteButton = false }: TopBarProps) {
  const now = new Date()
  const fecha = now.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div
      className="flex items-center justify-between px-6 flex-shrink-0"
      style={{
        height: 48,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #E2E8F0',
      }}
    >
      <span
        style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: '#94A3B8',
        }}
      >
        {title}
      </span>

      <div className="flex items-center gap-4">
        <span style={{ color: '#94A3B8', fontSize: 12 }}>
          {fecha}
        </span>

        {showReporteButton && (
          <button
            onClick={onEnviarReporte}
            style={{
              height: 30,
              border: '1px solid #0891B2',
              color: '#0891B2',
              backgroundColor: 'transparent',
              fontSize: 12,
              letterSpacing: '0.1em',
              padding: '0 12px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 500,
            }}
          >
            ENVIAR REPORTE
          </button>
        )}
      </div>
    </div>
  )
}
