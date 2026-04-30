import { useState } from 'react'
import { useHub } from '../context/HubContext'
import TopBar from '../components/TopBar'
import { CALENDAR_EVENTS, BILLS, MAINTENANCE, ALERTS_HISTORY } from '../data/demo'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// ── CALENDAR ──────────────────────────────────────────
export function CalendarPage() {
  const { isParent, mode } = useHub()
  const today = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState({ y: today.getFullYear(), m: today.getMonth() + 1, d: today.getDate() })

  function prevMonth() { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  function nextMonth() { if (month === 11) { setMonth(0);  setYear(y => y + 1) } else setMonth(m => m + 1) }

  const firstDay = new Date(year, month, 1).getDay()
  const offset   = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const selKey = `${selected.y}-${selected.m}-${selected.d}`
  const selEvs = (CALENDAR_EVENTS[selKey] || []).filter(e =>
    e.vis === 'household' || isParent || e.vis === mode
  )

  function canSee(ev) {
    return ev.vis === 'household' || isParent || ev.vis === mode
  }

  function hasDot(day) {
    const key = `${year}-${month + 1}-${day}`
    return (CALENDAR_EVENTS[key] || []).some(canSee)
  }

  function dotColor(day) {
    const key = `${year}-${month + 1}-${day}`
    const evs = (CALENDAR_EVENTS[key] || []).filter(canSee)
    return evs[0]?.color || 'var(--cu)'
  }

  return (
    <div className="screen active" style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <TopBar showBack />

      <div className="cal-header">
        <div className="cal-month">{MONTHS[month]} {year}</div>
        <div className="cal-nav">
          <button onClick={prevMonth}>‹</button>
          <button onClick={nextMonth}>›</button>
        </div>
      </div>

      <div className="cal-grid-wrap">
        <div className="cal-daynames">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <div key={d} className="cal-dn">{d}</div>)}
        </div>
        <div className="cal-grid">
          {Array.from({ length: offset }).map((_, i) => <div key={`p${i}`} className="cal-day other-month" />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
            const isSel   = selected.y === year && selected.m === month + 1 && selected.d === day
            const dot     = hasDot(day)
            return (
              <div
                key={day}
                className={`cal-day ${isToday ? 'today' : ''} ${isSel ? 'selected' : ''}`}
                onClick={() => setSelected({ y: year, m: month + 1, d: day })}
              >
                <div className="cal-num">{day}</div>
                {dot && <div className="cal-dots"><div className="cal-dot" style={{ background: dotColor(day) }} /></div>}
              </div>
            )
          })}
        </div>
      </div>

      <div className="cal-events">
        <div className="cal-ev-header">
          {selected.d} {SHORT_MONTHS[selected.m - 1]} {selected.y}
          {selEvs.length ? ` — ${selEvs.length} event${selEvs.length > 1 ? 's' : ''}` : ' — No events'}
        </div>
        {selEvs.map((ev, i) => (
          <div key={i} className="cal-ev">
            <div className="cal-ev-bar" style={{ background: ev.color }} />
            <div className="cal-ev-time">{ev.time || 'All day'}</div>
            <div className="cal-ev-body">
              <div className="cal-ev-title">{ev.title}</div>
              {ev.sub && <div className="cal-ev-sub">{ev.sub}</div>}
            </div>
            {ev.vis !== 'household' && <div className="cal-ev-vis">🔒 {ev.vis}</div>}
          </div>
        ))}
        {isParent && (
          <button className="add-btn" style={{ marginTop: '.4rem' }}>＋ Add event on this day</button>
        )}
      </div>
    </div>
  )
}

// ── TASKS ──────────────────────────────────────────────
const MEMBER_COLORS = { mason:'#5b9bd5',jaxon:'#d4845a',easton:'#9b7ec8',hudson:'#4caf87',carl:'#f0b429',kim:'#e05a5a' }
const MEMBER_INIT   = { mason:'M',jaxon:'J',easton:'E',hudson:'H',carl:'C',kim:'K' }
const URGENCY_COLORS = { done:'var(--gn)',urgent:'var(--rd)',normal:'var(--am)' }

