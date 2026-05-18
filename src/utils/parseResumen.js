/**
 * Parsea el texto libre generado por Claude para extraer secciones.
 * Si el texto no tiene marcadores reconocibles, retorna todo en `motivo`.
 */
export function parseResumen(texto) {
  if (!texto) return null

  const result = {
    motivo:         null,
    sintomasDesc:   null,
    sintomas:       [],
    evolucion:      null,
    medicacion:     null,
    antecedentes:   null,
    escalaMalestar: null,
  }

  const lineas = texto.split('\n').map(l => l.trim()).filter(Boolean)

  const MARCADORES = {
    motivo:       /^(motivo\s*de\s*consulta|motivo)\s*[:\-]/i,
    sintomas:     /^(s[ií]ntomas\s*(registrados)?|s[ií]ntoma)\s*[:\-]/i,
    evolucion:    /^evoluci[oó]n\s*[:\-]/i,
    medicacion:   /^medicaci[oó]n(\s*administrada)?\s*[:\-]/i,
    antecedentes: /^antecedentes\s*[:\-]/i,
    escala:       /^escala(\s*de\s*malestar)?\s*[:\-]/i,
  }

  let seccionActual = null
  const buffer = {}

  for (const linea of lineas) {
    let detectado = false
    for (const [clave, regex] of Object.entries(MARCADORES)) {
      if (regex.test(linea)) {
        seccionActual = clave
        const contenido = linea.replace(regex, '').replace(/^[\s\-:]+/, '').trim()
        buffer[clave] = contenido ? [contenido] : []
        detectado = true
        break
      }
    }
    if (!detectado && seccionActual) {
      buffer[seccionActual] = buffer[seccionActual] || []
      buffer[seccionActual].push(linea)
    }
  }

  const tieneEstructura = Object.keys(buffer).length > 0
  if (!tieneEstructura) {
    result.motivo = texto
    return result
  }

  result.motivo       = buffer.motivo?.join(' ') || null
  result.sintomasDesc = buffer.sintomas?.join(' ') || null
  result.evolucion    = buffer.evolucion?.join(' ') || null
  result.medicacion   = buffer.medicacion?.join(' ') || null
  result.antecedentes = buffer.antecedentes?.join(' ') || null

  const escalaTexto = buffer.escala?.join(' ') || ''
  const escalaMatch = escalaTexto.match(/(\d+)\s*\/?\s*(10|de\s*10)?/)
  if (escalaMatch) {
    const val = parseInt(escalaMatch[1])
    if (val >= 0 && val <= 10) result.escalaMalestar = val
  }

  if (!result.motivo) result.motivo = lineas[0] || null

  return result
}
