# Cursor Provider Implementation Strategy

## Executive Summary

Add Cursor as a third provider to the agentconfig.org provider comparison system. The implementation requires coordinated work across 6 major work streams: research, type systems, data layer, UI components, testing, and documentation.

**Current state**: 2 providers (Copilot, Claude)
**Target state**: 3 providers (Copilot, Claude, Cursor)
**Estimated complexity**: Medium
**Parallel work streams**: 6 streams with strategic dependencies

## Implementation Overview

### What Needs to Change

**Files that must be modified**:
1. `site/src/data/primitives.ts` - Add Cursor to Provider type, add implementations across the tracked primitives
2. `site/src/data/comparison.ts` - Add Cursor field to ComparisonRow interface and matching data rows
3. `site/src/data/fileTree.ts` - Add Cursor to Provider type, add file tree nodes
4. `site/src/components/ProviderComparison/ComparisonTable.tsx` - Add Cursor column to table
5. `site/tests/e2e/comparison.spec.ts` - Add tests for 3-provider layout

**Data needed**:
- Cursor implementation of each tracked primitive
- File paths/locations for each implementation
- Support levels (full/partial/none/diy)

### Tracked Primitives to Cover

| Category | Primitive |
|----------|-----------|
| **Execution** | Agent Mode |
| | Skills / Workflows |
| | Tool Integrations (MCP) |
| **Customization** | Persistent Instructions |
| | Global Instructions |
| | Path-Scoped Rules |
| | Slash Commands |
| **Safety** | Custom Agents |
| | Permissions & Guardrails |
| | Lifecycle Hooks |
| | Verification / Evals |

## 6-Stream Parallel Workflow

### Stream 1: Research (CRITICAL PATH START)
**Owner**: Research Specialist
**Duration**: 1-2 days
**Dependencies**: None (can start immediately)

**Tasks**:
1. Research Cursor's implementation of each tracked primitives
2. Verify support level (full/partial/none/diy) for each
3. Document implementation details and file locations
4. Create structured JSON and markdown deliverables
5. Peer review research accuracy

**Deliverables**:
- `cursor-primitives-data.json` - Machine-readable format
- `cursor-research-findings.md` - Human-readable summary
- Research notes and verification checklist

**Handoff**: Pass structured data to Data Layer engineer

---

### Stream 2: Type System Updates (CAN START IMMEDIATELY)
**Owner**: Type System Engineer
**Duration**: 2-4 hours
**Dependencies**: None (can start in parallel with research)

**Tasks**:
1. Add `'cursor'` to Provider union type in:
   - `site/src/data/primitives.ts`
   - `site/src/data/fileTree.ts`
2. Update `ComparisonRow` interface in `site/src/data/comparison.ts`:
   - Add `cursor: ProviderSupport` field
3. Verify no TypeScript errors after changes
4. Create PR for type changes

**Deliverables**:
- Updated type definitions
- PR ready for merge

**Notes**:
- This work is straightforward and can happen independently
- No dependencies on research data
- Foundation for next phases

---

### Stream 3: Data Layer Updates (DEPENDS ON RESEARCH)
**Owner**: Data Layer Engineer
**Duration**: 4-6 hours
**Dependencies**: Stream 1 (research data) + Stream 2 (types)

**Tasks**:
1. Wait for Stream 1 research data
2. Add Cursor implementation to each primitive in `site/src/data/primitives.ts`:
   ```typescript
   implementations: [
     { provider: 'copilot', ... },
     { provider: 'claude', ... },
     { provider: 'cursor', implementation: '...', location: '...', support: '...' }
   ]
   ```
3. Add Cursor data to each row in `site/src/data/comparison.ts`:
   ```typescript
   {
     primitiveId: '...',
     primitiveName: '...',
     copilot: { ... },
     claude: { ... },
     cursor: { level: '...', implementation: '...', location: '...' }
   }
   ```
4. Add Cursor file tree nodes to `site/src/data/fileTree.ts` (if applicable)
5. Verify data structure and imports work
6. Create PR for data changes

**Deliverables**:
- Updated data files with Cursor implementations
- PR ready for merge

**Blockers**:
- Must wait for Stream 1 research to be complete
- Cannot proceed until Stream 2 types are merged

---

### Stream 4: UI Component Updates (DEPENDS ON DATA)
**Owner**: UI Engineer
**Duration**: 4-8 hours
**Dependencies**: Stream 2 (types) + Stream 3 (data)

**Tasks**:
1. Wait for Stream 2 and 3 to be merged
2. Update `site/src/components/ProviderComparison/ComparisonTable.tsx`:
   - Add Cursor to table header (3 provider columns instead of 2)
   - Add Cursor support badge to each row
   - Ensure responsive layout with 3 columns
   - Add Cursor implementation details to expandable rows
3. Update `site/src/components/ProviderComparison/ProviderComparisonSection.tsx`:
   - Update any legend or provider count references
   - Verify styling works with 3 providers
4. Test dark mode styling
5. Visual inspection and responsive testing
6. Create PR for UI changes

**Deliverables**:
- Updated ComparisonTable component
- Updated ProviderComparisonSection component
- PR ready for merge

**Design considerations**:
- Support badges: green (full) | amber (partial) | gray (none)
- Support icons: ✓ | ◐ | —
- Copy buttons for Cursor locations
- Responsive design (3 columns may need horizontal scroll on mobile)

---

### Stream 5: Testing (DEPENDS ON UI)
**Owner**: QA Engineer
**Duration**: 3-4 hours
**Dependencies**: Stream 4 (UI updates)

