import { useHub } from '../context/HubContext'

export default function SideMenu({ open, onClose }) {
  const { isParent, isPersonal, navTo, lockHub } = useHub()

  function go(s) { navTo(s); onClose() }

  return (
    <>
      {open && <div className="smo" onClick={onClose} />}
      <nav className={`sm ${open ? 'open' : ''}`}>
        <div className="sm-logo">
          <h2>NOSIK</h2>
          <p>Household Operating System</p>
        </div>

        <div className="sm-items">
          <div className="sm-sec">Main</div>
          <div className="sm-item" onClick={() => go('family')}>       <span className="ico">🏠</span> Home</div>
          <div className="sm-item" onClick={() => go('calendar')}>     <span className="ico">📅</span> Calendar</div>
          <div className="sm-item" onClick={() => go('tasks')}>        <span className="ico">✅</span> Tasks</div>
          <div className="sm-item" onClick={() => go('groceries')}>    <span className="ico">🛒</span> Groceries</div>
          <div className="sm-item" onClick={() => go('alerts')}>       <span className="ico">🔔</span> Alerts</div>
          {isParent && <div className="sm-item" onClick={() => go('bills')}>       <span className="ico">💳</span> Bills</div>}
          <div className="sm-item" onClick={() => go('maintenance')}>  <span className="ico">🔧</span> Maintenance</div>

          <div className="sm-sec">Access</div>
          {isParent && <div className="sm-item"><span className="ico">👥</span> People &amp; Access</div>}
          <div className="sm-item"><span className="ico">🚨</span> Emergency Mode</div>

          {isParent && <>
            <div className="sm-sec">Manage</div>
            <div className="sm-item"><span className="ico">⚙️</span> Settings</div>
            <div className="sm-item"><span className="ico">✨</span> NOSIK Assist</div>
            <div className="sm-item"><span className="ico">🧹</span> NOSIK Tidy</div>
            <div className="sm-item"><span className="ico">🔒</span> Privacy &amp; Security</div>
            <div className="sm-sec">Optional</div>
            <div className="sm-item"><span className="ico">💡</span> Optional Features</div>
          </>}
        </div>

        <div className="sm-foot">
          <button className="sm-lk" onClick={() => { lockHub(); onClose() }}>
            {isPersonal ? '✕ Back to Family View' : '👤 Switch user'}
          </button>
        </div>
      </nav>
    </>
  )
}
