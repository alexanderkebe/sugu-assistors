import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Registration from './pages/Registration'
import Organizer from './pages/Organizer'
import './App.css'

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/organizer" element={<Organizer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  )
}

export default App
