import { render } from 'preact'
import { InstallPage } from '@/components/InstallPage'
import '@/index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

render(<InstallPage />, rootElement)
