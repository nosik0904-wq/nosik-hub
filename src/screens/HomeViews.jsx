import { useState } from 'react'
import { useHub } from '../context/HubContext'
import TopBar from '../components/TopBar'
import SideMenu from '../components/SideMenu'
import { Ticker } from '../components/Overlays'

function CheckItem({ text, defaultDone = false }) {
  const [done, setDone] = useState(defaultDone)
  return (
    <div className="ci" onClick={() => setDone(d => !d)}>
      <div className={`cb ${done ? 'chk' : ''}`}>{done ? '✓' : ''}</div>
      <div className={`ct ${done ? 'done' : ''}`}>{text}</div>
    </div>
  )
}

function FocusStrip({ text }) {
  return (
    <div className="fs">
      <div className="ico">📌</div>
      <div>
        <div className="fs-lbl">Today's Focus</div>
        <div className="fs-txt">{text}</div>
      </div>
    </div>
  )
}

export function FamilyView() {
  const { navTo } = useHub()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="screen active">
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <TopBar onMenu={() => setMenuOpen(true)} />
      <div className="cnt">
        <FocusStrip text="Bins out tonight · Jaxon soccer 5:30pm · Milk needed · Mason's birthday tomorrow 🎂" />
        <div className="wg">
          {/* TODAY */}
          <div className="w">
            <div className="wh">
              <div className="wi bg-bl"><span className="c-bl">📅</span></div>
              <div className="wt" onClick={() => navTo('calendar')}>Today</div>
              <div className="wc">4 events</div>
            </div>
            <div className="it-row"><div className="dot d-bl"/><div><div className="it-t">School — normal day</div><div className="it-s">All kids · 8:30 AM</div></div></div>
            <div className="it-row"><div className="dot d-cu"/><div><div className="it-t">Jaxon soccer training</div><div className="it-s">Suncorp · 5:30 PM</div></div><div className="itag bc-cu">🚗 Dad</div></div>
            <div className="it-row"><div className="dot d-am"/><div><div className="it-t">Bins night 🗑️</div><div className="it-s">Before dark</div></div></div>
            <div className="it-row"><div className="dot d-gn"/><div><div className="it-t">Family dinner · Pasta bake</div><div className="it-s">7:00 PM</div></div></div>
          </div>

          {/* NEXT 7 DAYS */}
          <div className="w">
            <div className="wh">
              <div className="wi bg-cu"><span className="c-cu">📆</span></div>
              <div className="wt" onClick={() => navTo('calendar')}>Next 7 Days</div>
            </div>
            <div className="it-row"><div className="dot d-gn"/><div><div className="it-t">🎂 Mason's birthday — 14!</div><div className="it-s">Thursday</div></div></div>
            <div className="it-row"><div className="dot d-bl"/><div><div className="it-t">School sports day</div><div className="it-s">Friday · all kids</div></div></div>
            <div className="it-row"><div className="dot d-cu"/><div><div className="it-t">Nan visiting 🤗</div><div className="it-s">Saturday 10 AM</div></div></div>
            <div className="it-row"><div className="dot d-am"/><div><div className="it-t">Recycle bins 🗑️</div><div className="it-s">Next Wednesday</div></div></div>
          </div>

          {/* GROCERIES */}
          <div className="w">
            <div className="wh">
              <div className="wi bg-gn"><span className="c-gn">🛒</span></div>
              <div className="wt" onClick={() => navTo('groceries')}>Groceries</div>
              <div className="wc">5 items</div>
            </div>
            <CheckItem text="Bread" defaultDone />
            <CheckItem text="Milk — 2L full cream" />
            <CheckItem text="Pasta — penne" />
            <CheckItem text="Canned tomatoes × 3" />
            <CheckItem text="Apples × 6" />
            <button className="add-btn" onClick={() => navTo('groceries')}>＋ Full list / Add item</button>
          </div>

          {/* TASKS */}
          <div className="w">
            <div className="wh">
              <div className="wi bg-am"><span className="c-am">✅</span></div>
              <div className="wt" onClick={() => navTo('tasks')}>Chores Today</div>
              <div className="wc">4 jobs</div>
            </div>
            <CheckItem text="Dishes (Mason)" defaultDone />
            <CheckItem text="Take bins out (Jaxon)" />
            <CheckItem text="Vacuum lounge (Mason)" />
            <CheckItem text="Tidy toys (Easton + Hudson)" />
            <button className="add-btn" onClick={() => navTo('tasks')}>＋ See all tasks</button>
          </div>

          {/* ALERTS */}
          <div className="w full">
            <div className="wh">
              <div className="wi bg-rd"><span className="c-rd">🔔</span></div>
              <div className="wt" onClick={() => navTo('alerts')}>Alerts</div>
              <div className="wc">2 active</div>
            </div>
            <div className="al al-n"><div className="al-ico">💬</div><div><div className="al-txt">Please bring washing in before dinner.</div><div className="al-meta">NUDGE · Kim · 3:15 PM</div></div></div>
            <div className="al al-k"><div className="al-ico">🔔</div><div><div className="al-txt">Bins need to go out before dark — Jaxon's job!</div><div className="al-meta">KNOCK · Carl · 4:10 PM</div></div></div>
          </div>
        </div>
      </div>
      <Ticker messages={[
        { label: 'NUDGE', text: ' Ready when you are. Tap any widget heading to see the full page.' },
        { label: 'TODAY', text: ' Bins out tonight · Soccer 5:30 PM · Pasta bake · Mason\'s birthday tomorrow 🎂' },
      ]} />
    </div>
  )
}

