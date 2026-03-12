# Agent Package Manager

Guide to understanding Agent Package Manager (APM) as a packaging and distribution
layer for existing agent primitives such as skills, instructions, prompts, agents,
hooks, plugins, and MCP servers.

## Tutorial Sections

- 1. What is APM? (beginner)
- 2. Why It Matters (beginner)
- 3. How It Relates to Primitives (beginner)
- 4. Manifest Mental Model (intermediate)
- 5. What It Packages (intermediate)
- 6. When to Use APM (advanced)
- 7. Further Reading

## Section Details

### 1. What is APM?

APM stands for Agent Package Manager. It introduces a manifest-driven way to install
and share collections of agent configuration assets.

It sits above the files this site already documents. You still have skills,
instructions, prompts, agents, hooks, plugins, and MCP servers. APM gives those
pieces a package-manager-style distribution mechanism.

### 2. Why It Matters

- Versioning shared agent setups explicitly
- Keeping multiple repositories aligned on one setup
- Packaging multiple primitives together in one installable manifest
- Making agent dependency changes visible in source control

### 3. How It Relates to Primitives

APM is not another primitive like skills or MCP. It is a layer for packaging those
primitives together.

- `SKILL.md` defines a workflow
- `AGENTS.md` or provider instruction files define guidance
- `mcp.json` or equivalent connects tools
- `apm.yml` can assemble and distribute those files as one package

### 4. Manifest Mental Model

`apm.yml` behaves like a dependency manifest:

```yaml
name: agentconfig.org
version: 1.0.0
dependencies:
  apm:
    - anthropics/skills/skills/frontend-design
    - github/awesome-copilot/agents/api-architect.agent.md
    - microsoft/apm-sample-package
```

Packaging view:

```
apm.yml
  ├─ skills
  ├─ instructions
  ├─ prompts
  ├─ agents
  ├─ hooks/plugins
  └─ mcp servers
```

### 5. What It Packages

- Skills
- Instructions
- Prompts and agents
- Hooks, plugins, and MCP servers

### 6. When to Use APM

- Use raw primitives when experimenting locally or learning the building blocks
- Use APM when multiple teams or repositories need the same reproducible setup
- Use both when you author the primitive files directly but want a clean distribution layer

## Further Reading

- [Microsoft APM](https://microsoft.github.io/apm/): The main APM documentation site with concepts, manifests, and package examples.
- [Microsoft APM Repository](https://github.com/microsoft/apm): Source code, examples, and issue tracker for the Agent Package Manager project.
- [agentskills.io Specification](https://agentskills.io/specification): Useful background for understanding one of the primitives that APM can package.
- [AGENTS.md Specification](https://agents.md): Background on the agent instruction files that APM can distribute alongside other assets.
- [MCP Specification](https://modelcontextprotocol.io/specification/latest): Reference for the MCP server configurations and tooling APM can bundle into a setup.
