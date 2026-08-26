import { render } from 'preact'
import { ProfilesPage } from '@/components/ProfilesPage'
import '@/index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

render(<ProfilesPage />, rootElement)