**Tasks**:
1. Wait for Stream 4 to be merged
2. Update `site/tests/e2e/comparison.spec.ts`:
   - Add tests for Cursor column visibility
   - Add tests for Cursor row expansion and details display
   - Add tests for Cursor copy button functionality
   - Verify responsive layout with 3 columns
   - Test dark mode styling
3. Run full E2E test suite
4. Add tests for edge cases:
   - Cursor with 'none' support level
   - Cursor with partial support
   - Cursor implementation details overflow
5. Create PR for test changes

**Deliverables**:
- Updated E2E tests
- Test results showing 3-provider layout works
- PR ready for merge

**Test scenarios to cover**:
- Table renders all 3 providers
- Cursor column has correct support levels
- Row expansion shows Cursor details
- Copy button works for all 3 providers
- Responsive layout on mobile
- Dark mode works with 3 columns
- No layout shifts when expanding rows

---

### Stream 6: Documentation & Polish (FINAL PASS)
**Owner**: Documentation Specialist
**Duration**: 2-3 hours
**Dependencies**: Streams 2-5 (all PRs merged)

**Tasks**:
1. Wait for all previous streams to be merged
2. Search codebase for hardcoded provider references:
   - Provider count hardcoded anywhere?
   - Screenshots showing 2 providers only?
   - Comments mentioning "2 providers"?
3. Update documentation:
   - README if it mentions provider count
   - Cursor documentation links if needed
   - Comment updates
4. Verify llms.txt generation includes Cursor data
5. Create final verification PR

**Deliverables**:
- Updated documentation
- Verification that everything works end-to-end
- Final PR ready for merge

**Verification checklist**:
- [ ] 3 providers display correctly in comparison
- [ ] All tracked primitives have Cursor data
- [ ] No TypeScript errors
- [ ] E2E tests pass
- [ ] Responsive design works
- [ ] Dark mode works
- [ ] No hardcoded "2 provider" references
- [ ] Documentation updated

---

## Dependency Graph

```
Start
  ├─> Stream 1 (Research)
  │   └─> Stream 3 (Data Layer) ─────┐
  │                                  ├─> Stream 4 (UI) ─┬─> Stream 5 (Testing) ─┐
  └─> Stream 2 (Types) ──────────────┘                  └─> Stream 6 (Documentation) ◄─┘
```

**Critical path**: Research → Data Layer → UI → Testing → Documentation

**Non-blocking work**: Types can be done in parallel with Research

## Team Coordination Details

### Pre-Implementation Checklist
- [ ] Approve plan and strategy
- [ ] Assign team members to 6 streams
- [ ] Create GitHub issues for each stream
- [ ] Link issues to epic or project board

### During Implementation
- **Daily standups**: Brief sync on blockers
- **Stream leads check in**: Before starting dependent work
- **Research review**: Have 2 people verify research accuracy
- **Testing before merge**: Each PR tested before merging to main

### Post-Implementation Checklist
- [ ] All 6 streams completed
- [ ] All PRs merged
- [ ] Build passes
- [ ] E2E tests pass
- [ ] Deployed to production
- [ ] Announce Cursor support

## Potential Issues & Mitigations

### Issue: Cursor support data incomplete/unavailable
**Mitigation**:
- Use 'none' or 'diy' support levels for unsupported features
- Document uncertainty with notes
- Mark for review once Cursor docs are updated
- Plan for iterative updates

### Issue: Cursor feature naming doesn't align with primitives
**Mitigation**:
- Map to closest primitive match
- Document mapping and rationale
- Consider if new primitive is needed

### Issue: 3-column layout breaks responsive design
**Mitigation**:
- Implement horizontal scroll on mobile
- Consider toggling between 2-provider and 3-provider views
- Test thoroughly across device sizes

### Issue: Research takes longer than expected
**Mitigation**:
- Prioritize high-impact primitives first
- Accept partial data initially
- Plan follow-up research for complete data

### Issue: Type changes break existing code
**Mitigation**:
- Run TypeScript checks after each change
- Search for Provider type usage in codebase
- Update all affected components before merging

## Success Metrics

✅ Cursor added to Provider type
✅ All tracked primitives have Cursor implementation data
✅ ComparisonTable renders 3 providers correctly
✅ All E2E tests pass with 3 providers
✅ No TypeScript errors
✅ Responsive design works
✅ Dark mode works
✅ Documentation updated
✅ Deployed to production

## Timeline Estimate

**Parallel execution**:
- Stream 1 (Research): 1-2 days (longest path)
- Stream 2 (Types): 2-4 hours (can overlap)
- Remaining streams: Sequential, ~1 day each

**Total calendar time**: 2-3 days (with parallelization)
**Total person-days**: ~3-4 days of work

## Next Actions

1. **Get approval** on this strategy
2. **Conduct research** (Stream 1) - start immediately
3. **Start type updates** (Stream 2) - can start in parallel
4. **Sequence dependent work**: Wait for research before Data Layer (Stream 3)
5. **Monitor critical path**: Research → Data → UI → Testing

## Files to Monitor

Watch these files for changes that might affect Cursor provider work:
- `site/src/data/primitives.ts` - Core primitive definitions
- `site/src/components/ProviderComparison/ComparisonTable.tsx` - Table component
- `site/src/data/comparison.ts` - Comparison data
- Any new primitive additions (would need Cursor data too)

## Questions Before Starting

- Who will own each of the 6 streams?
- What's the priority if we can't complete all streams immediately?
- Should we launch with partial Cursor data or wait for complete research?
- Are there constraints on the UI layout we should know about?
- Should Cursor get Cursor-specific documentation/guide pages?
