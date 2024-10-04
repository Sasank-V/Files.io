import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthProvider.jsx'
import { SubjectProvider } from './context/SubjectProvider.jsx'

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <AuthProvider>
      <SubjectProvider>
        <App />
      </SubjectProvider>
    </AuthProvider>
  </StrictMode>,
)
