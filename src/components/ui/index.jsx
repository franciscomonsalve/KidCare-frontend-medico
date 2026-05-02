import React from 'react'

// ─── Badge ────────────────────────────────────────────────────────────────────
const badgeStyles = {
  CHATBOT:  { background: '#FEF3DC', color: '#854F0B' },
  MANUAL:   { background: '#F1EFE8', color: '#5F5E5A' },
  ACTIVO:   { background: '#E1F5EE', color: '#085041' },
  EXPIRADO: { background: '#FDECEC', color: '#A32D2D' },
  DEFAULT:  { background: '#F1EFE8', color: '#444441' },
}

export function Badge({ label }) {
  const style = badgeStyles[label?.toUpperCase()] || badgeStyles.DEFAULT
  return (
    <span style={{
      ...style,
      display: 'inline-block',
      fontSize: '11px',
      fontWeight: 500,
      padding: '2px 9px',
      borderRadius: '20px',
    }}>
      {label}
    </span>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border-soft)',
      boxShadow: 'var(--shadow-card)',
      padding: '20px 22px',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 32, color = 'var(--color-brand)' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <div style={{
        width: size,
        height: size,
        border: `3px solid var(--color-border)`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── AlertBox ─────────────────────────────────────────────────────────────────
export function AlertBox({ type = 'error', title, message }) {
  const styles = {
    error:   { bg: '#FDECEC', border: '#F09595', text: '#7A1F1F', icon: '✕' },
    warning: { bg: '#FEF3DC', border: '#FAC775', text: '#633806', icon: '!' },
    info:    { bg: '#E1F5EE', border: '#9FE1CB', text: '#085041', icon: 'i' },
  }
  const s = styles[type]
  return (
    <div style={{
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: 'var(--radius-md)',
      padding: '14px 16px',
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        background: s.border, color: s.text,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 600, flexShrink: 0,
      }}>
        {s.icon}
      </div>
      <div>
        {title && <div style={{ fontWeight: 500, color: s.text, fontSize: 14, marginBottom: 2 }}>{title}</div>}
        <div style={{ color: s.text, fontSize: 13, lineHeight: 1.5 }}>{message}</div>
      </div>
    </div>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-soft)', margin: '16px 0' }} />
}