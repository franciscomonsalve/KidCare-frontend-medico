import React, { useState } from 'react'

const STATES = {
  expired: {
    icon: '⏱️',
    badge: '⏱️ Enlace expirado',
    title: 'Este enlace ya no está disponible',
    desc: <>El enlace temporal que recibiste ha <strong>expirado automáticamente</strong>.<br />Por seguridad, los enlaces de KidCare tienen una vigencia máxima de <strong>20 minutos</strong>.</>,
    info: [
      { icon: '⏱️', label: 'Razón', val: 'El enlace ha superado su tiempo de validez' },
      { icon: '🔒', label: 'Estado', val: 'Token invalidado automáticamente' },
    ],
    note: <><strong>¿Necesitas acceder?</strong><br />Solicita al tutor del paciente que genere un nuevo enlace desde la app KidCare. Solo puede haber un enlace activo a la vez por paciente.</>,
    glow: 'rgba(245,158,11,.07)',
    badgeStyle: { background: 'rgba(245,158,11,.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,.18)' },
    iconStyle: { background: 'rgba(245,158,11,.1)', border: '1.5px solid rgba(245,158,11,.2)' },
  },
  revoked: {
    icon: '🚫',
    badge: '🚫 Acceso revocado',
    title: 'El tutor revocó este acceso',
    desc: <>El tutor del paciente <strong>invalidó manualmente</strong> este enlace antes de que expirara.<br />Esto permite al tutor mantener control total sobre el acceso en todo momento.</>,
    info: [
      { icon: '🔒', label: 'Estado', val: 'Token revocado manualmente' },
    ],
    note: <><strong>¿Necesitas el acceso?</strong><br />Contacta directamente al tutor del paciente para que genere un nuevo enlace desde la app KidCare.</>,
    glow: 'rgba(220,38,38,.08)',
    badgeStyle: { background: 'rgba(220,38,38,.1)', color: '#f87171', border: '1px solid rgba(220,38,38,.18)' },
    iconStyle: { background: 'rgba(220,38,38,.1)', border: '1.5px solid rgba(220,38,38,.2)' },
  },
  geo: {
    icon: '📍',
    badge: '📍 Fuera del radio permitido',
    title: 'Ubicación fuera de rango',
    desc: <>Tu dispositivo se encuentra a más de <strong>100 metros</strong> del tutor que generó este enlace.<br />KidCare requiere proximidad física para garantizar que el acceso ocurra <strong>durante la consulta presencial</strong>.</>,
    info: [
      { icon: '✅', label: 'Radio permitido', val: '≤ 100 metros' },
      { icon: '🔒', label: 'Tu posición', val: 'No fue almacenada' },
    ],
    note: <><strong>¿Estás en la consulta?</strong><br />Asegúrate de estar físicamente junto al tutor del paciente e intenta de nuevo.</>,
    glow: 'rgba(99,102,241,.08)',
    badgeStyle: { background: 'rgba(99,102,241,.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,.18)' },
    iconStyle: { background: 'rgba(99,102,241,.1)', border: '1.5px solid rgba(99,102,241,.2)' },
  },
}

