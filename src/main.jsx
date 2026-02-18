import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StudyBody } from './StudyBody'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StudyBody />
  </StrictMode>,
)
