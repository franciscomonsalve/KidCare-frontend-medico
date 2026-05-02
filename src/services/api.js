import axios from 'axios'

const ACCESS_BASE   = 'https://kidcare-access.up.railway.app/api/v1'
const BITACORA_BASE = 'https://kidcare-bitacora.up.railway.app/api/v1'
const CHATBOT_BASE  = 'https://kidcare-chatbot.up.railway.app/api/v1'

export async function verificarToken(token, latitudMedico, longitudMedico) {
  const response = await axios.get(`${ACCESS_BASE}/acceso/verificar/${token}`, {
    params: { latitudMedico, longitudMedico },
  })
  return response.data
}

export async function getBitacora(menorId) {
  const response = await axios.get(`${BITACORA_BASE}/bitacora/${menorId}`)
  return response.data
}

export async function getResumen(menorId) {
  const response = await axios.get(`${CHATBOT_BASE}/chatbot/${menorId}/resumen`)
  return response.data
}