import { useHub } from '../context/HubContext'
import { HOUSEHOLD } from '../data/demo'

const MODE_CONFIG = {
  family:  { label: '👨‍👩‍👧‍👦 Family View', cls: 'm-fa' },
  carl:    { label: '👔 Carl · Parent',   cls: 'm-pa' },
  kim:     { label: '👩 Kim · Parent',    cls: 'm-pa' },
  mason:   { label: '🎮 Mason Mode',      cls: 'm-ki' },
  jaxon:   { label: '⚽ Jaxon Mode',      cls: 'm-ki' },
  easton:  { label: '🦕 Easton Mode',     cls: 'm-ki' },
  hudson:  { label: '🐣 Hudson Mode',     cls: 'm-ki' },
  nan:     { label: '👵 Nan\'s View',     cls: 'm-gp' },
  carer:   { label: '💜 Easton Care',     cls: 'm-ca' },
  visitor: { label: '🏠 Visitor View',    cls: 'm-vi' },
}

export default function TopBar({ onMenu, showBack = false }) {
  const { mode, isPersonal, time, lockHub, navBack } = useHub()
  const { weather } = HOUSEHOLD
  const cfg = MODE_CONFIG[mode] || MODE_CONFIG.family

  return (
    <div className="tb">
      <div className="tl">
        {showBack
          ? <button className="icon-btn" onClick={navBack} title="Back">←</button>
          : <button className="icon-btn" onClick={onMenu} title="Menu">☰</button>
        }
        <div className="wz">
          <div className="wz-ico">{weather.icon}</div>
          <div>
            <div className="wz-t">{weather.temp}</div>
            <div className="wz-d">{HOUSEHOLD.location} · {weather.desc}</div>
          </div>
        </div>
      </div>

      <div className="tc2">
        <div className="hn">NOSIK Hub</div>
        <div className={`mode-badge ${cfg.cls}`}>{cfg.label}</div>
      </div>

      <div className="tr">
        <div className="tm">{time}</div>
        <div className="dt">Wed, 30 Apr</div>
      </div>

      <button
        className="lkb"
        onClick={lockHub}
        title={isPersonal ? 'Back to Family View' : 'Switch user'}
      >
        {isPersonal ? '✕' : '👤'}
      </button>
    </div>
  )
}
