import { useHub } from '../context/HubContext'

export function BlastOverlay() {
  const { blast, dismissBlast, time } = useHub()
  if (!blast) return null

  return (
    <div className="bov active">
      <div className="b-emoji">🚨</div>
      <div className="b-lbl">NOSIK BLAST</div>
      <div className="b-txt">{blast.text}</div>
      <div className="b-from">From: {blast.from} · {time}</div>
      <button className="b-acc" onClick={dismissBlast}>✓ Accept — I'm on it</button>
    </div>
  )
}

export function Ticker({ messages }) {
  const doubled = [...messages, ...messages]
  return (
    <div className="ticker">
      <div className="ticker-inner">
        {doubled.map((m, i) => (
          <span key={i} className="tmsg">
            <span className="lbl" style={m.color ? { color: m.color } : {}}>{m.label}</span>
            {m.text}
          </span>
        ))}
      </div>
    </div>
  )
}
