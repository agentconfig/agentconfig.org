import type { VNode, ComponentChildren } from 'preact'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navigation } from '@/components/Navigation'

export interface PageLayoutProps {
  children: ComponentChildren
}

export function PageLayout({ children }: PageLayoutProps): VNode {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main>
          {children}
        </main>

        <footer className="border-t border-border py-8">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>Brought to you by <a href="https://jonmagic.com" className="underline hover:text-foreground transition-colors">jonmagic</a>.</p>
            <p className="mt-2 text-sm">
              <a href="/llms.txt" className="hover:text-foreground transition-colors">llms.txt</a>
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}
