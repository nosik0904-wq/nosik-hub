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

export function KidMasonView() {
  const { navTo } = useHub()
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="screen active">
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <TopBar onMenu={() => setMenuOpen(true)} />
      <div className="cnt">
        <div className="kg"><div className="emo">👋</div><h2>Hey Mason!</h2><p>Tomorrow's your birthday! 🎂 2 jobs left today.</p></div>
        <div className="kxp"><div>⭐</div><div style={{fontSize:'.7rem',color:'var(--tx2)'}}>This week's points</div><div className="kxp-val">18 pts</div></div>
        <div className="wg">
          <div className="w">
            <div className="wh"><div className="wi bg-am"><span className="c-am">✅</span></div><div className="wt">My Jobs Today</div><div className="wc">2 left</div></div>
            <CheckItem text="Dishes ✅ +3 pts" defaultDone />
            <CheckItem text="Vacuum lounge room" />
          </div>
          <div className="w">
            <div className="wh"><div className="wi bg-bl"><span className="c-bl">📅</span></div><div className="wt">My Today</div></div>
            <div className="it-row"><div className="dot d-bl"/><div><div className="it-t">School</div><div className="it-s">8:30 AM</div></div></div>
            <div className="it-row"><div className="dot d-cu"/><div><div className="it-t">Jaxon soccer · Dad driving</div><div className="it-s">5:30 PM</div></div></div>
            <div className="it-row"><div className="dot d-gn"/><div><div className="it-t">Family dinner — Pasta bake</div><div className="it-s">7:00 PM</div></div></div>
          </div>
          <div className="w full">
            <div className="wh"><div className="wi bg-gn"><span className="c-gn">🛒</span></div><div className="wt" onClick={() => navTo('groceries')}>Groceries</div></div>
            <CheckItem text="Bread" defaultDone />
            <CheckItem text="Milk" />
            <CheckItem text="Pasta · Apples" />
            <button className="add-btn" onClick={() => navTo('groceries')}>＋ Add something we need</button>
          </div>
        </div>
        <div className="al al-k"><div className="al-ico">🔔</div><div><div className="al-txt">Bins out before dark — Jaxon's job tonight!</div><div className="al-meta">KNOCK · Dad · 4:10 PM</div></div></div>
        <button className="req-btn">📨 Send a request to Mum or Dad</button>
        <div className="note">Bills, vault, private appointments and parent notes are hidden in Kid Mode.</div>
      </div>
      <Ticker messages={[
        { label: 'MASON', text: ' Tomorrow is your birthday! 🎂 Vacuum the lounge and you\'re done!', color: 'var(--gn)' },
      ]} />
    </div>
  )
}

export function KidJaxonView() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="screen active">
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <TopBar onMenu={() => setMenuOpen(true)} />
      <div className="cnt">
        <div className="kg"><div className="emo">⚽</div><h2>Hey Jaxon!</h2><p>Soccer at 5:30 — pack your bag! 3 jobs first.</p></div>
        <div className="kxp"><div>⭐</div><div style={{fontSize:'.7rem',color:'var(--tx2)'}}>This week's points</div><div className="kxp-val">12 pts</div></div>
        <div className="wg">
          <div className="w">
            <div className="wh"><div className="wi bg-am"><span className="c-am">✅</span></div><div className="wt">My Jobs</div><div className="wc">3 left</div></div>
            <CheckItem text="Take bins out 🗑️" />
            <CheckItem text="Feed the dog" />
            <CheckItem text="Pack soccer bag" />
          </div>
          <div className="w">
            <div className="wh"><div className="wi bg-cu"><span className="c-cu">⚽</span></div><div className="wt">My Today</div></div>
            <div className="it-row"><div className="dot d-cu"/><div><div className="it-t">⚽ Soccer training!</div><div className="it-s">5:30 PM · Dad driving</div></div></div>
            <div className="it-row"><div className="dot d-gn"/><div><div className="it-t">Family dinner at home</div><div className="it-s">7:00 PM</div></div></div>
          </div>
        </div>
        <div className="al al-k"><div className="al-ico">🔔</div><div><div className="al-txt c-am">Bins out before dark — that's you, Jaxon!</div><div className="al-meta">KNOCK · Dad · 4:10 PM</div></div></div>
        <button className="req-btn">📨 Ask Mum or Dad something</button>
      </div>
      <Ticker messages={[{ label: 'JAXON', text: ' Soccer at 5:30 — pack your bag! · Bins out before dark · Feed the dog first', color: 'var(--gn)' }]} />
    </div>
  )
}

