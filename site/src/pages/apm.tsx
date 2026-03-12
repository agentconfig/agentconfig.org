import { render } from 'preact'
import { ApmPage } from '@/components/ApmPage'
import '@/index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

render(<ApmPage />, rootElement)