export function TasksPage() {
  const { tasks, toggleTask, isParent } = useHub()
  const [filter, setFilter] = useState('all')
  const FILTERS = ['all','carl','kim','mason','jaxon','easton','hudson']

  const visible = filter === 'all' ? tasks : tasks.filter(t => t.who === filter)

  return (
    <div className="screen active">
      <TopBar showBack />
      <div className="ptabs">
        {FILTERS.map(f => (
          <div key={f} className={`ptab ${filter === f ? 'on' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </div>
        ))}
      </div>
      <div className="cnt">
        <button className="add-btn" style={{ marginBottom: '.25rem' }}>＋ Add task</button>
        {visible.map(task => (
          <div key={task.id} className="task-item" onClick={() => toggleTask(task.id)}>
            <div className={`task-cb ${task.done ? 'chk' : ''}`}>{task.done ? '✓' : ''}</div>
            <div className="task-body">
              <div className={`task-name ${task.done ? 'done' : ''}`}>{task.name}</div>
              <div className="task-meta">{task.cat}</div>
            </div>
            <div className="task-who" style={{
              background: `${MEMBER_COLORS[task.who]}22`,
              color: MEMBER_COLORS[task.who],
              border: `1px solid ${MEMBER_COLORS[task.who]}44`
            }}>{MEMBER_INIT[task.who]}</div>
            <div className="task-badge" style={{
              borderColor: `${URGENCY_COLORS[task.urgency]}44`,
              color: URGENCY_COLORS[task.urgency],
              background: `${URGENCY_COLORS[task.urgency]}11`
            }}>{task.badge}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── GROCERIES ──────────────────────────────────────────
const CAT_LABELS = { produce:'🥦 Produce', dairy:'🥛 Dairy / Alt', meat:'🥩 Meat', pantry:'🥫 Pantry', household:'🧼 Household' }

export function GroceriesPage() {
  const { groceries, toggleGrocery, addGrocery } = useHub()
  const [filter, setFilter] = useState('all')
  const [newItem, setNewItem] = useState('')
  const [basicsOpen, setBasicsOpen] = useState(false)
  const CATS = ['all','produce','dairy','pantry','household']

  const visible = filter === 'all' ? groceries : groceries.filter(g => g.cat === filter)
  const grouped = CATS.slice(1).reduce((acc, cat) => {
    const items = groceries.filter(g => g.cat === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  function handleAdd() {
    const v = newItem.trim()
    if (!v) return
    addGrocery(v)
    setNewItem('')
  }

  return (
    <div className="screen active">
      <TopBar showBack />
      <div className="ptabs">
        {CATS.map(c => (
          <div key={c} className={`ptab ${filter === c ? 'on' : ''}`} onClick={() => setFilter(c)}>
            {c === 'all' ? 'All' : CAT_LABELS[c]}
          </div>
        ))}
      </div>
      <div className="cnt">
        <div className={`basics-toggle ${basicsOpen ? 'open' : ''}`} onClick={() => setBasicsOpen(o => !o)}>
          <span className="basics-toggle-ico">›</span>
          <span className="basics-toggle-txt">Weekly Basics — 5 regular items</span>
        </div>
        {basicsOpen && (
          <div style={{ marginBottom: '.5rem' }}>
            {['Bread (weekly)','Milk 2L (weekly)','Eggs × 12 (weekly)','Bananas (weekly)','Dog food (weekly)'].map(it => (
              <div key={it} className="groc-item"><div className="cb" /><div className="groc-text">{it}</div></div>
            ))}
          </div>
        )}

        {filter === 'all'
          ? Object.entries(grouped).map(([cat, items]) => (
              <div key={cat} className="groc-cat">
                <div className="groc-cat-label">{CAT_LABELS[cat]}</div>
                {items.map(g => (
                  <div key={g.id} className={`groc-item ${g.done ? 'done-item' : ''}`} onClick={() => toggleGrocery(g.id)}>
                    <div className={`cb ${g.done ? 'chk' : ''}`}>{g.done ? '✓' : ''}</div>
                    <div className={`groc-text ${g.done ? 'done' : ''}`}>{g.name}</div>
                    {g.note && <div className="groc-qty">{g.note}</div>}
                  </div>
                ))}
              </div>
            ))
          : visible.map(g => (
              <div key={g.id} className={`groc-item ${g.done ? 'done-item' : ''}`} onClick={() => toggleGrocery(g.id)}>
                <div className={`cb ${g.done ? 'chk' : ''}`}>{g.done ? '✓' : ''}</div>
                <div className={`groc-text ${g.done ? 'done' : ''}`}>{g.name}</div>
                {g.note && <div className="groc-qty">{g.note}</div>}
              </div>
            ))
        }

        <div className="groc-add-row">
          <input
            className="groc-add-inp"
            placeholder="Add item…"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button className="groc-add-btn" onClick={handleAdd}>Add</button>
        </div>
      </div>
    </div>
  )
}

// ── ALERTS ──────────────────────────────────────────────
export function AlertsPage() {
  const { isParent, activeAlerts, dismissAlert, sendAlert } = useHub()
  const [tab, setTab]       = useState('active')
  const [nudgeMsg, setNudge] = useState('')
  const [knockMsg, setKnock] = useState('')
  const [blastMsg, setBlast] = useState('')

  const AL_TABS = [
    { id: 'active',  label: `Active (${activeAlerts.length})` },
    { id: 'history', label: 'History' },
    ...(isParent ? [{ id: 'send', label: '＋ Send' }] : []),
  ]

  return (
    <div className="screen active">
      <TopBar showBack />
      <div className="ptabs">
        {AL_TABS.map(t => (
          <div key={t.id} className={`ptab ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>{t.label}</div>
        ))}
      </div>
      <div className="cnt">
        {tab === 'active' && (
          <>
            <div className="slbl">Active alerts</div>
            {activeAlerts.length === 0 && <div className="note" style={{textAlign:'left',padding:'.5rem 0'}}>No active alerts.</div>}
            {activeAlerts.map(a => (
              <div key={a.id} className={`al al-${a.type}`} style={{ marginBottom: '.35rem' }}>
                <div className="al-ico">{a.type === 'nudge' ? '💬' : a.type === 'knock' ? '🔔' : '🚨'}</div>
                <div style={{ flex: 1 }}>
                  <div className="al-txt">{a.text}</div>
                  <div className="al-meta">{a.meta}</div>
                </div>
                <button onClick={() => dismissAlert(a.id)} style={{ border: 'none', background: 'none', color: 'var(--tx3)', cursor: 'pointer', fontSize: '.75rem', padding: '.2rem' }}>✕</button>
              </div>
            ))}
          </>
        )}

        {tab === 'history' && (
          <>
            <div className="slbl">Alert history — last 7 days</div>
            {ALERTS_HISTORY.map((a, i) => (
              <div key={i} className={`al al-${a.type}`} style={{ marginBottom: '.35rem' }}>
                <div className="al-ico">{a.type === 'nudge' ? '💬' : a.type === 'knock' ? '🔔' : '🚨'}</div>
                <div><div className="al-txt">{a.text}</div><div className="al-meta">{a.meta}</div></div>
              </div>
            ))}
          </>
        )}

        {tab === 'send' && isParent && (
          <>
            {[
              { type: 'nudge', label: 'Send a Nudge', sub: '💬 Soft reminder — scrolls in the ticker', val: nudgeMsg, set: setNudge, btnColor: 'var(--am)', btnLabel: 'Send Nudge' },
              { type: 'knock', label: 'Send a Knock', sub: '🔔 Important — appears prominently on Hub', val: knockMsg, set: setKnock, btnColor: 'var(--cu)', btnLabel: 'Send Knock' },
              { type: 'blast', label: 'Send a Blast', sub: '🚨 Urgent — full-screen takeover. Must be accepted.', val: blastMsg, set: setBlast, btnColor: 'var(--rd)', btnLabel: '🚨 Send Blast', urgent: true },
            ].map(({ type, label, sub, val, set, btnColor, btnLabel, urgent }) => (
              <div key={type}>
                <div className="slbl">{label}</div>
                <div className="w" style={urgent ? { background: 'rgba(224,90,90,.05)', borderColor: 'rgba(224,90,90,.25)', marginBottom: '.5rem' } : { marginBottom: '.5rem' }}>
                  <div style={{ fontSize: '.72rem', color: urgent ? 'var(--rd)' : 'var(--tx2)', marginBottom: '.4rem' }}>{sub}</div>
                  <div className="brow">
                    <input className="binp" placeholder={`Type message…`} value={val} onChange={e => set(e.target.value)} />
                    <button className="bsnd" style={{ background: btnColor }} onClick={() => { sendAlert(type, val || 'Alert from Hub'); set('') }}>{btnLabel}</button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

// ── BILLS ──────────────────────────────────────────────
const STATUS_CONFIG = {
  overdue:  { cls: 'bs-over', label: 'Overdue' },
  upcoming: { cls: 'bs-due',  label: 'Due soon' },
  paid:     { cls: 'bs-paid', label: 'Paid ✓' },
}

export function BillsPage() {
  const [filter, setFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)

  const visible = filter === 'all' ? BILLS : BILLS.filter(b => b.status === filter)
  const overdue  = BILLS.filter(b => b.status === 'overdue').reduce((s, b) => s + b.amount, 0)
  const upcoming = BILLS.filter(b => b.status === 'upcoming').reduce((s, b) => s + b.amount, 0)
  const paid     = BILLS.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0)

  return (
    <div className="screen active">
      <TopBar showBack />
      <div className="ptabs">
        {['all','overdue','upcoming','paid'].map(f => (
          <div key={f} className={`ptab ${filter === f ? 'on' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </div>
        ))}
      </div>
      <div className="cnt">
        <div className="bills-summary">
          <div className="bs-card"><div className="bs-val c-rd">${overdue.toFixed(0)}</div><div className="bs-lbl">Overdue</div></div>
          <div className="bs-card"><div className="bs-val c-am">${upcoming.toFixed(0)}</div><div className="bs-lbl">Due this month</div></div>
          <div className="bs-card"><div className="bs-val c-gn">${paid.toFixed(0)}</div><div className="bs-lbl">Paid this month</div></div>
        </div>

        {visible.map(b => {
          const cfg = STATUS_CONFIG[b.status]
          return (
            <div key={b.id} className="bill-row">
              <div className="bill-ico">{b.icon}</div>
              <div className="bill-info">
                <div className="bill-name">{b.name}</div>
                <div className="bill-due">{b.due}</div>
              </div>
              <div className={`bill-amt ${b.status === 'overdue' ? 'c-rd' : b.status === 'paid' ? 'c-gn' : ''}`}>
                ${b.amount.toFixed(2)}
              </div>
              <div className={`bill-status ${cfg.cls}`}>{cfg.label}</div>
            </div>
          )
        })}

        {showAdd && (
          <div className="add-form">
            <div style={{ fontSize: '.7rem', fontWeight: 600, color: 'var(--tx2)' }}>Add bill</div>
            <input placeholder="Bill name" />
            <div className="add-form-row">
              <input placeholder="Amount $" style={{ width: '50%' }} />
              <input type="date" style={{ width: '50%' }} />
            </div>
            <div className="add-form-row">
              <button className="save-btn" onClick={() => setShowAdd(false)}>Save bill</button>
              <button className="cancel-btn" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        )}
        <button className="add-btn" onClick={() => setShowAdd(s => !s)}>＋ Add bill</button>
      </div>
    </div>
  )
}

// ── MAINTENANCE ────────────────────────────────────────
const MAINT_STATUS = {
  overdue: { cls: 'ms-over', label: 'Overdue' },
  due:     { cls: 'ms-due',  label: 'Due soon' },
  ok:      { cls: 'ms-ok',   label: 'On track' },
}

export function MaintenancePage() {
  const [filter, setFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)

  const visible = filter === 'all' ? MAINTENANCE : MAINTENANCE.filter(m => m.status === filter)

  return (
    <div className="screen active">
      <TopBar showBack />
      <div className="ptabs">
        {['all','overdue','due','ok'].map(f => (
          <div key={f} className={`ptab ${filter === f ? 'on' : ''}`} onClick={() => setFilter(f)}>
            {f === 'ok' ? 'On track' : f.charAt(0).toUpperCase() + f.slice(1)}
          </div>
        ))}
      </div>
      <div className="cnt">
        {visible.map(m => {
          const cfg = MAINT_STATUS[m.status]
          return (
            <div key={m.id} className="maint-item" data-status={m.status}>
              <div className="maint-ico">{m.icon}</div>
              <div className="maint-body">
                <div className="maint-name">{m.name}</div>
                <div className="maint-meta">{m.meta}</div>
              </div>
              <div className={`maint-status ${cfg.cls}`}>{cfg.label}</div>
            </div>
          )
        })}

        {showAdd && (
          <div className="add-form" style={{ marginTop: '.5rem' }}>
            <div style={{ fontSize: '.7rem', fontWeight: 600, color: 'var(--tx2)' }}>Add maintenance task</div>
            <input placeholder="Task name (e.g. Gutter cleaning)" />
            <div className="add-form-row">
              <select style={{ width: '50%' }}>
                {['Every week','Every fortnight','Every month','Every 3 months','Every 6 months','Every year'].map(o => <option key={o}>{o}</option>)}
              </select>
              <input type="date" style={{ width: '50%' }} />
            </div>
            <div className="add-form-row">
              <button className="save-btn" onClick={() => setShowAdd(false)}>Save</button>
              <button className="cancel-btn" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        )}
        <button className="add-btn" onClick={() => setShowAdd(s => !s)}>＋ Add maintenance task</button>
      </div>
    </div>
  )
}
