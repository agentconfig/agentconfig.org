import { render } from 'preact'
import { SkillsPage } from '@/components/SkillsPage'
import '@/index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

render(<SkillsPage />, rootElement)
