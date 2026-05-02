import React from 'react'
import { Routes, Route } from 'react-router-dom'
import VerificandoPage from './pages/VerificandoPage'
import BitacoraPage    from './pages/BitacoraPage'
import NotFoundPage    from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/acceso/:token" element={<VerificandoPage />} />
      <Route path="/bitacora"      element={<BitacoraPage />} />
      <Route path="*"              element={<NotFoundPage />} />
    </Routes>
  )
}