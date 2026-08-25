import { render } from 'preact'
import { HooksPage } from '@/components/HooksPage'
import '@/index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

render(<HooksPage />, rootElement)
