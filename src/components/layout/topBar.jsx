import React from 'react'
import { useContador } from '../../hooks/useContador'

export function TopBar({ expiracion, menorNombre }) {
  const { display, expirado } = useContador(expiracion)

  return (
    <header style={{
      background: 'linear-gradient(135deg, #4A90D9 0%, #6BB8F0 100%)',
      padding: '14px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>

      {/* Logo y título */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 36, height: 36,
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>
          🌿
        </div>
        <div>
          <div style={{ color: 'white', fontWeight: 500, fontSize: 16 }}>
            KidCare
          </div>
          {menorNombre && (
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
              Bitácora del paciente
            </div>
          )}
        </div>
      </div>

      {/* Timer */}
      {expiracion && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: expirado ? 'rgba(192,57,43,0.3)' : 'rgba(255,255,255,0.12)',
          border: `1px solid ${expirado ? 'rgba(240,149,149,0.5)' : 'rgba(255,255,255,0.2)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '6px 14px',
        }}>
          <span style={{ fontSize: 18 }}>{expirado ? '⚠' : '⏱'}</span>
          <div>
            <div style={{
              color: expirado ? '#FDECEC' : 'white',
              fontWeight: 500,
              fontSize: 18,
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}>
              {expirado ? 'Expirado' : display}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
              {expirado ? 'Acceso finalizado' : 'tiempo restante'}
            </div>
          </div>
        </div>
      )}

    </header>
  )
}