import { useState, useEffect } from 'react'

export function useContador(expiracionISO) {
  const calcularRestante = () => {
    if (!expiracionISO) return 0
    return Math.max(0, Math.floor((new Date(expiracionISO) - Date.now()) / 1000))
  }

  const [segundosRestantes, setSegundosRestantes] = useState(calcularRestante)

  useEffect(() => {
    if (!expiracionISO) return
    const interval = setInterval(() => {
      const r = calcularRestante()
      setSegundosRestantes(r)
      if (r <= 0) clearInterval(interval)
    }, 1000)
    return () => clearInterval(interval)
  }, [expiracionISO])

  const minutos  = Math.floor(segundosRestantes / 60)
  const segundos = segundosRestantes % 60

  return {
    minutos,
    segundos,
    expirado: segundosRestantes <= 0,
    display: `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`,
  }
}