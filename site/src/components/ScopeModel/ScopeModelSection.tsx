import type { ComponentChildren, VNode } from 'preact'
import { Building2, FolderTree, Zap } from 'lucide-preact'
import { scopeModel } from '@/data/primitives'

const scopeGroups = [
  {
    id: 'defaults',
    step: '1',
    title: 'Broad defaults',
    description: 'Start here when a rule should follow an organization or a person.',
    icon: Building2,
    accent: 'border-emerald-300 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20',
    badge: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-100',
  },
  {
    id: 'project',
    step: '2',
    title: 'Project context',
    description: 'Narrow the rule when a repository, path, checkout, or agent needs different guidance.',
    icon: FolderTree,
    accent: 'border-blue-300 bg-blue-50/70 dark:border-cyan-900 dark:bg-cyan-950/20',
    badge: 'bg-blue-100 text-blue-900 dark:bg-cyan-900/60 dark:text-cyan-100',
  },
  {
    id: 'runtime',
    step: '3',
    title: 'Live execution',
    description: 'Use the shortest-lived scope for context or policy that should disappear after the work.',
    icon: Zap,
    accent: 'border-violet-300 bg-violet-50/70 dark:border-violet-900 dark:bg-violet-950/20',
    badge: 'bg-violet-100 text-violet-900 dark:bg-violet-900/60 dark:text-violet-100',
  },
] as const

function ScopeCard({ children }: { readonly children: ComponentChildren }): VNode {
  return (
    <div className="rounded-xl border border-border/80 bg-background/80 p-4 shadow-sm">
      {children}
    </div>
  )
}

export function ScopeModelSection(): VNode {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-5 dark:border-amber-900 dark:bg-amber-950/20">
        <p className="font-semibold text-foreground">Start broad. Narrow only when the audience or lifetime changes.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Scopes are not peer primitives. They describe where a primitive applies and how long it should remain in effect.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {scopeGroups.map((group, index) => {
          const Icon = group.icon
          const scopes = scopeModel.filter((scope) => scope.tier === group.id)

          return (
            <section key={group.id} aria-labelledby={`scope-group-${group.id}`} className={`relative rounded-2xl border p-5 ${group.accent}`}>
              {index < scopeGroups.length - 1 && (
                <span aria-hidden="true" className="absolute -bottom-4 left-1/2 z-10 -translate-x-1/2 text-2xl text-muted-foreground lg:-right-4 lg:bottom-auto lg:left-auto lg:top-8 lg:translate-x-0">→</span>
              )}
              <div className="mb-5 flex items-start gap-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${group.badge}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Step {group.step}</p>
                  <h3 id={`scope-group-${group.id}`} className="text-xl font-bold text-foreground">{group.title}</h3>
                </div>
              </div>
              <p className="mb-5 text-sm text-muted-foreground">{group.description}</p>
              <div className="space-y-3">
                {scopes.map((scope) => (
                  <ScopeCard key={scope.id}>
                    <h4 className="font-semibold text-foreground">{scope.name}</h4>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{scope.audience}</p>
                    <p className="mt-3 text-sm text-muted-foreground">{scope.example}</p>
                    {scope.location != null && (
                      <code className="mt-3 block break-words rounded-md border border-border bg-background px-2.5 py-2 text-xs text-foreground">
                        {scope.location}
                      </code>
                    )}
                  </ScopeCard>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        A useful default is a root <code>AGENTS.md</code>, narrowed with directory instructions only where the work actually differs.
      </p>
    </div>
  )
}
