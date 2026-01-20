import type { VNode, ComponentChildren } from 'preact'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navigation } from '@/components/Navigation'

export interface PageLayoutProps {
  children: ComponentChildren
  llmsPath?: string
}

export function PageLayout({ children, llmsPath = '/llms.txt' }: PageLayoutProps): VNode {
  // Extract filename from path for display
  const llmsFilename = llmsPath.split('/').pop() ?? 'llms.txt'
  
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main>
          {children}
        </main>

        <footer className="border-t border-border py-8">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>brought to you by <a href="https://github.com/agentconfig" className="underline hover:text-foreground transition-colors">agentconfig</a></p>
            <p className="mt-2 text-sm">
              <a href={llmsPath} className="hover:text-foreground transition-colors">{llmsFilename}</a>
              <span className="mx-2 text-muted-foreground">·</span>
              <a href="/llms-full.txt" className="hover:text-foreground transition-colors">llms-full.txt</a>
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}
