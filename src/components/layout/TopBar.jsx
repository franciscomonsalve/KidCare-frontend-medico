import React from 'react'
import { useContador } from '../../hooks/useContador'

export function TopBar({ expiracion }) {
  const { display, expirado } = useContador(expiracion)

  return (
    <header style={{
      background: 'var(--navy)',
      padding: '0 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 62,
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36,
          background: 'rgba(255,255,255,.1)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
        }}>🧒</div>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 22,
          color: '#fff',
          letterSpacing: '-.3px',
        }}>KidCare</span>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Geo pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(52,211,153,.12)',
          border: '1px solid rgba(52,211,153,.22)',
          borderRadius: 20,
          padding: '6px 14px',
          fontSize: 12, fontWeight: 600, color: '#6ee7b7',
        }}>
          ✅ Ubicación verificada
        </div>

        {/* Timer */}
        {expiracion && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: expirado ? 'rgba(192,57,43,.3)' : 'rgba(255,255,255,.08)',
            border: `1px solid ${expirado ? 'rgba(240,149,149,.5)' : 'rgba(255,255,255,.14)'}`,
            borderRadius: 20,
            padding: '6px 16px',
            fontSize: 13, fontWeight: 600, color: '#fff',
          }}>
            {!expirado && (
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#34d399',
                animation: 'timerBlink 1.4s ease-in-out infinite',
              }} />
            )}
            {expirado ? '⚠ Expirado' : display}
            <style>{`@keyframes timerBlink { 0%,100%{opacity:1;} 50%{opacity:.25;} }`}</style>
          </div>
        )}
      </div>
    </header>
  )
}
