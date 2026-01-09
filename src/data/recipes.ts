export interface RecipePrimitive {
  /** Primitive ID (matches primitives.ts) */
  id: string
  /** Display name */
  name: string
  /** Why this primitive is needed for this recipe */
  reason: string
  /** Whether this primitive is required or optional */
  required: boolean
}

export interface Recipe {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Short tagline */
  tagline: string
  /** Detailed description */
  description: string
  /** Icon emoji */
  icon: string
  /** What to avoid with this work type */
  avoid: string
  /** Risk level */
  riskLevel: 'low' | 'medium' | 'high'
  /** Primitives used in this recipe */
  primitives: RecipePrimitive[]
}

export const recipes: Recipe[] = [
  {
    id: 'quick-answer',
    name: 'Quick Answer',
    tagline: 'One-off explanations and questions',
    description: 'For quick questions, explanations, or one-off tasks that don\'t require file changes or multi-step execution. The AI provides an answer based on its knowledge and your project context.',
    icon: '💬',
    avoid: 'Heavy agent mode unless you need tool-backed truth. Keep it simple.',
    riskLevel: 'low',
    primitives: [
      {
        id: 'persistent-instructions',
        name: 'Persistent Instructions',
        reason: 'Sets tone and constraints for consistent responses',
        required: true,
      },
      {
        id: 'structured-output',
        name: 'Structured Output',
        reason: 'Ensures answers include assumptions and next steps',
        required: false,
      },
    ],
  },
  {
    id: 'single-file-code',
    name: 'Single File Code Change',
    tagline: 'Write or modify code in one file',
    description: 'For implementing features, fixing bugs, or making changes that are contained to a single file. Includes running tests to verify the change works.',
    icon: '📝',
    avoid: 'Skipping verification. Always run tests or lint after changes.',
    riskLevel: 'low',
    primitives: [
      {
        id: 'scope-specific-instructions',
        name: 'Scope-Specific Instructions',
        reason: 'Applies the right conventions for this part of the codebase',
        required: true,
      },
      {
        id: 'prompt-templates',
        name: 'Prompt Templates',
        reason: 'Standardizes the "implement + explain + test" pattern',
        required: true,
      },
      {
        id: 'verification',
        name: 'Verification',
        reason: 'Run unit tests and lint to catch errors',
        required: true,
      },
    ],
  },
  {
    id: 'multi-file-refactor',
    name: 'Multi-File Refactor',
    tagline: 'Large changes across multiple files',
    description: 'For migrations, refactoring, or features that span multiple files. Requires planning, incremental execution, and verification at each step.',
    icon: '🔄',
    avoid: 'Making all changes at once. Work incrementally with verification.',
    riskLevel: 'high',
    primitives: [
      {
        id: 'agent-mode',
        name: 'Agent Mode',
        reason: 'Enables multi-step execution with planning',
        required: true,
      },
      {
        id: 'skills',
        name: 'Skills / Workflows',
        reason: 'Follows a proven refactor playbook',
        required: true,
      },
      {
        id: 'tool-integrations',
        name: 'Tool Integrations',
        reason: 'Code search, tests, and formatter access',
        required: true,
      },
      {
        id: 'structured-output',
        name: 'Structured Output',
        reason: 'Creates plan, risk list, and rollback notes',
        required: true,
      },
      {
        id: 'verification',
        name: 'Verification',
        reason: 'Tests after each incremental change',
        required: true,
      },
    ],
  },
  {
    id: 'research-synthesis',
    name: 'Research & Synthesis',
    tagline: 'Docs, ADRs, and comparisons',
    description: 'For researching options, writing documentation, creating ADRs, or comparing alternatives. Requires gathering information and synthesizing it into actionable output.',
    icon: '🔍',
    avoid: 'Accepting answers without citations. Require sources.',
    riskLevel: 'medium',
    primitives: [
      {
        id: 'retrieval',
        name: 'Retrieval (RAG)',
        reason: 'Fetches current docs, web results with citations',
        required: true,
      },
      {
        id: 'tool-integrations',
        name: 'Tool Integrations',
        reason: 'Web search and doc search capabilities',
        required: true,
      },
      {
        id: 'structured-output',
        name: 'Structured Output',
        reason: 'Creates outline, decision table, and recommendations',
        required: true,
      },
    ],
  },
  {
    id: 'incident-triage',
    name: 'Incident Triage',
    tagline: 'Production debugging and response',
    description: 'For investigating production issues, analyzing logs, and debugging incidents. Requires careful access controls and structured hypothesis testing.',
    icon: '🚨',
    avoid: 'Making changes without confirmation. Default to read-only.',
    riskLevel: 'high',
    primitives: [
      {
        id: 'skills',
        name: 'Skills / Workflows',
        reason: 'Follows incident response playbook',
        required: true,
      },
      {
        id: 'tool-integrations',
        name: 'Tool Integrations',
        reason: 'Access to logs, traces, and dashboards',
        required: true,
      },
      {
        id: 'guardrails',
        name: 'Guardrails',
        reason: 'Read-only by default, require confirmation for changes',
        required: true,
      },
      {
        id: 'structured-output',
        name: 'Structured Output',
        reason: 'Creates timeline, hypotheses, and next experiments',
        required: true,
      },
    ],
  },
  {
    id: 'team-consistency',
    name: 'Team-Scale Consistency',
    tagline: 'Onboarding, standards, and repeated tasks',
    description: 'For establishing team-wide patterns, onboarding new members, and ensuring consistent outputs across the team. Focus on reusability and guardrails.',
    icon: '👥',
    avoid: 'One-off solutions. Build for reuse and consistency.',
    riskLevel: 'medium',
    primitives: [
      {
        id: 'persistent-instructions',
        name: 'Persistent Instructions',
        reason: 'Establishes team-wide norms and standards',
        required: true,
      },
      {
        id: 'scope-specific-instructions',
        name: 'Scope-Specific Instructions',
        reason: 'Different rules for different parts of the system',
        required: true,
      },
      {
        id: 'prompt-templates',
        name: 'Prompt Templates',
        reason: 'Standardizes common tasks for consistency',
        required: true,
      },
      {
        id: 'skills',
        name: 'Skills / Workflows',
        reason: 'Encodes high-value workflows for the team',
        required: true,
      },
      {
        id: 'guardrails',
        name: 'Guardrails',
        reason: 'Enforces safety across team usage',
        required: true,
      },
      {
        id: 'verification',
        name: 'Verification',
        reason: 'Ensures quality across all outputs',
        required: true,
      },
    ],
  },
]

export const riskLevelColors = {
  low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  high: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
}

export const riskLevelLabels = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
}
