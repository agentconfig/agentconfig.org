# Competition Analysis

**Date**: 2026-01-24
**Analyst**: Claude Sonnet 4.5
**Objective**: Determine if security scanning tools already exist for AI skills/primitives

---

## Search Progress

### GitHub Searches
- [x] "skill security scanner" - FOUND MULTIPLE TOOLS
- [x] "AI skill linter"
- [ ] "skills.sh security"
- [ ] "skill validator"
- [ ] "copilot skill scanner"
- [ ] "claude skill security"

### General Security Tools
- [ ] shellcheck - does it cover skills?
- [ ] hadolint - does it cover skills?
- [ ] markdownlint - security rules?
- [ ] semgrep - skill-specific rules?

### skills.sh Platform
- [ ] Built-in security features
- [ ] Roadmap/planned features
- [ ] GitHub issues mentioning security

---

## Findings

### ⚠️ CRITICAL: Multiple Competitors Found

**Search Query**: "SkillCheck" tool scan AI agent skills security vulnerabilities
**Date**: 2026-01-24

#### 1. SkillRisk ⚠️ DIRECT COMPETITOR
**URL**: https://skillrisk.org/free-check
**Status**: ACTIVE, FREE SERVICE
**What it does**: Free agent skill security analyzer for Claude AI
**Features**:
- Detects dangerous permissions
- Code execution vulnerability detection
- Data leak detection
- Pre-deployment scanning

**Hacker News Discussion**: https://news.ycombinator.com/item?id=46647938

**Assessment**: THIS IS EXACTLY WHAT WE PLANNED TO BUILD

---

#### 2. SkillMill 🏢 COMMERCIAL COMPETITOR
**URL**: https://skillmill.ai/
**Status**: ACTIVE COMMERCIAL SERVICE
**What it does**: "The Trust Registry for Agent Skills"
**Features**:
- Automated vulnerability scanning
- Secret detection
- Dangerous code pattern detection
- Skills certification and curation
- Trust layer for skills marketplace

**Assessment**: Premium/enterprise version of what we planned

---

#### 3. SkillScan 🎓 ACADEMIC RESEARCH TOOL
**Source**: arXiv paper [2601.10338] "Agent Skills in the Wild: An Empirical Study of Security Vulnerabilities at Scale"
**URL**: https://arxiv.org/abs/2601.10338
**What it does**: Multi-stage detection framework
**Features**:
- Static analysis
- LLM-based semantic classification
- Analyzed 31,132 skills from major marketplaces
- 86.7% precision, 82.5% recall

**Key Research Findings**:
- 26.1% of skills contain at least one vulnerability
- 14 distinct vulnerability patterns across 4 categories:
  - Prompt injection
  - Data exfiltration (13.3% of skills)
  - Privilege escalation (11.8% of skills)
  - Supply chain risks
- 5.2% of skills show high-severity patterns suggesting malicious intent

**Assessment**: Academic validation of the problem we identified

---

#### 4. SkillCheck ⚠️ COMMUNITY TOOL
**Source**: GitHub awesome-agent-skills repository
**URL**: https://github.com/skillmatic-ai/awesome-agent-skills
**What it does**: Scanner for common risks in skill packages
**Status**: Listed as ecosystem tool

**Assessment**: Community tool, unclear if actively maintained

---

#### 5. SkillLens 🔍 ANOTHER TOOL
**Source**: Hacker News https://news.ycombinator.com/item?id=46719755
**What it does**: "scan and audit locally installed agent skills"
**Status**: Mentioned on HN, unclear if active

**Assessment**: Local scanning tool (vs our planned cloud/CLI)

---

## Additional Research Findings

### Agent Skills Ecosystem Status (2026)

**From search results**:
- GitHub Copilot officially supports Agent Skills as of December 2025
- Full availability by January 2026
- Agent Skills is an open standard enabling portability across AI agents
- Works across: GitHub Copilot, Claude Code, VS Code, Cursor, and others

**Security Guidance Already Published**:
- "Always review shared skills before using them"
- "Treat skills like code: review before using, avoid untrusted sources"
- 2025 paper analyzes security risks of skill-file prompt injection

