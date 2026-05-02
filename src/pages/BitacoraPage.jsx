import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getBitacora, getResumen } from '../services/api'
import { useContador} from '../hooks/useContador'
import { TopBar } from '../components/layout/TopBar'
import { Card, Badge, Spinner, AlertBox, Divider } from '../components/ui/index.jsx'

function formatFecha(isoString) {
  if (!isoString) return '—'
  const d = new Date(isoString)
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' · '
    + d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
}

export default function BitacoraPage() {
  const location = useLocation()
  const navigate  = useNavigate()
  const { menorId, expiracion } = location.state || {}

  const { expirado } = useContador(expiracion)

  const [bitacora,  setBitacora]  = useState(null)
  const [resumen,   setResumen]   = useState(null)
  const [loadingB,  setLoadingB]  = useState(true)
  const [loadingR,  setLoadingR]  = useState(true)
  const [errorB,    setErrorB]    = useState(null)

  useEffect(() => {
    if (!menorId) navigate('/')
  }, [])

  useEffect(() => {
    if (!menorId) return
    getBitacora(menorId)
      .then((data) => { setBitacora(data); setLoadingB(false) })
      .catch(() => { setErrorB('No se pudieron cargar las observaciones.'); setLoadingB(false) })
  }, [menorId])

  useEffect(() => {
    if (!menorId) return
    getResumen(menorId)
      .then((data) => { setResumen(data); setLoadingR(false) })
      .catch(() => { setResumen({ resumenDisponible: false }); setLoadingR(false) })
  }, [menorId])

  if (!menorId) return null

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar expiracion={expiracion} />

      <main style={{ flex: 1, maxWidth: 800, width: '100%', margin: '0 auto', padding: '32px 20px' }}>

        {/* Alerta expiración */}
        {expirado && (
          <div className="fade-up" style={{ marginBottom: 20 }}>
            <AlertBox
              type="error"
              title="Sesión expirada"
              message="El enlace temporal ha vencido. Ya no puedes acceder a esta bitácora."
            />
          </div>
        )}

        {/* Título */}
        <div className="fade-up" style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 500, color: 'var(--color-text-primary)' }}>
            Bitácora de salud
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginTop: 4 }}>
            Acceso de solo lectura · Observaciones anonimizadas conforme a la Ley 19.628
          </p>
        </div>

        {/* Resumen IA */}
        <div className="fade-up fade-up-1" style={{ marginBottom: 24 }}>
          {loadingR ? (
            <Card><Spinner size={24} /></Card>
          ) : resumen?.resumenDisponible ? (
            <Card style={{ borderLeft: '3px solid var(--color-brand)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 28, height: 28,
                  background: 'var(--color-brand-light)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14,
                }}>✦</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>Resumen generado por IA</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-hint)' }}>
                    Claude Sonnet · {resumen.observacionesTotales} observaciones
                  </div>
                </div>
              </div>
              <p style={{
                fontSize: 14,
                lineHeight: 1.7,
                background: 'var(--color-brand-light)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
              }}>
                {resumen.resumen}
              </p>
              <p style={{ fontSize: 11, color: 'var(--color-text-hint)', marginTop: 8 }}>
                Este resumen es informativo y no constituye diagnóstico ni recomendación clínica.
              </p>
            </Card>
          ) : (
            <AlertBox
              type="warning"
              title="Resumen no disponible"
              message={resumen?.mensaje || 'El servicio de resumen no está disponible. Se muestran las observaciones completas.'}
            />
          )}
        </div>

        {/* Métricas */}
        {bitacora && (
          <div className="fade-up fade-up-2" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
            marginBottom: 24,
          }}>
            {[
              { label: 'Total observaciones', value: bitacora.observaciones?.length ?? 0 },
              { label: 'Vía chatbot',          value: bitacora.observaciones?.filter(o => o.origen === 'CHATBOT').length ?? 0 },
              { label: 'Ingreso manual',       value: bitacora.observaciones?.filter(o => o.origen === 'MANUAL').length ?? 0 },
            ].map((m, i) => (
              <Card key={i} style={{ textAlign: 'center', padding: '16px 12px' }}>
                <div style={{ fontSize: 26, fontWeight: 500 }}>{m.value}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{m.label}</div>
              </Card>
            ))}
          </div>
        )}

        {/* Observaciones */}
        <div className="fade-up fade-up-3">
          <Card>
            <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 16 }}>
              Observaciones cronológicas
            </div>

            {loadingB && <Spinner />}
            {errorB   && <AlertBox type="error" message={errorB} />}

            {bitacora?.observaciones?.length === 0 && (
              <div style={{ color: 'var(--color-text-hint)', fontSize: 14, textAlign: 'center', padding: '32px 0' }}>
                No hay observaciones registradas.
              </div>
            )}

            {bitacora?.observaciones?.map((obs, idx) => (
              <div key={obs.observacionId}>
                {idx > 0 && <Divider />}
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 8, height: 8,
                    borderRadius: '50%',
                    background: obs.origen === 'CHATBOT' ? 'var(--color-brand)' : 'var(--color-border)',
                    marginTop: 6,
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                        {formatFecha(obs.fecha)}
                      </span>
                      <Badge label={obs.origen} />
                      {obs.editada && (
                        <span style={{ fontSize: 11, color: 'var(--color-text-hint)' }}>
                          · editada {formatFecha(obs.fechaEdicion)}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.65 }}>
                      {obs.contenido}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Footer */}
        <div className="fade-up fade-up-4" style={{
          marginTop: 32,
          textAlign: 'center',
          fontSize: 12,
          color: 'var(--color-text-hint)',
          lineHeight: 1.6,
        }}>
          KidCare · Herramienta de acompañamiento pediátrico<br />
          Ninguna funcionalidad reemplaza el criterio clínico del profesional de salud.
        </div>

      </main>
    </div>
  )
}