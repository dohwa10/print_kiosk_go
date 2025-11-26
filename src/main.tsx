import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  document.body.innerHTML = '<p style="color:red;padding:20px;">Error: Root element not found!</p>'
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <App />
    )
  } catch (error) {
    console.error('React render error:', error)
    rootElement.innerHTML = '<p style="color:red;padding:20px;">Error rendering app: ' + String(error) + '</p>'
  }
}