export function NanView() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="screen active">
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <TopBar onMenu={() => setMenuOpen(true)} />
      <div className="cnt">
        <div className="gpw"><div style={{fontSize:'1.7rem'}}>🤗</div><h3>Hi Nan!</h3><p>The family is looking forward to seeing you this Saturday.</p></div>
        <div className="wg">
          <div className="w full">
            <div className="wh"><div className="wi bg-bl"><span className="c-bl">📅</span></div><div className="wt">Family Calendar</div></div>
            <div className="it-row"><div className="dot d-gn"/><div><div className="it-t">🎂 Mason's birthday — turning 14!</div><div className="it-s">Tomorrow</div></div></div>
            <div className="it-row"><div className="dot d-bl"/><div><div className="it-t">School sports day</div><div className="it-s">Friday · all kids</div></div></div>
            <div className="it-row"><div className="dot d-cu"/><div><div className="it-t">Nan visiting 🤗</div><div className="it-s">Saturday · arrives 10 AM</div></div></div>
            <div className="it-row"><div className="dot d-cu"/><div><div className="it-t">Jaxon soccer today</div><div className="it-s">5:30 PM</div></div></div>
          </div>
          <div className="w full">
            <div className="wh"><div className="wi bg-gn"><span className="c-gn">👶</span></div><div className="wt">The Kids</div></div>
            <div className="it-row"><div className="dot d-bl"/><div className="it-t">Mason — turning 14 tomorrow 🎂</div></div>
            <div className="it-row"><div className="dot d-cu"/><div className="it-t">Jaxon — soccer player ⚽</div></div>
            <div className="it-row"><div className="dot d-pu"/><div className="it-t">Easton — loves dinosaurs 🦕</div></div>
            <div className="it-row"><div className="dot d-gn"/><div className="it-t">Hudson — the little one 🐣</div></div>
          </div>
          <div className="w full">
            <div className="wh"><div className="wi bg-rd"><span className="c-rd">📞</span></div><div className="wt">Emergency Contacts</div></div>
            <div className="ec"><div>👔</div><div><div style={{fontSize:'.74rem',fontWeight:500}}>Carl (Dad)</div></div><div className="ec-ph">0412 000 001</div></div>
            <div className="ec"><div>👩</div><div><div style={{fontSize:'.74rem',fontWeight:500}}>Kim (Mum)</div></div><div className="ec-ph">0412 000 002</div></div>
          </div>
        </div>
        <div className="note">Bills, finances, private appointments and sensitive details are not shown in Nan's View.</div>
      </div>
      <Ticker messages={[{ label: 'NAN', text: ' Visiting Saturday 10 AM · Mason\'s birthday tomorrow 🎂 · The kids can\'t wait!', color: 'var(--bl)' }]} />
    </div>
  )
}

