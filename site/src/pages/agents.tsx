import { render } from 'preact'
import { AgentsPage } from '@/components/AgentsPage'
import '@/index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

render(<AgentsPage />, rootElement)
