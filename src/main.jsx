import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StudyRecords } from './StudyRecords.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StudyRecords />
  </StrictMode>,
)
