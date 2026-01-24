import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StudyLogs } from './StudyLog.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StudyLogs />
  </StrictMode>,
)