export function ParentView() {
  const { mode, navTo, sendBlast, sendAlert } = useHub()
  const [menuOpen, setMenuOpen] = useState(false)
  const [blastMsg, setBlastMsg] = useState('')
  const name = mode === 'kim' ? 'Kim' : 'Carl'

  return (
    <div className="screen active">
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <TopBar onMenu={() => setMenuOpen(true)} />
      <div className="cnt">
        <FocusStrip text={`Easton therapy 12:30 · Soccer 5:30 — ${name === 'Carl' ? 'you\'re driving' : 'Carl driving'} · Electricity $312 due Fri · Car rego due 15 May ⚠️`} />
        <div className="wg">

          {/* TODAY — full parent detail */}
          <div className="w">
            <div className="wh"><div className="wi bg-bl"><span className="c-bl">📅</span></div><div className="wt" onClick={() => navTo('calendar')}>Today</div><div className="wc">6 events</div></div>
            <div className="it-row"><div className="dot d-bl"/><div><div className="it-t">School — normal day</div><div className="it-s">All kids · 8:30 AM</div></div></div>
            <div className="it-row"><div className="dot d-pu"/><div><div className="it-t">Easton therapy — Dr Nguyen</div><div className="it-s">12:30 PM · Kim attending</div></div><div className="ppill">🔒 Parents</div></div>
            <div className="it-row"><div className="dot d-cu"/><div><div className="it-t">Jaxon soccer training</div><div className="it-s">Suncorp · 5:30 PM</div></div><div className="itag bc-cu">{name === 'Carl' ? '🚗 You' : '🚗 Carl'}</div></div>
            <div className="it-row"><div className="dot d-am"/><div><div className="it-t">Bins night 🗑️</div><div className="it-s">Jaxon's job</div></div></div>
            {name === 'Carl' && <div className="it-row"><div className="dot d-rd"/><div><div className="it-t">Anniversary dinner — 14 days</div></div><div className="ppill">🔒 Carl</div></div>}
            <div className="it-row"><div className="dot d-gn"/><div><div className="it-t">Family dinner · Pasta bake</div><div className="it-s">7:00 PM</div></div></div>
          </div>

          {/* BILLS */}
          <div className="w">
            <div className="wh"><div className="wi bg-am"><span className="c-am">💳</span></div><div className="wt" onClick={() => navTo('bills')}>Bills Due</div><div className="wc">3 this week</div></div>
            {[['⚡','Electricity','Fri','$312','c-rd'],['🎵','Spotify Family','Sun','$23',''],['🚗','Car insurance','8 May','$189','']].map(([ico,name,due,amt,cls]) => (
              <div key={name} style={{display:'flex',alignItems:'center',gap:'.4rem',padding:'.22rem 0',borderBottom:'1px solid rgba(255,255,255,.04)'}}>
                <span>{ico}</span><span style={{flex:1,fontSize:'.72rem'}}>{name}</span>
                <span style={{fontSize:'.6rem',color:'var(--tx2)'}}>{due}</span>
                <span style={{fontSize:'.8rem',fontWeight:700,marginLeft:'.4rem'}} className={cls}>{amt}</span>
              </div>
            ))}
            <div className="sr2">
              <div className="stat"><div className="sv c-am">$525</div><div className="sl">This week</div></div>
              <div className="stat"><div className="sv">$1,840</div><div className="sl">This month</div></div>
              <div className="stat"><div className="sv c-gn">+$340</div><div className="sl">Offset</div></div>
            </div>
          </div>

          {/* GROCERIES */}
          <div className="w">
            <div className="wh"><div className="wi bg-gn"><span className="c-gn">🛒</span></div><div className="wt" onClick={() => navTo('groceries')}>Groceries</div><div className="wc">6 items</div></div>
            <CheckItem text="Bread" defaultDone />
            <CheckItem text="Milk — 2L full cream" />
            <CheckItem text="Pasta · Tomatoes · Cheese" />
            <CheckItem text="Mason birthday cake stuff 🎂" />
            <button className="add-btn" onClick={() => navTo('groceries')}>＋ Full list</button>
          </div>

          {/* VAULT */}
          <div className="w">
            <div className="wh"><div className="wi bg-pu"><span className="c-pu">🔐</span></div><div className="wt">Vault Reminders</div></div>
            {[['🚗','Car rego — CX-5','⚠ 15 May','c-am'],['🏠','Home insurance','22 Jan',''],['🛂','Carl passport','Oct 26',''],['🦷','Kids dental','Jun','']].map(([ico,name,due,cls]) => (
              <div key={name} className="vi"><span>{ico}</span><span style={{flex:1,fontSize:'.72rem',marginLeft:'.35rem'}}>{name}</span><span style={{fontSize:'.62rem'}} className={cls}>{due}</span></div>
            ))}
          </div>

          {/* ALERTS + SEND */}
          <div className="w full">
            <div className="wh"><div className="wi bg-rd"><span className="c-rd">🔔</span></div><div className="wt" onClick={() => navTo('alerts')}>Alerts</div><div className="wc">send / manage</div></div>
            <div className="al al-n"><div className="al-ico">💬</div><div><div className="al-txt">Please bring washing in before dinner.</div><div className="al-meta">NUDGE · Kim · 3:15 PM</div></div></div>
            <div className="al al-k"><div className="al-ico">🔔</div><div><div className="al-txt">Bins out before dark — Jaxon's job!</div><div className="al-meta">KNOCK · Carl · 4:10 PM · ✓ Accepted by Jaxon 4:18</div></div></div>
            <div className="slbl" style={{marginTop:'.25rem'}}>Send alert</div>
            <div className="alc">
              <button className="acb" onClick={() => sendAlert('nudge','Please pay attention.')}>💬 Nudge</button>
              <button className="acb" onClick={() => sendAlert('knock','Important notice.')}>🔔 Knock</button>
              <button className="acb blast" onClick={() => sendBlast(blastMsg || 'ATTENTION!')}>🚨 Blast</button>
            </div>
            <div className="brow">
              <input className="binp" placeholder="Type a Blast message…" value={blastMsg} onChange={e => setBlastMsg(e.target.value)} />
              <button className="bsnd" onClick={() => sendBlast(blastMsg || 'ATTENTION!')}>🚨 Send</button>
            </div>
          </div>

          {/* ASSIST */}
          <div className="asc full">
            <div className="asl">✨ NOSIK Assist</div>
            <div style={{fontSize:'.74rem',color:'var(--tx)',lineHeight:1.4}}>You added "car rego" to the Vault. Want me to turn on Vehicle Tracking so rego, insurance, and servicing stay together?</div>
            <div className="asb"><button className="asyes">✓ Turn on Vehicles</button><button className="asno">Not now</button><button className="asno">Don't suggest this</button></div>
          </div>
        </div>
      </div>
      <Ticker messages={[
        { label: 'PARENT', text: ' Car rego 15 May ⚠ · Electricity $312 due Fri · Anniversary — 14 days', color: 'var(--cu)' },
        { label: 'TODAY',  text: ' Easton therapy 12:30 · Soccer 5:30 — driving · Bins tonight',            color: 'var(--cu)' },
      ]} />
    </div>
  )
}
