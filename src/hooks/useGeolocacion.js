import { useState, useEffect } from 'react'

export function useGeolocacion() {
  const [coords, setCoords]   = useState(null)
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Este navegador no soporta geolocalización.')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLoading(false)
      },
      (err) => {
        setError('No se pudo obtener la ubicación. ' + err.message)
        setLoading(false)
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }, [])

  return { coords, error, loading }
}