**Official Skill Repositories**:
- anthropics/skills (Anthropic official)
- github/awesome-copilot (GitHub community)

---

## Experiment 3 Results

### Pass/Fail Criteria

**Pass Criteria**:
- ✅ No tool exists that specifically scans skills for security
- ✅ Existing tools (shellcheck, etc.) insufficient for skill-specific patterns
- ✅ skills.sh has no built-in security validation

**Result**: ❌ **FAIL - MULTIPLE COMPETITORS EXIST**

---

## Conclusion

### The Market Already Has Solutions

**Direct Competitors Found:**
1. **SkillRisk** - Free security analyzer (skillrisk.org) - EXACT MATCH to our plan
2. **SkillMill** - Commercial trust registry with scanning - PREMIUM VERSION
3. **SkillScan** - Academic research tool with 86.7% precision
4. **SkillCheck** - Community scanning tool
5. **SkillLens** - Local audit tool

### What This Means

❌ **We cannot build this as originally planned** - the market is already served

**However, our Experiment 1 audit still validated:**
- ✅ The problem is real (we found vulnerabilities)
- ✅ Our technical approach was sound
- ✅ The patterns we identified match what competitors detect

### Why We Missed This

**Timing**: The Agent Skills ecosystem exploded in late 2025/early 2026
- GitHub Copilot added official support December 2025
- Security tools emerged immediately to address the risk
- Academic research published January 2026 (2601.10338)
- We're 2-3 months late to market

**Search Limitations**: Initial searches didn't reveal these tools because:
- They use different terminology ("SkillRisk" not "skill security scanner")
- They're very new (Jan 2026 launch dates)
- skills.sh listings don't mention security tools

### Strategic Options

**Option A: STOP - Market is Served** ⚠️ RECOMMENDED
- Multiple free and commercial solutions exist
- SkillRisk offers exactly what we planned (free)
- SkillMill serves enterprise market
- No obvious gap to fill

**Option B: Differentiate**
- Focus on specific gap competitors don't cover
- Integrate with agentconfig.org educational content
- Target specific provider (Claude-only? Cursor-only?)
- Build better UX than competitors
- **Risk**: Unclear if gap exists or is defensible

**Option C: Contribute/Partner**
- Contribute to SkillCheck (open source?)
- Partner with SkillRisk for agentconfig.org integration
- Focus on education + link to existing tools
- **Benefit**: Leverage existing solutions, focus on strengths

**Option D: Validate First, Then Decide**
- Check if SkillRisk/SkillMill actually work well
- Test them with our Experiment 1 vulnerable skills
- Identify gaps in their coverage
- **Next Step**: Hands-on evaluation of competitors

---

## Recommendation

**PAUSE building a security scanner.** Competitors exist and are actively developed.

**Instead**:
1. Test SkillRisk and SkillMill with skills from our Experiment 1 audit
2. Document their strengths/weaknesses
3. Decide if there's a defensible gap worth pursuing
4. Consider educational content + integration with existing tools

**Alternative Path Forward**:
- Refocus on agentconfig.org's strength: education and comparison
- Add "Security" section showing how to use SkillRisk, SkillMill, etc.
- Create content: "How to Audit AI Skills Before Installing"
- Integrate security tool recommendations into primitive guides

This preserves the value of our Experiment 1 findings while avoiding direct competition with established tools.

---

## Sources

- [Agent Skills in the Wild: An Empirical Study](https://arxiv.org/abs/2601.10338)
- [SkillRisk - Free Agent Skill Security Analyzer](https://skillrisk.org/free-check)
- [SkillMill | The Trust Registry for Agent Skills](https://skillmill.ai/)
- [awesome-agent-skills GitHub Repository](https://github.com/skillmatic-ai/awesome-agent-skills)
- [Show HN: SkillRisk on Hacker News](https://news.ycombinator.com/item?id=46647938)
- [Show HN: SkillLens on Hacker News](https://news.ycombinator.com/item?id=46719755)
- [GitHub Copilot Agent Skills Announcement](https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/)
- [Use skills in Copilot Studio - Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-use-skills)