export default function NotFoundPage() {
  const [active, setActive] = useState('expired')
  const s = STATES[active]

  return (
    <div style={{ background: '#080c18', minHeight: '100vh', position: 'relative' }}>
      <style>{`
        @keyframes iconpulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.85;transform:scale(1.03);} }
        @keyframes errIn { from{transform:translateY(22px);opacity:0;} to{transform:none;opacity:1;} }
        @keyframes spIn { from{opacity:0;transform:translateY(6px);} to{opacity:1;transform:none;} }
      `}</style>

      {/* Grid bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px)',
        backgroundSize: '52px 52px',
      }} />

      {/* Glow */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 640, height: 640, borderRadius: '50%', pointerEvents: 'none',
        background: `radial-gradient(circle, ${s.glow} 0%, transparent 70%)`,
        transition: 'background .4s ease',
      }} />

      {/* Topbar */}
      <div style={{
        background: 'rgba(8,12,24,.9)', backdropFilter: 'blur(10px)',
        height: 60, display: 'flex', alignItems: 'center', padding: '0 28px',
        borderBottom: '1px solid rgba(255,255,255,.06)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            background: 'rgba(255,255,255,.06)',
            border: '1px solid rgba(255,255,255,.1)',
            borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>🧒</div>
          <span style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 19, color: 'rgba(255,255,255,.7)',
          }}>KidCare</span>
        </div>
      </div>

      {/* Center */}
      <div style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 20px 80px',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          background: 'rgba(255,255,255,.04)',
          border: '1px solid rgba(255,255,255,.08)',
          backdropFilter: 'blur(8px)',
          borderRadius: 28, padding: '52px 44px',
          maxWidth: 500, width: '100%',
          textAlign: 'center',
          animation: 'errIn .45s cubic-bezier(.16,1,.3,1)',
        }}>

          {/* State tabs */}
          <div style={{
            display: 'flex', gap: 5,
            background: 'rgba(255,255,255,.04)',
            border: '1px solid rgba(255,255,255,.06)',
            borderRadius: 12, padding: 4, marginBottom: 36,
          }}>
            {Object.keys(STATES).map(key => (
              <button key={key} onClick={() => setActive(key)} style={{
                flex: 1, padding: '8px 4px',
                borderRadius: 8, border: 'none',
                background: active === key ? 'rgba(255,255,255,.08)' : 'transparent',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11, fontWeight: 600,
                color: active === key ? 'rgba(255,255,255,.85)' : 'rgba(255,255,255,.28)',
                cursor: 'pointer', transition: 'all .2s',
              }}>
                {key === 'expired' ? '⏱ Expirado' : key === 'revoked' ? '🚫 Revocado' : '📍 Fuera de rango'}
              </button>
            ))}
          </div>

          <div key={active} style={{ animation: 'spIn .3s ease' }}>
            {/* Icon */}
            <div style={{
              width: 86, height: 86, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, margin: '0 auto 26px',
              animation: 'iconpulse 2.5s ease-in-out infinite',
              ...s.iconStyle,
            }}>{s.icon}</div>

            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              borderRadius: 10, padding: '7px 16px',
              fontSize: 12, fontWeight: 700, marginBottom: 20,
              ...s.badgeStyle,
            }}>{s.badge}</div>

            {/* Title */}
            <div style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 28, color: '#fff', marginBottom: 10, lineHeight: 1.2,
            }}>{s.title}</div>

            {/* Desc */}
            <div style={{
              fontSize: 14, color: 'rgba(255,255,255,.42)',
              lineHeight: 1.75, marginBottom: 28,
            }}>{s.desc}</div>

            {/* Info rows */}
            <div style={{
              background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(255,255,255,.07)',
              borderRadius: 14, padding: '4px 0',
              marginBottom: 24, textAlign: 'left',
            }}>
              {s.info.map((row, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '12px 18px',
                  borderBottom: i < s.info.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none',
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{row.icon}</span>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: 'rgba(255,255,255,.25)' }}>
                      {row.label}
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', fontWeight: 500, marginTop: 2 }}>
                      {row.val}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Note */}
            <div style={{
              background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(255,255,255,.07)',
              borderRadius: 12, padding: '14px 18px',
              fontSize: 12, color: 'rgba(255,255,255,.38)',
              lineHeight: 1.7, textAlign: 'left',
            }}>{s.note}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(8,12,24,.8)', backdropFilter: 'blur(8px)',
        borderTop: '1px solid rgba(255,255,255,.05)',
        padding: '13px 24px', textAlign: 'center',
        fontSize: 11, color: 'rgba(255,255,255,.18)', zIndex: 50,
      }}>
        KidCare · Sistema de Bitácora de Síntomas Pediátricos<br />
        Acceso protegido · Ley 19.628 · Ley 21.663
      </div>
    </div>
  )
}
