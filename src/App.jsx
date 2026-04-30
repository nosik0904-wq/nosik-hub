import { HubProvider, useHub } from './context/HubContext'
import { BlastOverlay } from './components/Overlays'
import { WelcomeScreen, LockScreen } from './screens/EntryScreens'
import { FamilyView, ParentView }    from './screens/HomeViews'
import { KidMasonView, KidJaxonView, NanView, CarerView, VisitorView } from './screens/OtherViews'
import { CalendarPage, TasksPage, GroceriesPage, AlertsPage, BillsPage, MaintenancePage } from './screens/PageScreens'

function Router() {
  const { screen } = useHub()

  const map = {
    welcome:    <WelcomeScreen />,
    lock:       <LockScreen />,
    family:     <FamilyView />,
    parent:     <ParentView />,
    'kid-mason':<KidMasonView />,
    'kid-jaxon':<KidJaxonView />,
    nan:        <NanView />,
    carer:      <CarerView />,
    visitor:    <VisitorView />,
    calendar:   <CalendarPage />,
    tasks:      <TasksPage />,
    groceries:  <GroceriesPage />,
    alerts:     <AlertsPage />,
    bills:      <BillsPage />,
    maintenance:<MaintenancePage />,
  }

  return map[screen] || <FamilyView />
}

export default function App() {
  return (
    <HubProvider>
      <div className="device" id="app">
        <BlastOverlay />
        <Router />
      </div>
    </HubProvider>
  )
}
