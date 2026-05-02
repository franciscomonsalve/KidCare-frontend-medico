import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGeolocacion } from '../hooks/useGeolocacion'
import { verificarToken } from '../services/api'
import { Spinner, AlertBox } from '../components/ui/index.jsx'

export default function VerificandoPage() {
  const { token } = useParams()
  const navigate  = useNavigate()
  const { coords, error: geoError, loading: geoLoading } = useGeolocacion()

  const [estado, setEstado]   = useState('esperando_geo')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (geoLoading) return

    if (geoError) {
      setEstado('error')
      setErrorMsg('No se pudo obtener tu ubicación. El acceso requiere geolocalización activa.')
      return
    }

    if (coords) {
      setEstado('verificando')
      verificarToken(token, coords.lat, coords.lng)
        .then((data) => {
          if (data.accesoConcedido) {
            navigate('/bitacora', {
              state: {
                menorId:    data.menorId,
                expiracion: data.expiracion,
              },
            })
          } else {
            setEstado('error')
            setErrorMsg(data.motivo || 'Acceso denegado.')
          }
        })
        .catch((err) => {
          const msg = err?.response?.data?.motivo || 'Error al verificar el enlace. Puede que haya expirado.'
          setEstado('error')
          setErrorMsg(msg)
        })
    }
  }, [coords, geoLoading, geoError])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      background: 'var(--color-bg)',
    }}>

      {/* Logo */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        
          <img
           src="/icons/logo.png"
           alt="KidCare"
            style={{ width: 200, marginBottom: 24 }}
            />
      
        <div style={{ fontSize: 24, color: 'var(--color-text-primary)', fontWeight: 500 }}>
          KidCare
        </div>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginTop: 4 }}>
          Panel médico · Acceso temporal
        </div>
      </div>

      {/* Estados */}
      <div style={{ width: '100%', maxWidth: 400 }}>

        {estado === 'esperando_geo' && (
          <div style={{ textAlign: 'center' }}>
            <Spinner />
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginTop: 8 }}>
              Solicitando permiso de ubicación…
            </div>
            <div style={{ color: 'var(--color-text-hint)', fontSize: 12, marginTop: 6 }}>
              Necesario para verificar proximidad con el paciente
            </div>
          </div>
        )}

        {estado === 'verificando' && (
          <div style={{ textAlign: 'center' }}>
            <Spinner />
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginTop: 8 }}>
              Verificando enlace temporal…
            </div>
          </div>
        )}

        {estado === 'error' && (
          <>
            <AlertBox
              type="error"
              title="Acceso denegado"
              message={errorMsg}
            />
            <div style={{
              marginTop: 16,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-soft)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              fontSize: 13,
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
            }}>
              Solicita al padre o tutor que genere un nuevo enlace temporal.
            </div>
          </>
        )}

      </div>
    </div>
  )
}