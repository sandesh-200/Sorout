import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux' 
import { store } from './app/store'    
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { TooltipProvider } from './components/ui/tooltip.tsx'
import App from './App.tsx'
import './index.css'
import { Toaster } from './components/ui/sonner.tsx'
import { ThemeProvider } from './components/shared/theme-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <App />
            <Toaster richColors position='top-right'/>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)