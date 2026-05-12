import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getBitacora, getResumen } from '../services/api'
import { useContador } from '../hooks/useContador'
import { TopBar } from '../components/layout/TopBar'

function formatHora(isoString) {
  if (!isoString) return '—'
  const d = new Date(isoString)
  const hoy = new Date()
  const esHoy = d.toDateString() === hoy.toDateString()
  const hora = d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
  if (esHoy) return `Hoy, ${hora}`
  const ayer = new Date(); ayer.setDate(ayer.getDate() - 1)
  if (d.toDateString() === ayer.toDateString()) return `Ayer, ${hora}`
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }) + `, ${hora}`
}

function formatExpira(isoString) {
  if (!isoString) return '—'
  const d = new Date(isoString)
  return d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
}

// ─── primitives ───────────────────────────────────────────────────────────────

const S = {
  '@keyframes spin': 'to{transform:rotate(360deg)}',
  '@keyframes blink': '0%,100%{opacity:1}50%{opacity:.25}',
}

function css(strings) { return strings }

function Tag({ children, color = 'gray' }) {
  const p = {
    red:   ['#fee2e2','#991b1b'],
    amber: ['#fef3c7','#92400e'],
    teal:  ['#cffafe','#164e63'],
    gray:  ['#f1f5f9','#374151'],
    blue:  ['#dbeafe','#1e40af'],
    green: ['#d1fae5','#065f46'],
  }[color] || ['#f1f5f9','#374151']
  return (
    <span style={{
      display:'inline-flex',alignItems:'center',gap:4,
      padding:'4px 11px',borderRadius:8,
      fontSize:12,fontWeight:600,
      background:p[0],color:p[1],
    }}>{children}</span>
  )
}

function Spinner() {
  return (
    <div style={{display:'flex',justifyContent:'center',padding:32}}>
      <div style={{
        width:28,height:28,
        border:'3px solid #e2e8f0',borderTopColor:'#1a56db',
        borderRadius:'50%',animation:'spin .7s linear infinite',
      }}/>
    </div>
  )
}

function Divider() {
  return <div style={{height:1,background:'#e2e8f0',margin:'18px 0'}}/>
}

function SecLabel({ children }) {
  return (
    <div style={{
      fontSize:10,fontWeight:800,textTransform:'uppercase',
      letterSpacing:'.8px',color:'#94a3b8',marginBottom:8,
    }}>{children}</div>
  )
}

