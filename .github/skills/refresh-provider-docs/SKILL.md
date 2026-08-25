---
name: refresh-provider-docs
description: Retrieve, normalize, compare, and cite authoritative AI provider documentation to verify what agentconfig.org publishes. Use when checking whether provider config locations, hook events, skills, MCP, custom agents, or precedence claims are still accurate, when adding a provider to the compatibility index, or when running the scheduled documentation refresh.
---

# Refresh Provider Documentation

Verify what agentconfig.org publishes against what providers actually document, and cite a primary source for every claim.

The site's credibility rests on being right about file paths, lifecycle events, and precedence rules that change without notice. This skill exists so that no provider panel, comparison row, or tutorial is expanded on memory.

## The split this skill enforces

Reading documentation is a judgment task. Deciding whether the site is wrong is not.

| Step | Owner | Why |
| --- | --- | --- |
| Retrieve registered sources | Script | Reproducible, cited, and offline afterwards |
| Read the retrieved documents | Agent | Prose is not parseable by regex |
| Write normalized claims | Agent | Extraction is judgment, so it must be explicit and citable |
| Validate, compare, and report | Script | A verdict must be deterministic and reviewable |

Never skip the middle two steps by guessing, and never hand-write a finding. If a claim cannot be traced to a retrieved snapshot, it does not get recorded.

## When to Use

Use this skill when:

- A provider's configuration location, hook events, permissions, or precedence rules need checking against current documentation.
- A new provider is being considered for the compatibility index.
- The scheduled refresh runs and needs an evidence report.
- Someone asks which primary source backs a published claim.

Do not use this skill to edit content. It produces evidence and findings; the edits belong to `add-primitive`, `add-provider`, and `generate-llms`.

## Workflow

### 1. Retrieve the sources

```bash
bun .github/skills/refresh-provider-docs/scripts/provider-docs.ts fetch --allow-network
bun .github/skills/refresh-provider-docs/scripts/provider-docs.ts fetch --allow-network --provider claude
```

Retrieval requires `--allow-network` every time. Nothing in this skill runs during an ordinary site build, and the site never depends on network access to render.

Snapshots and a `manifest.json` are written to a temporary directory outside the repository. Each snapshot carries its source id, canonical URL, authority, and retrieval timestamp in a header comment. If any source fails, the command exits non-zero: fix or retire the registry entry rather than publishing a claim you could not retrieve.

### 2. Read the snapshots and write claims

Read the retrieved files. For each thing the site asserts, or should assert, record a claim in a JSON array:

```json
{
  "id": "copilot.hooks.location",
  "provider": "copilot",
  "primitive": "hooks",
  "aspect": "location",
  "value": [".github/hooks/*.json", "~/.copilot/hooks/*.json"],
  "sourceId": "copilot.about-hooks",
  "sourceUrl": "https://docs.github.com/en/copilot/concepts/agents/hooks",
  "sourceAuthority": "primary",
  "retrievedAt": "2026-08-25",
  "notes": "Repository hooks apply to any Copilot agent; personal hooks apply to Copilot CLI."
}
```

Rules that keep claims honest:

- Record what the document says, not what the site already says. Reading the site first biases extraction.
- One claim per provider, primitive, and aspect. If two official pages disagree, record both and let the comparison mark it ambiguous.
- Quote paths exactly, including globs and extensions. `.mdc` and `.md` are different answers.
- Use `support: "none"` only when documentation states the capability is unavailable, never when documentation is merely silent.
- Leave the claim out when the documentation is unclear. Silence is a finding; a guess is a defect.

See `references/NORMALIZATION.md` for the aspect vocabulary and worked examples.

### 3. Validate, compare, and report

```bash
S=.github/skills/refresh-provider-docs
bun $S/scripts/provider-docs.ts validate claims.json
bun $S/scripts/provider-docs.ts compare claims.json --json findings.json
bun $S/scripts/provider-docs.ts report claims.json --out report.md
```

Each finding carries one of four statuses:

| Status | Meaning | What happens next |
| --- | --- | --- |
| `confirmed` | The published value matches its primary source | Nothing, and that is a result worth keeping |
| `changed` | Documentation and the site disagree, or the site cannot express the fact | Edit the data, or design the missing concept |
| `ambiguous` | The comparison cannot be settled deterministically | A person reads the cited sources and decides |
| `unsupported` | Documentation states the capability is unavailable | Do not publish a capability claim |

Exit codes: `0` clean, `1` fail-closed error, `2` findings require action. The scheduled refresh keys off exit code `2`.

### 4. Act on the findings

Apply `update-site-data` findings to `site/src/data/primitives.ts` and `site/src/data/comparison.ts` together, then regenerate published files with the `generate-llms` skill. The two data files must stay in sync; the comparison marks internal disagreement as ambiguous and refuses to proceed.

Treat `extend-site-model` findings as content design rather than a data edit. They mean the documented behavior has no home in the current taxonomy.

Re-run the comparison after editing so the report reflects the change.

## Fail-Closed Rules

The comparison refuses to guess. It returns `ambiguous` and asks for a person when:

- Two official sources disagree about the same fact.
- The only support for a claim is a secondary source.
- The cited source is not in the registry, belongs to another provider, or does not match the registered URL.
- The evidence is older than the registry's freshness limit.
- The site contradicts itself between `primitives.ts` and `comparison.ts`.

An empty claim set is treated as a failed retrieval, not a clean run.

## The Source Registry

`data/sources.json` holds every documentation entry point, its topic, and its authority. Primary means the provider's own documentation or source repository. Secondary means anything else, must carry a `note` justifying its use, and can never confirm a claim on its own.

```bash
bun .github/skills/refresh-provider-docs/scripts/provider-docs.ts sources
bun .github/skills/refresh-provider-docs/scripts/provider-docs.ts sources --check-urls --allow-network
```

Run the URL check before trusting a refresh; a silently moved documentation page is the most common way published claims go stale. See `references/SOURCE-REGISTRY.md` for the authority policy and how to add a provider.

## Validation

```bash
cd .github/skills/refresh-provider-docs && bun test
```

`bun test` skips hidden directories when invoked from the repository root, so run it from the skill directory.

The suite covers schema validation, every fail-closed path, report integrity, registry integrity, the network opt-in, and activation cases. `evals/trigger-queries.json` records when this skill should and should not activate.

## Worked Example

`reports/2026-08-25-claims.json` and `reports/2026-08-25-report.md` are a real run against the live site. Read them before your first refresh: they show the claim format, the four statuses, and the kind of drift this process is meant to catch.

## Related Skills

- `add-provider` adds a verified provider to the comparison system.
- `add-primitive` edits primitive data once a finding says what to change.
- `generate-llms` regenerates published machine-readable files after data edits.
