# Normalization Reference

How to turn provider prose into claims the comparison can check.

## Claim shape

| Field | Required | Notes |
| --- | --- | --- |
| `id` | Yes | Stable label, conventionally `<provider>.<topic>.<aspect>` |
| `provider` | Yes | Registry provider id |
| `primitive` | Yes | Site primitive id where one exists, otherwise the concept name |
| `aspect` | Yes | One of the aspects below |
| `value` | Yes | A string, or an array when the documentation lists several |
| `sourceId` | Yes | Registry source id the claim was read from |
| `sourceUrl` | Yes | The canonical page URL, matching the registry entry |
| `sourceAuthority` | Yes | `primary` or `secondary` |
| `retrievedAt` | Yes | ISO 8601 date the snapshot was taken |
| `notes` | No | Qualifiers a reader would otherwise have to rediscover |

## Aspects

| Aspect | Question it answers | Mapped to site data |
| --- | --- | --- |
| `artifact` | What is the thing called and what is it? | `implementation` |
| `location` | Where does it live on disk or in settings? | `location` |
| `support` | Is it supported, and how well? | `support` |
| `scope` | Which layer does it apply to: managed, user, project, local, path? | Not modeled |
| `precedence` | What wins when two configurations apply? | Not modeled |
| `lifecycle-events` | Which events can be observed or intercepted? | Not modeled |
| `permissions` | What approval or allowlist behavior applies? | Not modeled |
| `sandbox` | What changes between local, cloud, or restricted execution? | Not modeled |
| `surfaces` | Which products or clients honor it? | Not modeled |
| `minimum-version` | When did this become available? | Not modeled |

Aspects marked "not modeled" are not defects in the claim. They produce `extend-site-model` findings, which are the raw material for expanding what the site publishes.

## Comparison rules

Values are canonicalized before comparison: trimmed, whitespace collapsed, backticks and quotes stripped, trailing punctuation removed, and split on commas and the word "or". Set-valued aspects are then sorted, so listing order does not read as drift while a genuinely different path still does. Ordered aspects — currently `precedence` — keep the documented sequence, because for those the order is the claim: two official sources that document different precedence orders must surface as `ambiguous` rather than canonicalizing to the same string. Path-bearing aspects — currently `location` — keep their case, because `AGENTS.md` and `agents.md` name different files on a case-sensitive filesystem. Every other aspect is case-folded, since prose case is formatting rather than meaning.

A claim must cite the registered page itself. The comparison accepts the exact registered URL, its `.md` variant, and a fragment on that page, and rejects any other URL, including a descendant path, so evidence about one page can never be recorded against another.

Authority belongs to the registry, not to the claim. A claim records the authority it believes it is citing, and the comparison rejects it as `ambiguous` when that disagrees with the registered source. Without this, a claim citing a registered secondary source could label itself `primary` and pass the primary-source gate all the way to `confirmed`.

`AGENTS.md or .github/copilot-instructions.md` and `[".github/copilot-instructions.md", "AGENTS.md"]` compare equal. `.cursor/rules/*.mdc` and `.cursor/rules/*.md` do not.

## Worked examples

Documentation says project skills live in `.github/skills`, `.claude/skills`, or `.agents/skills`, and personal skills live in `~/.copilot/skills` or `~/.agents/skills`.

```json
{
  "aspect": "location",
  "value": [".github/skills", ".claude/skills", ".agents/skills", "~/.copilot/skills", "~/.agents/skills"]
}
```

Record every documented location. A partial answer produces a false `confirmed` when the site is merely incomplete.

Documentation describes a hooks framework with named events.

```json
{
  "aspect": "lifecycle-events",
  "value": ["SessionStart", "SessionEnd", "PreToolUse", "PostToolUse", "Stop"],
  "notes": "SessionEnd does not run for subagents."
}
```

Put the qualifier in `notes` rather than deleting the event or inventing a new aspect.

Documentation describes different behavior in a hosted environment.

```json
{
  "aspect": "sandbox",
  "value": "Cloud sessions do not read local user settings; configuration comes from the repository and server-managed organization settings"
}
```

Local-versus-cloud differences are the drift most likely to mislead a reader, so record them even though the site does not model them yet.

## What not to record

- A capability inferred from a changelog, release note, or screenshot without reference documentation.
- A path seen in an example but never stated as the configuration location.
- A behavior that "should" follow from another provider's design.
- A support level chosen to make a comparison table look complete.

When documentation is genuinely unclear, leave the claim out and say so in the pull request. An acknowledged gap is more useful than a confident error.
