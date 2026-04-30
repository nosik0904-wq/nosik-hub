import { createContext, useContext, useState, useEffect } from 'react'
import { PINS, TASKS, GROCERIES } from '../data/demo'

const HubContext = createContext(null)

export function HubProvider({ children }) {
  const [screen, setScreen]       = useState('welcome')   // current screen id
  const [prevScreen, setPrev]     = useState('family')    // for back navigation
  const [mode, setMode]           = useState('family')    // user role
  const [blast, setBlast]         = useState(null)        // { text, from } | null
  const [tasks, setTasks]         = useState(TASKS)
  const [groceries, setGroceries] = useState(GROCERIES)
  const [activeAlerts, setActiveAlerts] = useState([
    { id: 1, type: 'nudge', text: 'Please bring washing in before dinner.',          meta: 'NUDGE · Kim · 3:15 PM' },
    { id: 2, type: 'knock', text: 'Bins need to go out before dark — Jaxon\'s job!', meta: 'KNOCK · Carl · 4:10 PM · ✓ Accepted by Jaxon 4:18 PM' },
  ])

  // Clock
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
    setTime(fmt())
    const t = setInterval(() => setTime(fmt()), 15000)
    return () => clearInterval(t)
  }, [])

  const isParent  = mode === 'carl' || mode === 'kim'
  const isPersonal = mode !== 'family'
  const isKid     = ['mason', 'jaxon', 'easton', 'hudson'].includes(mode)

  function login(pin) {
    const m = PINS[pin]
    if (!m) return false
    enterMode(m)
    return true
  }

  function enterMode(m) {
    setMode(m)
    const homeMap = {
      family: 'family', carl: 'parent', kim: 'parent',
      mason: 'kid-mason', jaxon: 'kid-jaxon',
      easton: 'kid-mason', hudson: 'kid-mason',
      nan: 'nan', carer: 'carer', visitor: 'visitor',
    }
    setPrev('family')
    setScreen(homeMap[m] || 'family')
  }

  function navTo(s) {
    setPrev(screen)
    setScreen(s)
  }

  function navBack() {
    setScreen(prevScreen)
  }

  function lockHub() {
    if (isPersonal) {
      setMode('family')
      setScreen('family')
    } else {
      setScreen('lock')
    }
  }

  function sendBlast(text) {
    setBlast({ text: text.toUpperCase(), from: mode === 'kim' ? 'Mum' : 'Dad' })
  }

  function dismissBlast() {
    setBlast(null)
  }

  function toggleTask(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function toggleGrocery(id) {
    setGroceries(prev => prev.map(g => g.id === id ? { ...g, done: !g.done } : g))
  }

  function addGrocery(name, cat = 'pantry') {
    setGroceries(prev => [
      ...prev,
      { id: Date.now(), cat, name, done: false }
    ])
  }

  function dismissAlert(id) {
    setActiveAlerts(prev => prev.filter(a => a.id !== id))
  }

  function sendAlert(type, text) {
    if (type === 'blast') { sendBlast(text); return }
    setActiveAlerts(prev => [
      ...prev,
      { id: Date.now(), type, text, meta: `${type.toUpperCase()} · ${mode === 'kim' ? 'Kim' : 'Carl'} · just now` }
    ])
  }

  return (
    <HubContext.Provider value={{
      screen, setScreen, prevScreen,
      mode, isParent, isPersonal, isKid,
      blast, sendBlast, dismissBlast,
      time,
      tasks, toggleTask,
      groceries, toggleGrocery, addGrocery,
      activeAlerts, dismissAlert, sendAlert,
      login, enterMode, navTo, navBack, lockHub,
    }}>
      {children}
    </HubContext.Provider>
  )
}

export function useHub() {
  return useContext(HubContext)
}
