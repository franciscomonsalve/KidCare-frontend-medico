import axios from 'axios'

// Normalise: strip trailing slash then append /api if not already present.
// This tolerates Railway env vars set with or without the /api suffix.
function withApi(base) {
  const b = (base || '').replace(/\/$/, '')
  return b.endsWith('/api') ? b : b + '/api'
}

const ACCESS_BASE    = withApi(import.meta.env.VITE_ACCESS_BASE    || 'http://localhost:8082')
const CHATBOT_BASE   = withApi(import.meta.env.VITE_CHATBOT_BASE   || 'http://localhost:8083')
const HISTORIAL_BASE = withApi(import.meta.env.VITE_HISTORIAL_BASE || 'http://localhost:8084')

export async function verificarToken(token, latitudMedico, longitudMedico) {
  const response = await axios.post(`${ACCESS_BASE}/acceso/medico/verificar`, {
    token,
    latitudMedico:  String(latitudMedico),
    longitudMedico: String(longitudMedico),
  })
  return response.data
}

function generarTituloCorto(texto) {
  if (!texto) return null
  const palabras = texto.trim().split(/\s+/)
  return palabras.slice(0, 6).join(' ') + (palabras.length > 6 ? '…' : '')
}

export async function getBitacora(menorId, observacionIds) {
  const params = observacionIds?.length ? `?ids=${observacionIds.join(',')}` : ''
  const response = await axios.get(`${CHATBOT_BASE}/interacciones/interno/menor/${menorId}${params}`)
  const observaciones = (response.data || []).map(obs => ({
    observacionId: obs.id,
    origen:        obs.origen,
    fecha:         obs.fecha,
    contenido:     obs.observaciones,
    titulo:        obs.titulo || generarTituloCorto(obs.observaciones),
    tags:          obs.tags || [],
  }))
  return { observaciones }
}

export async function getResumen(menorId) {
  try {
    const response = await axios.get(`${HISTORIAL_BASE}/historial/medico/${menorId}`)
    const data = response.data
    return {
      resumenDisponible: true,
      resumen:           data.resumen,
      motivo:            data.resumen,
    }
  } catch {
    return { resumenDisponible: false, mensaje: 'No hay resumen disponible para este paciente.' }
  }
}