export function CarerView() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="screen active">
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <TopBar onMenu={() => setMenuOpen(true)} />
      <div className="cnt">
        <div className="w">
          <div className="care-hdr">
            <div className="care-av">E</div>
            <div><div style={{fontFamily:'var(--sf)',fontSize:'.95rem',fontWeight:600}}>Easton's Care View</div><div style={{fontSize:'.6rem',color:'var(--tx2)'}}>Welcome Sarah · Wednesday session</div></div>
            <div className="ppill" style={{marginLeft:'auto'}}>🔒 Care only</div>
          </div>
          <div className="care-grid">
            {[
              ['Schedule',['🏫 School until 3 PM','💜 Session 3:30–5:00 PM','🍝 Dinner 7:00 PM']],
              ['Food Notes',['✅ Pasta is fine','✅ Loves fruit snacks','🚫 No dairy (lactose)']],
              ['Calm-Down',['🦕 Dinosaur toys help','🎧 Headphones if noisy','🚿 Shower to reset']],
              ['Handover',['📋 Check in with Mum','✏️ Leave handover note','📸 Log arrival time']],
            ].map(([lbl, items]) => (
              <div key={lbl} className="cb2">
                <div className="cb2-lbl">{lbl}</div>
                {items.map(it => <div key={it} className="cb2-item">{it}</div>)}
              </div>
            ))}
          </div>
        </div>
        <div className="w">
          <div className="wh"><div className="wi bg-rd"><span className="c-rd">📞</span></div><div className="wt">Emergency Contacts</div></div>
          {[['👩','Kim (Mum)','Primary contact','0412 000 002'],['👔','Carl (Dad)','Secondary','0412 000 001'],['🏥','Dr Nguyen','Easton\'s specialist','07 3000 0001']].map(([ico,name,role,ph]) => (
            <div key={name} className="ec"><div>{ico}</div><div><div style={{fontSize:'.74rem',fontWeight:500}}>{name}</div><div style={{fontSize:'.6rem',color:'var(--tx2)'}}>{role}</div></div><div className="ec-ph">{ph}</div></div>
          ))}
        </div>
        <div className="note">Easton's care information only. All other family data is hidden.</div>
      </div>
      <Ticker messages={[{ label: 'CARE', text: ' Session 3:30–5:00 PM · No dairy · Dinosaur toys help · Leave handover note', color: 'var(--pu)' }]} />
    </div>
  )
}

export function VisitorView() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="screen active">
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <TopBar onMenu={() => setMenuOpen(true)} />
      <div className="cnt">
        <div className="fs"><div className="ico">🏠</div><div><div className="fs-lbl">Tonight</div><div className="fs-txt">Kids home by 6 PM · Pasta bake dinner · Parents back by 9 PM · Easton — no dairy ⚠️</div></div></div>
        <div className="wg">
          <div className="w">
            <div className="wh"><div className="wi bg-bl"><span className="c-bl">📋</span></div><div className="wt">House Rules</div></div>
            <div className="it-row"><div className="dot d-am"/><div className="it-t">No screens after 8 PM</div></div>
            <div className="it-row"><div className="dot d-am"/><div className="it-t">No friends over tonight</div></div>
            <div className="it-row"><div className="dot d-am"/><div className="it-t">Homework before games</div></div>
            <div className="it-row"><div className="dot d-gn"/><div className="it-t">Snacks in pantry — help yourself</div></div>
          </div>
          <div className="w">
            <div className="wh"><div className="wi bg-am"><span className="c-am">🌙</span></div><div className="wt">Bedtimes</div></div>
            {[['d-bl','Mason (13) — 9:30 PM'],['d-cu','Jaxon (11) — 9:00 PM'],['d-pu','Easton (8) — 8:00 PM'],['d-gn','Hudson (5) — 7:30 PM']].map(([dot,txt]) => (
              <div key={txt} className="it-row"><div className={`dot ${dot}`}/><div className="it-t">{txt}</div></div>
            ))}
          </div>
          <div className="w">
            <div className="wh"><div className="wi bg-gn"><span className="c-gn">🍝</span></div><div className="wt">Dinner Tonight</div></div>
            <div className="it-row"><div className="dot d-gn"/><div className="it-t">Pasta bake — in the oven</div></div>
            <div className="it-row"><div className="dot d-cu"/><div className="it-t">Garlic bread in freezer</div></div>
            <div className="it-row"><div className="dot d-am"/><div className="it-t">⚠️ Easton — no dairy please</div></div>
          </div>
          <div className="w">
            <div className="wh"><div className="wi bg-rd"><span className="c-rd">📞</span></div><div className="wt">Emergency</div></div>
            {[['👔','Carl (Dad)','0412 000 001'],['👩','Kim (Mum)','0412 000 002'],['🏥','Emergency','000']].map(([ico,name,ph]) => (
              <div key={name} className="ec"><div>{ico}</div><div><div style={{fontSize:'.74rem',fontWeight:500}}>{name}</div></div><div className="ec-ph">{ph}</div></div>
            ))}
          </div>
        </div>
      </div>
      <Ticker messages={[{ label: 'VISITOR', text: ' Kids home by 6 · Pasta bake · No dairy for Easton · Parents back 9 PM · 000', color: 'var(--am)' }]} />
    </div>
  )
}
