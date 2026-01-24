# Security Audit Results

**Date**: 2026-01-24
**Auditor**: Claude Sonnet 4.5
**Skills Reviewed**: 3/20 (in progress)

## Summary
- **Critical issues found**: 2 (command injection, path traversal)
- **Medium issues found**: 3 (unsafe XML processing, missing input validation, arbitrary code execution)
- **Low issues found**: 0
- **Clean skills**: 2 (pdf, xlsx)

## Audit Progress

### Skills to Audit (20 total)

**Infrastructure & Deployment (High Priority):**
1. [ ] vercel-react-best-practices (vercel-labs) - 39.6K installs
2. [ ] agent-browser (vercel-labs) - 3.1K installs
3. [ ] expo-deployment (expo) - 2.0K installs
4. [ ] dependency-updater (softaworks) - 839 installs
5. [ ] helm-chart-scaffolding (wshobson) - 183 installs

**API & Integration:**
6. [ ] stripe-best-practices (stripe/ai) - 247 installs
7. [ ] supabase-postgres-best-practices (supabase) - 2.2K installs
8. [ ] better-auth-best-practices (better-auth) - 2.6K installs
9. [ ] elysiajs (elysiajs) - 230 installs
10. [ ] openrouter-typescript-sdk (openrouterteam) - 111 installs

**File Operations:**
11. [x] pdf (anthropics/skills) - 1.7K installs - ✅ CLEAN
12. [x] xlsx (anthropics/skills) - 1.3K installs - ✅ CLEAN
13. [x] docx (anthropics/skills) - 1.3K installs - ⚠️ CRITICAL/MEDIUM ISSUES
14. [ ] web-artifacts-builder (anthropics) - 837 installs
15. [ ] document-illustrator (op7418) - 103 installs

**Network & Security:**
16. [ ] web-design-guidelines (vercel-labs) - 30.1K installs
17. [ ] audit-website (squirrelscan) - 2.5K installs
18. [ ] seo-audit (coreyhaines31/marketingskills) - 2.6K installs
19. [ ] k8s-security-policies (wshobson) - 191 installs
20. [ ] mtls-configuration (wshobson) - 173 installs

---

## Detailed Findings

### ✅ Clean Skills

#### 1. pdf (anthropics/skills)
**Repository**: https://github.com/anthropics/skills
**Install Count**: 1.7K
**Audit Result**: CLEAN

**Findings:**
- No hardcoded credentials
- No command injection vulnerabilities
- No path traversal issues
- No arbitrary code execution risks
- Uses well-established Python libraries (pypdf, pdfplumber, reportlab)
- Command-line examples use static file paths
- All library usage follows documented APIs

**Minor Recommendations:**
- Add input validation guidance for file paths
- Document memory limits for processing large PDFs
- Recommend sandboxing for untrusted PDF files (OCR scenarios)

---

#### 2. xlsx (anthropics/skills)
**Repository**: https://github.com/anthropics/skills
**Install Count**: 1.3K
**Audit Result**: CLEAN

**Findings:**
- No security vulnerabilities detected
- Instructional documentation emphasizing proper formula construction
- Uses pandas and openpyxl libraries safely
- No sensitive credentials, API keys, or authentication mechanisms exposed
- Promotes spreadsheet integrity through formulas over hardcoded values

---

### ⚠️ Skills with Security Issues

#### 3. docx (anthropics/skills) - CRITICAL & MEDIUM ISSUES
**Repository**: https://github.com/anthropics/skills
**Install Count**: 1.3K
**Audit Result**: MULTIPLE VULNERABILITIES FOUND

**CRITICAL ISSUE #1: Command Injection Risk**
- **Severity**: CRITICAL
- **Location**: Shell command examples in documentation
- **Issue**: User-supplied filenames could contain shell metacharacters
- **Evidence**:
  ```bash
  pandoc --track-changes=all path-to-file.docx -o output.md
  python ooxml/scripts/unpack.py <office_file> <output_directory>
  ```
- **Impact**: Arbitrary command execution if user input is not sanitized
- **Fix**: Add explicit input sanitization examples; validate/escape file paths before shell execution
- **Example Exploit**:
  ```bash
  # Malicious filename: "file.docx; rm -rf /"
  pandoc --track-changes=all file.docx; rm -rf / -o output.md
  ```

**CRITICAL ISSUE #2: Path Traversal Vulnerability**
- **Severity**: CRITICAL
- **Location**: File path handling in unpack script
- **Issue**: No validation that output directories don't escape intended locations
- **Evidence**:
  ```bash
  python ooxml/scripts/unpack.py <office_file> <output_directory>
  ```
- **Impact**: Unauthorized file access/write outside intended directory
- **Fix**: Validate paths; reject `../` sequences; use allowlists for output directories
- **Example Exploit**:
  ```bash
  # Malicious output path: "../../../etc/"
  python ooxml/scripts/unpack.py file.docx ../../../etc/
  ```

**MEDIUM ISSUE #1: Unsafe XML Processing**
- **Severity**: MEDIUM
- **Location**: XML parsing documentation
- **Issue**: Missing emphasis on XXE (XML External Entity) protections
- **Impact**: Potential XXE attacks when processing untrusted documents
- **Fix**: Mandate `defusedxml` usage for all XML parsing of untrusted documents
- **Note**: `defusedxml` is listed as dependency but not explicitly required in docs

**MEDIUM ISSUE #2: Missing Input Validation Guidance**
- **Severity**: MEDIUM
- **Location**: General workflow documentation
- **Issue**: No guidance on validating document size, structure, or content before processing
- **Impact**: Denial-of-service or resource exhaustion attacks via malicious documents
- **Fix**: Document maximum file size limits; recommend structure validation

**MEDIUM ISSUE #3: Arbitrary Code Execution via Script Files**
- **Severity**: MEDIUM
- **Location**: Workflow instructions
- **Issue**: Users instructed to "create and run Python scripts" without security warnings
- **Impact**: Risk if scripts come from untrusted sources or have improper permissions
- **Fix**: Add warnings about script source validation, file permissions, sandboxing

**Recommendations for docx skill:**
1. Add explicit input sanitization examples for all file paths
2. Document path validation requirements (reject traversal sequences)
3. Mandate `defusedxml` for all XML parsing
4. Include security warnings about running user-supplied scripts
5. Specify maximum document size limits to prevent DoS
6. Add example code showing safe file path handling

---

## Audit Methodology

For each skill, checking for:

**Critical Issues:**
- [ ] Hardcoded credentials (API keys, tokens, passwords)
- [ ] Command injection vulnerabilities (unsanitized user input in bash)
- [ ] Path traversal risks (file operations without validation)
- [ ] Arbitrary code execution (eval, curl | bash, base64 decode pipes)

**Medium Issues:**
- [ ] Excessive permissions requests
- [ ] Unvalidated external network calls
- [ ] Missing error handling on sensitive operations
- [ ] Hardcoded URLs/endpoints (should be configurable)

**Low Issues:**
- [ ] Missing input validation
- [ ] Poor documentation of required secrets
- [ ] Overly broad file patterns