function PainTrack({ value = 6 }) {
  return (
    <div style={{display:'flex',gap:5,alignItems:'center',marginTop:10}}>
      {[1,2,3,4,5,6,7,8,9,10].map(n => {
        const isHi  = n === value
        const isMid = n < value && n >= value - 3
        let bg = '#f0f4f8', color = '#94a3b8', border = '#e2e8f0'
        if (isHi)  { bg = '#fca5a5'; color = '#991b1b'; border = '#fca5a5' }
        if (isMid) { bg = '#fed7aa'; color = '#92400e'; border = '#fed7aa' }
        return (
          <div key={n} style={{
            width:30,height:30,borderRadius:'50%',
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:11,fontWeight:800,
            background:bg,color,border:`1px solid ${border}`,
          }}>{n}</div>
        )
      })}
      <div style={{fontSize:12,fontWeight:700,color:'#475569',marginLeft:4}}>
        {value} / 10
      </div>
    </div>
  )
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function BitacoraPage() {
  const location = useLocation()
  const navigate  = useNavigate()
  const { menorId, expiracion, nombreMedico: nombreMedicoNav, observacionIds } = location.state || {}
  const { display: timerDisplay, expirado } = useContador(expiracion)

  const [bitacora,  setBitacora]  = useState(null)
  const [resumen,   setResumen]   = useState(null)
  const [loadingB,  setLoadingB]  = useState(true)
  const [loadingR,  setLoadingR]  = useState(true)

  useEffect(() => { if (!menorId) navigate('/') }, [])

  useEffect(() => {
    if (!menorId) return
    getBitacora(menorId, observacionIds)
      .then(d => { setBitacora(d); setLoadingB(false) })
      .catch(() => { setBitacora({ observaciones: [] }); setLoadingB(false) })
  }, [menorId])

  useEffect(() => {
    if (!menorId) return
    getResumen(menorId)
      .then(d => { setResumen(d); setLoadingR(false) })
      .catch(() => { setResumen({ resumenDisponible: false }); setLoadingR(false) })
  }, [menorId])

  if (!menorId) return null

  const obs = bitacora?.observaciones || []
  const iaOk = resumen?.resumenDisponible

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:'#f0f4f8' }}>
      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} }
        @keyframes popIn { from{transform:translateY(20px) scale(.97);opacity:0} to{transform:translateY(0) scale(1);opacity:1} }
        @keyframes geoPulse { 0%,100%{box-shadow:0 0 0 0 rgba(26,86,219,.35)} 50%{box-shadow:0 0 0 18px rgba(26,86,219,0)} }
        @media(max-width:760px){ .content-grid{ grid-template-columns:1fr !important } .sidebar{ order:-1 } }
      `}</style>

      <TopBar expiracion={expiracion} />

      {/* Notice bar */}
      <div style={{
        padding:'10px 28px',
        background:'#fff7ed',borderBottom:'1px solid #fed7aa',
        fontSize:12,fontWeight:600,color:'#9a3412',
        display:'flex',alignItems:'center',gap:10,
      }}>
        <span>⚠️</span>
        Este resumen no contiene diagnósticos, prediagnósticos ni recomendaciones clínicas. Solo refleja las observaciones del tutor.
      </div>

      {/* Patient hero */}
      <div style={{
        background:'linear-gradient(135deg,#0f2d52 0%,#1a3a6e 50%,#1a56db 100%)',
        padding:'36px 28px 40px',
        position:'relative',overflow:'hidden',
      }}>
        <div style={{
          position:'absolute',right:-60,top:-60,
          width:240,height:240,borderRadius:'50%',
          background:'rgba(255,255,255,.04)',pointerEvents:'none',
        }}/>
        <div style={{maxWidth:960,margin:'0 auto',position:'relative',zIndex:1}}>
          <div style={{
            display:'inline-flex',alignItems:'center',gap:6,
            background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.18)',
            borderRadius:20,padding:'4px 14px',
            fontSize:11,fontWeight:700,color:'rgba(255,255,255,.8)',
            textTransform:'uppercase',letterSpacing:'.7px',marginBottom:14,
          }}>🌐 Acceso web temporal · Sin registro requerido</div>

          <div style={{
            fontFamily:"'Instrument Serif',serif",
            fontSize:38,color:'#fff',lineHeight:1.1,marginBottom:6,
          }}>
            {bitacora?.nombreMenor || 'Paciente'}
            {bitacora?.edadMenor ? `, ${bitacora.edadMenor} años` : ''}
          </div>

          {(bitacora?.nombreTutor || bitacora?.nombreMedico) && (
            <div style={{fontSize:13,color:'rgba(255,255,255,.55)'}}>
              {bitacora.nombreTutor && <>Compartido por <strong style={{color:'rgba(255,255,255,.85)',fontWeight:600}}>{bitacora.nombreTutor} (Tutor)</strong></>}
              {(bitacora?.nombreMedico || nombreMedicoNav) && <> · Para <strong style={{color:'rgba(255,255,255,.85)',fontWeight:600}}>{bitacora?.nombreMedico || nombreMedicoNav}</strong></>}
            </div>
          )}

          <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:20}}>
            {[
              { text:`📋 ${obs.length} interacciones incluidas` },
              { text:'🔒 Datos anonimizados' },
              ...(!iaOk && !loadingR ? [{ text:'⚠️ Resumen no disponible', warn:true }] : []),
            ].map((chip,i) => (
              <div key={i} style={{
                display:'flex',alignItems:'center',gap:6,
                background: chip.warn ? 'rgba(239,68,68,.18)' : 'rgba(255,255,255,.09)',
                border:`1px solid ${chip.warn ? 'rgba(239,68,68,.3)' : 'rgba(255,255,255,.14)'}`,
                borderRadius:10,padding:'7px 13px',
                fontSize:12,fontWeight:500,
                color: chip.warn ? '#fca5a5' : 'rgba(255,255,255,.8)',
              }}>{chip.text}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Session expired */}
      {expirado && (
        <div style={{
          background:'#fef2f2',borderBottom:'1px solid #fecaca',
          padding:'10px 28px',
          display:'flex',alignItems:'center',gap:10,
          fontSize:12,fontWeight:600,color:'#991b1b',
        }}>
          ⛔ Sesión expirada · El enlace temporal ha vencido. Ya no puedes acceder a esta bitácora.
        </div>
      )}

      {/* Grid */}
      <div className="content-grid" style={{
        maxWidth:980,margin:'0 auto',width:'100%',
        padding:'28px 24px 60px',
        display:'grid',
        gridTemplateColumns:'1fr 300px',
        gap:20,
        alignItems:'start',
        flex:1,
      }}>

        {/* ── LEFT ── */}
        <div>

          {/* AI fail banner */}
          {!loadingR && !iaOk && (
            <div style={{
              background:'#fff7ed',border:'1.5px solid #fed7aa',
              borderRadius:16,padding:'22px 24px',marginBottom:18,
              display:'flex',gap:16,alignItems:'flex-start',
            }}>
              <div style={{
                width:44,height:44,background:'#fef3c7',borderRadius:12,
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:22,flexShrink:0,
              }}>⚠️</div>
              <div>
                <div style={{fontSize:15,fontWeight:800,color:'#92400e',marginBottom:5}}>
                  El resumen de IA no está disponible
                </div>
                <div style={{fontSize:13,color:'#b45309',lineHeight:1.7}}>
                  {resumen?.mensaje || 'El servicio de inteligencia artificial no pudo generar el resumen en este momento.'}<br/>
                  A continuación puedes revisar directamente las <strong>observaciones completas</strong> registradas por el tutor.
                </div>
              </div>
            </div>
          )}

          {/* AI Summary card */}
          {loadingR && (
            <div style={{background:'#fff',borderRadius:16,border:'1px solid #e2e8f0',overflow:'hidden',marginBottom:18}}>
              <Spinner/>
            </div>
          )}

          {!loadingR && iaOk && (
            <div style={{background:'#fff',borderRadius:16,border:'1px solid #e2e8f0',overflow:'hidden',marginBottom:18}}>

              {/* AI stripe */}
              <div style={{
                background:'linear-gradient(90deg,#ebf2ff,#ecfeff)',
                borderBottom:'1px solid #bfdbfe',
                padding:'11px 20px',
                display:'flex',alignItems:'center',gap:9,
                fontSize:12,color:'#1a56db',fontWeight:600,
              }}>✨ &nbsp;Resumen clínico generado por IA · KidCare</div>

              {/* Card header */}
              <div style={{
                padding:'14px 20px',borderBottom:'1px solid #e2e8f0',
                display:'flex',alignItems:'center',gap:10,
              }}>
                <div style={{
                  width:34,height:34,borderRadius:10,background:'#ebf2ff',
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,
                }}>📋</div>
                <div style={{fontSize:14,fontWeight:700,color:'#0f172a',flex:1}}>Resumen para consulta</div>
                <span style={{
                  fontSize:10,fontWeight:700,padding:'3px 10px',
                  borderRadius:20,background:'#d1fae5',color:'#065f46',
                }}>Disponible</span>
              </div>

              <div style={{padding:20}}>

                {/* Motivo */}
                <div style={{marginBottom:22}}>
                  <SecLabel>📌 Motivo de consulta</SecLabel>
                  <div style={{fontSize:14,color:'#1e293b',lineHeight:1.7}}>{resumen.motivo || resumen.resumen}</div>
                </div>
                <Divider/>

                {/* Síntomas */}
                <div style={{marginBottom:22}}>
                  <SecLabel>🔴 Síntomas registrados</SecLabel>
                  {resumen.sintomas?.length > 0 && (
                    <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:10}}>
                      {resumen.sintomas.map((s,i) => (
                        <Tag key={i} color={s.color||'gray'}>{s.label||s}</Tag>
                      ))}
                    </div>
                  )}
                  {resumen.sintomasDesc && (
                    <div style={{fontSize:14,color:'#1e293b',lineHeight:1.7,marginTop:10}}>
                      {resumen.sintomasDesc}
                    </div>
                  )}
                </div>
                <Divider/>

                {/* Evolución */}
                {resumen.evolucion && (
                  <>
                    <div style={{marginBottom:22}}>
                      <SecLabel>📈 Evolución</SecLabel>
                      <div style={{fontSize:14,color:'#1e293b',lineHeight:1.7}}>{resumen.evolucion}</div>
                    </div>
                    <Divider/>
                  </>
                )}

                {/* Medicación */}
                <div style={{marginBottom:22}}>
                  <SecLabel>💊 Medicación administrada</SecLabel>
                  <div style={{fontSize:14,color:'#1e293b',lineHeight:1.7}}>
                    {resumen.medicacion || 'Sin medicación administrada según los registros del tutor.'}
                  </div>
                </div>
                <Divider/>

                {/* Antecedentes */}
                <div style={{marginBottom:22}}>
                  <SecLabel>🏥 Antecedentes</SecLabel>
                  <div style={{fontSize:14,color:'#1e293b',lineHeight:1.7}}>
                    {resumen.antecedentes || 'Sin antecedentes crónicos conocidos mencionados en los registros.'}
                  </div>
                </div>
                <Divider/>

                {/* Escala malestar */}
                <div>
                  <SecLabel>😣 Escala de malestar — último registro</SecLabel>
                  <PainTrack value={resumen.escalaMalestar ?? 6}/>
                </div>

              </div>
            </div>
          )}

          {/* Observations timeline */}
          <div style={{background:'#fff',borderRadius:16,border:'1px solid #e2e8f0',overflow:'hidden'}}>
            <div style={{
              padding:'14px 20px',borderBottom:'1px solid #e2e8f0',
              display:'flex',alignItems:'center',gap:10,
            }}>
              <div style={{
                width:34,height:34,borderRadius:10,background:'#fef3c7',
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,
              }}>📒</div>
              <div style={{fontSize:14,fontWeight:700,color:'#0f172a',flex:1}}>Observaciones del tutor</div>
              {!loadingR && !iaOk && (
                <span style={{
                  fontSize:10,fontWeight:700,padding:'3px 10px',
                  borderRadius:20,background:'#fef3c7',color:'#92400e',
                }}>Sin procesar por IA</span>
              )}
            </div>

            <div style={{padding:20}}>
              {loadingB && <Spinner/>}

              {!loadingB && obs.length === 0 && (
                <div style={{color:'#94a3b8',fontSize:14,textAlign:'center',padding:'24px 0'}}>
                  No hay observaciones registradas.
                </div>
              )}

              {!loadingB && obs.length > 0 && (
                <div style={{display:'flex',flexDirection:'column'}}>
                  {obs.map((ob, idx) => {
                    const esBot = ob.origen === 'CHATBOT'
                    const isLast = idx === obs.length - 1
                    return (
                      <div key={ob.observacionId} style={{display:'flex',gap:14,paddingBottom:isLast?0:20}}>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                          <div style={{
                            width:12,height:12,borderRadius:'50%',flexShrink:0,marginTop:3,
                            background: esBot ? '#1a56db' : '#059669',
                          }}/>
                          {!isLast && <div style={{width:2,flex:1,background:'#e2e8f0',marginTop:4}}/>}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:6}}>
                            <span style={{color: esBot ? '#1a56db' : '#059669', marginRight:8}}>
                              {esBot ? 'Chatbot guiado' : 'Registro manual'}
                            </span>
                            {formatHora(ob.fecha)}
                          </div>
                          <div style={{
                            background:'#f7fafc',border:'1px solid #e2e8f0',
                            borderRadius:12,padding:'13px 15px',
                          }}>
                            {ob.titulo && (
                              <div style={{fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:4}}>
                                {ob.titulo}
                              </div>
                            )}
                            <div style={{fontSize:12,color:'#475569',lineHeight:1.6}}>{ob.contenido}</div>
                            {ob.tags?.length > 0 && (
                              <div style={{display:'flex',flexWrap:'wrap',gap:5,marginTop:8}}>
                                {ob.tags.map((t,ti) => (
                                  <Tag key={ti} color={t.color||'gray'}>{t.label||t}</Tag>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ── SIDEBAR ── */}
        <div className="sidebar">

          {/* AI fail status */}
          {!loadingR && !iaOk && (
            <div style={{
              background:'#fef2f2',border:'1px solid #fecaca',
              borderRadius:13,padding:'14px 16px',marginBottom:16,
              display:'flex',gap:9,
            }}>
              <span style={{fontSize:18,flexShrink:0}}>🔴</span>
              <div style={{fontSize:12,color:'#991b1b',fontWeight:600,lineHeight:1.6}}>
                <strong>Servicio de IA no disponible</strong><br/>
                Las observaciones se muestran en su forma original.
              </div>
            </div>
          )}

          {/* Warning */}
          <div style={{
            background:'#fff7ed',border:'1px solid #fed7aa',borderRadius:13,
            padding:'14px 16px',marginBottom:16,
            fontSize:12,color:'#92400e',fontWeight:600,lineHeight:1.6,
            display:'flex',gap:9,
          }}>
            <span style={{fontSize:18,flexShrink:0}}>⚠️</span>
            <span>Este resumen <strong>no constituye diagnóstico</strong> ni orientación clínica. Fue elaborado a partir de observaciones del tutor.</span>
          </div>

          {/* Geo */}
          <div style={{
            background:'#ecfdf5',border:'1px solid #bbf7d0',borderRadius:13,
            padding:'14px 16px',marginBottom:16,
            fontSize:12,color:'#14532d',fontWeight:600,lineHeight:1.6,
            display:'flex',gap:9,
          }}>
            <span style={{fontSize:18,flexShrink:0}}>📍</span>
            <span>Acceso verificado · dentro de 100 m del tutor · Tu posición <strong>no fue almacenada</strong>.</span>
          </div>

          {/* Patient card */}
          <div style={{background:'#fff',borderRadius:16,border:'1px solid #e2e8f0',overflow:'hidden',marginBottom:16}}>
            <div style={{
              padding:'14px 20px',borderBottom:'1px solid #e2e8f0',
              display:'flex',alignItems:'center',gap:10,
            }}>
              <div style={{
                width:34,height:34,borderRadius:10,background:'#ebf2ff',
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,
              }}>👦</div>
              <div style={{fontSize:14,fontWeight:700,color:'#0f172a'}}>Datos del paciente</div>
            </div>
            <div style={{padding:'0 18px'}}>
              {[
                { icon:'🧒', label:'Nombre',             val: bitacora?.nombreMenor || '—' },
                { icon:'🎂', label:'Edad',               val: bitacora?.edadMenor ? `${bitacora.edadMenor} años` : '—' },
                { icon:'⚕️', label:'Alergias',           val: bitacora?.alergias || 'Ninguna registrada' },
                { icon:'📋', label:'Condiciones previas', val: bitacora?.condiciones || 'Ninguna registrada' },
                { icon:'👩', label:'Tutor',              val: bitacora?.nombreTutor || '—' },
              ].map((r,i,arr) => (
                <div key={i} style={{
                  display:'flex',alignItems:'flex-start',gap:11,
                  padding:'11px 0',
                  borderBottom: i < arr.length-1 ? '1px solid #e2e8f0' : 'none',
                }}>
                  <span style={{fontSize:17,flexShrink:0,marginTop:1}}>{r.icon}</span>
                  <div>
                    <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',color:'#94a3b8'}}>{r.label}</div>
                    <div style={{fontSize:13,fontWeight:600,color:'#1e293b',marginTop:2,lineHeight:1.4}}>{r.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Access card */}
          <div style={{background:'#fff',borderRadius:16,border:'1px solid #e2e8f0',overflow:'hidden'}}>
            <div style={{
              padding:'14px 20px',borderBottom:'1px solid #e2e8f0',
              display:'flex',alignItems:'center',gap:10,
            }}>
              <div style={{
                width:34,height:34,borderRadius:10,background:'#ecfdf5',
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,
              }}>🔗</div>
              <div style={{fontSize:14,fontWeight:700,color:'#0f172a'}}>Información del acceso</div>
            </div>
            <div style={{padding:'0 18px'}}>
              {[
                { icon:'🩺', label:'Médico',         val: bitacora?.nombreMedico || nombreMedicoNav || '—' },
                { icon:'🕐', label:'Enlace generado', val: bitacora?.horaGenerado || '—' },
                { icon:'⏱️', label:'Expira a las',    val: formatExpira(expiracion) },
                { icon:'🔒', label:'Tipo de acceso',  val: 'Solo lectura · Sin registro' },
              ].map((r,i,arr) => (
                <div key={i} style={{
                  display:'flex',alignItems:'flex-start',gap:11,
                  padding:'11px 0',
                  borderBottom: i < arr.length-1 ? '1px solid #e2e8f0' : 'none',
                }}>
                  <span style={{fontSize:17,flexShrink:0,marginTop:1}}>{r.icon}</span>
                  <div>
                    <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',color:'#94a3b8'}}>{r.label}</div>
                    <div style={{fontSize:13,fontWeight:600,color:'#1e293b',marginTop:2,lineHeight:1.4}}>
                      {r.label === 'Expira a las'
                        ? <>{r.val} &nbsp;<span style={{color:'#94a3b8'}}>({timerDisplay})</span></>
                        : r.val
                      }
                    </div>
                  </div>
                </div>
              ))}
              <div style={{
                textAlign:'center',padding:'14px 0',
                borderTop:'1px solid #e2e8f0',
                fontSize:11,color:'#94a3b8',lineHeight:1.8,
              }}>
                <div style={{
                  fontFamily:"'Instrument Serif',serif",
                  fontSize:14,color:'#475569',display:'block',marginBottom:2,
                }}>🧒 KidCare</div>
                Bitácora de síntomas pediátricos<br/>
                Ley 19.628 · Privacidad garantizada
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background:'#0f2d52',padding:'22px 28px',
        textAlign:'center',fontSize:11,color:'rgba(255,255,255,.28)',lineHeight:2,
      }}>
        KidCare — Sistema de Bitácora de Síntomas Pediátricos<br/>
        Francisco Monsalve · Benjamín Peña · Génesis Rojas<br/>
        Acceso temporal · Datos anonimizados · Ley 19.628 · Ley 21.663 · Este documento no emite diagnósticos ni recomendaciones clínicas.
      </footer>
    </div>
  )
}
