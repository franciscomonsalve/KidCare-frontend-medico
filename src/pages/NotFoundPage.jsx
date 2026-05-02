import React from 'react'

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      background: 'linear-gradient(160deg, #EBF4FF 0%, #F7F9FC 60%, #FFF0F6 100%)',
    }}>


      {/* Logo */}
     <img
         src="/icons/logo.png"
         alt="KidCare"
         style={{ width: 200, marginBottom: 24 }}
     />

      <div style={{
        fontSize: 28,
        fontWeight: 700,
        color: '#2D3748',
        marginBottom: 6,
        letterSpacing: '-0.3px',
      }}>
        KidCare
      </div>

      <div style={{
        fontSize: 14,
        color: '#718096',
        marginBottom: 32,
      }}>
        Panel médico · Acceso temporal
      </div>

      {/* Card de error */}
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: 'white',
        borderRadius: 20,
        padding: '28px 24px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
        <div style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#2D3748',
          marginBottom: 8,
        }}>
          Enlace no válido
        </div>
        <div style={{
          fontSize: 14,
          color: '#718096',
          lineHeight: 1.7,
          marginBottom: 20,
        }}>
          Este enlace no existe o ya no está disponible.<br />
          Solicita al padre o tutor que genere un nuevo enlace temporal desde la app.
        </div>
        <div style={{
          background: '#EBF4FF',
          borderRadius: 12,
          padding: '12px 16px',
          fontSize: 13,
          color: '#4A90D9',
          fontWeight: 600,
        }}>
          💡 El enlace tiene una validez de 20 minutos
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 32,
        fontSize: 12,
        color: '#A0AEC0',
        textAlign: 'center',
        lineHeight: 1.6,
      }}>
        KidCare · Herramienta de acompañamiento pediátrico
      </div>

    </div>
  )
}