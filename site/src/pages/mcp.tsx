import { render } from 'preact'
import { MCPPage } from '@/components/MCPPage'
import '@/index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

render(<MCPPage />, rootElement)
