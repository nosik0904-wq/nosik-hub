import { useState } from 'react'
import { useHub } from '../context/HubContext'

export function WelcomeScreen() {
  const { enterMode } = useHub()
  return (
    <div className="screen active" id="sw">
      <div className="wl-logo">
        <h1>NOSIK</h1>
        <div className="tag">Household Operating System</div>
      </div>
      <div className="wl-msg">
        <h2>Your Hub is ready. 👋</h2>
        <p>Five starter widgets are set up — Today, Next 7 Days, Groceries, Tasks, and Alerts. Customise everything later.</p>
        <div className="wl-widgets">
          {['📅 Today','📆 Next 7 Days','🛒 Groceries','✅ Tasks','🔔 Alerts'].map(w => (
            <div key={w} className="wl-wdg">{w}</div>
          ))}
        </div>
      </div>
      <div className="wl-btns">
        <button className="wl-primary" onClick={() => enterMode('family')}>Start using NOSIK →</button>
        <button className="wl-sec"    onClick={() => enterMode('family')}>Set up my Hub first</button>
        <div style={{fontSize:'.62rem',color:'var(--tx3)'}}>NOSIK will suggest helpful features as you go.</div>
      </div>
    </div>
  )
}

export function LockScreen() {
  const { login, enterMode } = useHub()
  const [buf, setBuf]       = useState('')
  const [msg, setMsg]       = useState('Enter your PIN')

  function pk(d) {
    if (!d || buf.length >= 4) return
    const next = buf + d
    setBuf(next)
    if (next.length === 4) {
      setTimeout(() => {
        if (!login(next)) {
          setMsg('Wrong PIN — try again')
          setBuf('')
        } else {
          setBuf('')
          setMsg('Enter your PIN')
        }
      }, 180)
    }
  }

  function pdel() {
    setBuf(b => b.slice(0, -1))
    setMsg('Enter your PIN')
  }

  const QUICK = [
    { label: '👔 Carl 1234',    mode: 'carl'    },
    { label: '👩 Kim 5678',     mode: 'kim'     },
    { label: '🎮 Mason 1111',   mode: 'mason'   },
    { label: '⚽ Jaxon 2222',   mode: 'jaxon'   },
    { label: '👵 Nan 2468',     mode: 'nan'     },
    { label: '💜 Sarah 8642',   mode: 'carer'   },
    { label: '🏠 Visitor 9090', mode: 'visitor' },
  ]

  return (
    <div className="screen active" id="sl">
      <div className="ll">
        <h1>NOSIK</h1>
        <p>Household Operating System</p>
      </div>

      <div className="pin-pad">
        <div className="pin-dots">
          {[0,1,2,3].map(i => (
            <div key={i} className={`pin-dot ${i < buf.length ? 'filled' : ''}`} />
          ))}
        </div>
        <div className="pin-disp">{msg}</div>
        <div className="pin-grid">
          {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k, i) => (
            <button
              key={i}
              className={`pb ${k === '⌫' ? 'del' : ''}`}
              onClick={() => k === '⌫' ? pdel() : pk(String(k))}
            >{k}</button>
          ))}
        </div>
      </div>

      <div className="qa">
        <div className="lh" style={{width:'100%',marginBottom:'.2rem'}}>Quick access — demo PINs:</div>
        {QUICK.map(q => (
          <button key={q.mode} className="qb" onClick={() => enterMode(q.mode)}>{q.label}</button>
        ))}
      </div>
      <button className="qb" style={{marginTop:'.2rem',borderColor:'rgba(255,255,255,.15)',color:'var(--tx3)'}}
        onClick={() => enterMode('family')}>← Back to Family View</button>
    </div>
  )
}
