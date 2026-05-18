import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGeolocacion } from '../hooks/useGeolocacion'
import { verificarToken } from '../services/api'

export default function VerificandoPage() {
  const { token } = useParams()
  const navigate  = useNavigate()
  const { coords, error: geoError, loading: geoLoading } = useGeolocacion()

  const [estado, setEstado]         = useState('esperando_geo')
  const [geoErrorMsg, setGeoErrorMsg] = useState('')
  const [showOverlay, setShowOverlay] = useState(true)

  useEffect(() => {
    const run = async () => {
      if (geoLoading) return

      if (geoError) {
        setEstado('geo_error')
        setGeoErrorMsg('No se pudo obtener tu ubicación. El acceso requiere geolocalización activa.')
        setShowOverlay(false)
        return
      }

      if (coords) {
        try {
          setEstado('verificando')
          const data = await verificarToken(token, String(coords.lat), String(coords.lng))
          setShowOverlay(false)
          navigate('/bitacora', {
            state: {
              menorId:        data.idMenor,
              expiracion:     data.expiracion,
              nombreMedico:   data.nombreMedico,
              observacionIds: data.observacionIds ?? null,
              resumenVerif:   data.resumen ?? null,
              nombreMenor:    data.nombreMenor ?? null,
              edadMenor:      data.edadMenor ?? null,
              nombreTutor:    data.nombreTutor ?? null,
              horaGenerado:   data.horaGenerado ?? null,
            },
          })
        } catch (err) {
          setShowOverlay(false)
          const status = err.response?.status
          const msg = (err.response?.data?.error || err.response?.data?.message || '').toLowerCase()
          let tipoError = 'expired'
          // Determine error type from message content (more reliable than status codes)
          if (msg.includes('radio') || msg.includes('metros') || msg.includes('km') || msg.includes('rango')) {
            tipoError = 'geo'
          } else if (msg.includes('revocado') || msg.includes('revocar')) {
            tipoError = 'revoked'
          } else if (status === 403 && !msg) {
            // 403 without a recognisable message → treat as revoked
            tipoError = 'revoked'
          }
          navigate('/error', { state: { tipo: tipoError } })
        }
      }
    }
    run()
  }, [coords, geoLoading, geoError])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
      <style>{`
        @keyframes popIn {
          from { transform: translateY(20px) scale(.97); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes geoPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(26,86,219,.35); }
          50%      { box-shadow: 0 0 0 18px rgba(26,86,219,0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {showOverlay && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(10,14,26,.88)',
          backdropFilter: 'blur(10px)',
          zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}>
          <div style={{
            background: '#fff', borderRadius: 24, padding: '44px 40px',
            maxWidth: 440, width: '100%', textAlign: 'center',
            boxShadow: '0 40px 100px rgba(0,0,0,.5)',
            animation: 'popIn .4s cubic-bezier(.16,1,.3,1)',
          }}>
            <div style={{
              width: 80, height: 80,
              background: 'linear-gradient(135deg, #1a56db, #0891b2)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 34, margin: '0 auto 24px',
              animation: 'geoPulse 2.2s ease-in-out infinite',
            }}>📍</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--ink)', marginBottom: 10 }}>
              Verificación de ubicación
            </h2>
            <p style={{ fontSize: 14, color: 'var(--ink3)', lineHeight: 1.7, marginBottom: 28 }}>
              Para acceder a la bitácora del paciente necesitamos confirmar que te encuentras
              a menos de <strong>100 metros</strong> del tutor que generó este enlace.<br /><br />
              Tu ubicación <strong>no será almacenada</strong>.
            </p>
            <div style={{
              padding: 15,
              background: 'linear-gradient(135deg, #1a56db, #0891b2)',
              color: '#fff', borderRadius: 13,
              fontSize: 15, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              📍 {estado === 'verificando' ? 'Verificando enlace…' : 'Solicitando ubicación…'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink4)', marginTop: 10 }}>
              Solo se usa para verificar proximidad · No queda registro de tu posición
            </div>
          </div>
        </div>
      )}

      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: '32px 16px',
      }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: 'var(--navy)', marginBottom: 4 }}>
            KidCare
          </div>
          <div style={{ color: 'var(--ink3)', fontSize: 13 }}>Panel médico · Acceso temporal</div>
        </div>

        <div style={{ width: '100%', maxWidth: 400 }}>
          {(estado === 'esperando_geo' || estado === 'verificando') && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
                <div style={{
                  width: 36, height: 36, border: '3px solid var(--bdr)',
                  borderTopColor: 'var(--blue)', borderRadius: '50%',
                  animation: 'spin .7s linear infinite',
                }} />
              </div>
              <div style={{ color: 'var(--ink3)', fontSize: 14 }}>
                {estado === 'esperando_geo' ? 'Solicitando permiso de ubicación…' : 'Verificando enlace temporal…'}
              </div>
              {estado === 'esperando_geo' && (
                <div style={{ color: 'var(--ink4)', fontSize: 12, marginTop: 6 }}>
                  Necesario para verificar proximidad con el paciente
                </div>
              )}
            </div>
          )}

          {estado === 'geo_error' && (
            <>
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 16, padding: '22px 24px',
                display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16,
              }}>
                <div style={{
                  width: 44, height: 44, background: '#fee2e2', borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, flexShrink: 0,
                }}>📍</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#991b1b', marginBottom: 5 }}>
                    Ubicación no disponible
                  </div>
                  <div style={{ fontSize: 13, color: '#b45309', lineHeight: 1.7 }}>{geoErrorMsg}</div>
                </div>
              </div>
              <div style={{
                background: 'var(--surf)', border: '1px solid var(--bdr)',
                borderRadius: 13, padding: '14px 16px',
                fontSize: 13, color: 'var(--ink3)', lineHeight: 1.6,
              }}>
                Activa la geolocalización en tu navegador y recarga la página. Si el problema persiste, solicita al tutor que genere un nuevo enlace.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
