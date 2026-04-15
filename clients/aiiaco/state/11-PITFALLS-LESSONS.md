# AiiAco — Pitfalls and Lessons Learned

Gotchas we discovered during this engagement. Each has root cause + workaround + prevention.

---

## Pitfall 1: `useLocation()` outside Router fails silently at SSR

**Symptom**: JSON-LD schema dispatch (BreadcrumbList, HowTo, FAQPage) never appeared in SSR output, but no errors were thrown.

**Root cause**: wouter's `useLocation()` hook falls back to `useBrowserLocation()` when called outside `<Router>`. On server, `window.location` is undefined, so the hook returns empty path `/`. StructuredDataSSR's route dispatch checked for specific paths and fell through for all of them.

**Detection**: Phase A adversarial critic caught it by reading entry-server.tsx render tree and noticing the `<StructuredDataSSR />` was rendered OUTSIDE `<Router hook={hook}>`.

**Fix**: Refactored `StructuredDataSSR` to accept `pathname` as a prop instead of calling `useLocation()` internally. `entry-server.tsx` now passes `pathname={url}` explicitly. Client-side `StructuredData.tsx` wraps it with `useLocation()` hook and normalizes pathname.

**Prevention rule**: Any component that reads router state must EITHER be rendered inside `<Router>` AND use the hook, OR take `pathname` as a prop (preferred for SSR safety).

**Code pattern to avoid**:
```tsx
// WRONG: useLocation() inside a component rendered at top level
function MySchemaComponent() {
  const [pathname] = useLocation(); // Breaks at SSR if rendered outside Router
  return <Helmet>...</Helmet>;
}
```

**Code pattern to use**:
```tsx
// RIGHT: component takes pathname as prop
function MySchemaComponent({ pathname }: { pathname: string }) {
  return <Helmet>...</Helmet>;
}

// SSR usage (inside Router context):
<Router hook={hook}>
  <MySchemaComponent pathname={url} />
</Router>

// Client usage (thin wrapper using hook):
function MySchemaComponentClient() {
  const [pathname] = useLocation(); // Only works if parent is Router
  return <MySchemaComponent pathname={pathname || "/"} />;
}
```

---

## Pitfall 2: MotionConfig reducedMotion="always" doesn't override `initial` prop

**Symptom**: We wrapped the SSR tree in `<MotionConfig reducedMotion="always">` expecting hero content to render at final state. Instead, it still rendered at `opacity:0; transform:translateY(24px)` in SSR HTML.

**Root cause**: Framer Motion 12.x `reducedMotion="always"` suppresses TRANSITIONS (makes them duration: 0), but does NOT override the `initial` prop. Components with `initial={{ opacity: 0 }}` still render at opacity:0 — the transition to the animate state is just instant.

**Detection**: Phase A critic caught it by reading Framer Motion docs and suggesting verification.

**Fix**: Removed MotionConfig wrapper entirely. Moved the fix to `scripts/prerender.mjs` post-processor (`makeFramerContentVisible`) which rewrites inline style strings on the already-rendered HTML.

**Post-processor code**:
```js
function makeFramerContentVisible(html) {
  return html.replace(/style="([^"]*)"/g, (_match, styleBody) => {
    const hasOpacityZero = /opacity:\s*0(?![.\d])/.test(styleBody);
    const hasTranslate = /transform:\s*translate[XY]\([^)]+\)/.test(styleBody);
    if (!hasOpacityZero || !hasTranslate) return `style="${styleBody}"`;
    let rewritten = styleBody
      .replace(/opacity:\s*0(?![.\d])/g, "opacity:1")
      .replace(/transform:\s*translate[XY]\([^)]+\)/g, "transform:none");
    return `style="${rewritten}"`;
  });
}
```

**Why the scoping matters**: Phase B+C critic pointed out that a naive global regex would break legitimate static layout transforms (badge centering via `translateX(-50%)`, progress bar fills, hidden modals). The scoped version only rewrites style attributes where BOTH `opacity:0` AND `translate{X|Y}(...)` appear together — that's the Framer Motion initial state fingerprint.

**Prevention rule**: Never trust framer-motion version-dependent flags for SSR rendering behavior. Post-process HTML strings with scoped regexes that have safety guards.

---

## Pitfall 3: react-helmet-async last-one-wins merge creates hidden order dependencies

**Symptom**: Admin pages wrapped in `<NoindexRoute>` were getting their titles clobbered with "Private - AiiAco" placeholder.

**Root cause**: The earlier NoindexRoute version rendered `<SEO noindex title="Private - AiiAco" description="Internal route. Not indexed." />` before its children. react-helmet-async merges with last-one-wins semantics for `<title>` — but only if the child emitted its own `<title>`. If the child didn't render `<SEO>`, the NoindexRoute's placeholder title won.

**Detection**: Phase B+C critic caught it by tracing the merge order.

**Fix**: Refactored `NoindexRoute` to inject ONLY `<meta name="robots">` via a bare `<Helmet>`, never a full `<SEO>` component. Children retain title authority.

**New code**:
```tsx
import { Helmet } from "react-helmet-async";

export default function NoindexRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </Helmet>
      {children}
    </>
  );
}
```

**Prevention rule**: When wrapping other components with a react-helmet-async injector, only inject the MINIMUM set of tags. Never place title/description/canonical unless you're SURE the children don't emit their own.

---

## Pitfall 4: wouter Link vs raw `<a href>` for internal navigation

**Symptom**: Clicking back button or internal links on IndustryMicrosite.tsx caused full page reloads, losing React state and re-downloading the SPA shell.

**Root cause**: The page used raw `<a href="/industries">...</a>` for internal navigation. Raw `<a>` tags trigger browser navigation, not wouter's client-side routing.

**Detection**: Phase B+C critic caught it by inspecting the JSX.

**Fix**: Replaced all internal `<a href>` tags with wouter `<Link href>`. Wouter's Link renders an anchor internally but intercepts clicks to use client-side routing.

**Rules**:
- Internal absolute paths (`/...`) → use `<Link>`
- External URLs (`https://...`) → use `<a target="_blank" rel="noopener noreferrer">`
- Anchor links (`#section`) → use `<a>` (wouter doesn't handle fragments)
- Calendly/Stripe/etc embeds → use `<a>` with target blank

**Code pattern**:
```tsx
import { Link } from "wouter";

// Internal:
<Link href="/industries" className="...">← All Industries</Link>

// External:
<a href="https://calendly.com/aiiaco" target="_blank" rel="noopener noreferrer">Book</a>
```

---

## Pitfall 5: Sitemap drift between declared routes and actual rendering

**Symptom**: We regenerated sitemap.xml in Phase B to remove off-brand industries. But we included 5 new service routes (ai-crm-integration etc.) that didn't exist in the router yet. Googlebot would have crawled those URLs and gotten 404s.

**Root cause**: Sitemap was ahead of code. Tried to be optimistic about upcoming work.

**Detection**: Phase B+C critic caught by cross-referencing sitemap URLs against App.tsx Route declarations.

**Fix**: Temporarily removed the 5 new URLs from sitemap during Phase B, then re-added them in Phase E after the pages were actually created.

**Prevention rule**: Never declare a URL in sitemap.xml unless it has:
1. A corresponding `<Route>` in App.tsx
2. A corresponding entry in entry-server.tsx routeMap
3. A corresponding entry in scripts/prerender.mjs STATIC_ROUTES
4. A corresponding PAGE_META entry in seo.config.ts

All 5 must be in sync. The sanity check command is in `state/07-COMMANDS.md`.

---

## Pitfall 6: First-match semantics in wouter Switch

**Symptom**: Admin `/operator` route was publicly indexable despite being wrapped in NoindexRoute at the bottom of App.tsx.

**Root cause**: App.tsx had two routes for `/operator`:
```tsx
<Route path="/operator" component={OperatorPage} />  // Line 74 - unwrapped
// ... many other routes ...
<Route path="/operator">                              // Line 99 - wrapped in NoindexRoute
  <NoindexRoute><OperatorPage /></NoindexRoute>
</Route>
```

wouter `<Switch>` uses first-match. Line 74 (unwrapped) always won. The noindex version was dead code.

**Detection**: Phase B+C critic caught by grepping for duplicate route declarations.

**Fix**: Removed the line-74 unwrapped route.

**Prevention rule**: When refactoring routes, grep for duplicates BEFORE declaring the refactor done:
```bash
grep -c 'path="/operator"' client/src/App.tsx  # should be 1
```

---

## Pitfall 7: Explicit /404 route returning HTTP 200 → soft-404

**Symptom**: Visiting `https://aiiaco.com/404` returned HTTP 200 with the NotFound component. Google Search Console would flag as soft-404.

**Root cause**: App.tsx had `<Route path="/404" component={NotFound} />` as an explicit route. wouter can't set HTTP status codes (it's client-side routing), so it returns 200 from the server shell.

**Detection**: Phase B+C critic.

**Fix**: Removed the explicit `/404` route. The `<Route component={NotFound} />` fallback at the bottom of Switch catches unknown URLs including `/404`.

**Mitigation for current soft-404 risk**: NotFound.tsx has `<SEO noindex suppressCanonical />`. Even if the URL returns 200, Google won't index it due to noindex meta.

**Prevention rule**: Don't create explicit routes for error pages. Use wouter's fallback pattern.

---

## Pitfall 8: Prerender title-strip regex stripped too aggressively

**Symptom**: Pages without explicit `<SEO title>` calls got no title tag in the prerendered HTML.

**Root cause**: The original prerender.mjs code ALWAYS stripped the shell `<title>` and expected helmet to inject a replacement. If helmet didn't emit a title (because the page didn't render `<SEO>` with an explicit title), the page ended up with no title.

**Detection**: Phase A critic.

**Fix**: Wrapped the strip in a conditional:
```js
if (helmetTitleStr && helmetTitleStr.trim().length > 0) {
  output = output.replace(/<title>[^<]*<\/title>/, "");
}
```

Only strips the shell title if helmet actually produced one.

**Prevention rule**: Transformations that REMOVE content should always check that the replacement exists first.

---

## Pitfall 9: Dead code in seo.config.ts PAGE_META

**Symptom**: Pages were hardcoding their own titles via `<SEO title="..." />` even though seo.config.ts had a PAGE_META map. Updating PAGE_META had no effect anywhere.

**Root cause**: PAGE_META was defined but never imported. SEO.tsx only read the `title` prop.

**Detection**: Phase A critic by grepping for imports of PAGE_META.

**Fix**: Added PAGE_META import to SEO.tsx and wired as fallback:
```tsx
const pageTitle = title ?? PAGE_META[path]?.title ?? SITE.defaultTitle;
```

Resolution chain: explicit prop → PAGE_META lookup → SITE default.

**Prevention rule**: When you create a "config source of truth", also create the CONSUMER that reads from it. Don't declare config without wiring.

---

## Pitfall 10: Python regex `re.subn` with `.*?` + DOTALL non-greedy bracket matching

**Symptom**: First attempt at Python removal of off-brand industries left dangling fragments (incomplete objects with unmatched braces).

**Root cause**: Used `re.subn(pattern, ..., content, count=1, flags=re.DOTALL)` with `.*?` non-greedy pattern. Regex does not respect nested brace matching — it finds the first `},` but that's not the actual object close.

**Fix**: Switched to proper line-by-line brace-counting parser:
```python
def find_industry_block(lines, slug):
    for i, line in enumerate(lines):
        if f'slug: "{slug}"' in line:
            start = i
            while start > 0 and lines[start].strip() != '{':
                start -= 1
            depth = 0
            for j in range(start, len(lines)):
                for ch in lines[j]:
                    if ch == '{':
                        depth += 1
                    elif ch == '}':
                        depth -= 1
                        if depth == 0:
                            return start, j
            return None
    return None
```

**Prevention rule**: Never use regex to parse nested structures. Use a proper parser (even a simple brace counter).

---

## Pitfall 11: Manus source ZIP is not a git repo

**Symptom**: Tried `git status` in the extracted Manus ZIP folder. Got `fatal: not a git repository`.

**Root cause**: Manus's ZIP download contains source files but not git history. `.git/` folder is not included.

**Impact**: Can't make atomic commits locally. No diff versioning. Have to track changes manually or via our own git init.

**Workaround**: Could run `git init` in the extracted folder, commit the original state, then track changes. We didn't do this for Round 2 — relied on file-level edits tracked mentally + sanity greps. For Round 3+ consider initializing git.

**Prevention rule**: On next ZIP extraction, immediately `git init && git add -A && git commit -m "initial extraction"` to have a baseline.

---

## Pitfall 12: Firecrawl scrape output exceeds Claude context

**Symptom**: Used `firecrawl_scrape` on aiiaco.com homepage. Output was 705,072 characters (full rendered HTML). Claude couldn't ingest directly.

**Workaround**: Firecrawl automatically saves large outputs to a temp file path. Use `Grep` on that path instead of reading the content directly.

**Example**:
```
Output saved to /private/tmp/.../mcp-firecrawl-mcp-firecrawl_scrape-*.txt
```

Then:
```
Grep pattern: "specific term" path: /private/tmp/.../file.txt
```

**Prevention rule**: When scraping JS-heavy SPAs or large pages, use `onlyMainContent: true` to reduce output, and be ready to Grep the temp file.

---

## Pitfall 13: Agent spawning "Prompt is too long" error

**Symptom**: Tried to spawn a subagent with a detailed 3000+ word prompt. Got `Prompt is too long` error.

**Root cause**: Subagent prompts have a token limit (approximately 2500-3000 words of plain text).

**Workaround**: Either:
1. Shorten the prompt to under 2500 words
2. Break the work into multiple agent spawns with narrower scope each
3. Store long context in a file and have the agent read it

**Prevention rule**: Keep agent prompts focused. If you need to pass 100 lines of context, save to a temp file and point the agent at it.

---

## Pitfall 14: Brand casing drift between files

**Symptom**: Three different homepage titles existed simultaneously:
- Home.tsx: "AiiA | Remove Operational Friction..."
- index.html shell: "AiiAco | AI Integration Authority..."
- seo.config.ts PAGE_META["/"]: different again

**Root cause**: No single source of truth for the homepage title. Different phases of the engagement wrote different values in different files.

**Detection**: Phase A critic cross-referenced all three.

**Fix**:
1. Aligned all three to the canonical value
2. Wired SEO.tsx to use PAGE_META as fallback
3. Removed explicit title from Home.tsx — now uses `<SEO path="/" />` which resolves via PAGE_META

**Prevention rule**: When you have a fallback chain (prop → config → default), make sure all levels of the chain agree on the canonical value. Periodically grep across files to verify consistency.

---

## Pitfall 15: Duplicate schema emission from global + page components

**Symptom**: Earlier StructuredData.tsx (client-side) was emitting Organization, WebSite, Service, FAQPage, HowTo schemas GLOBALLY on every page, in addition to the schemas hardcoded in index.html shell. Google saw each schema twice.

**Root cause**: Client component was a copy-paste of the SSR component from an earlier iteration. Nobody noticed the duplication.

**Detection**: Phase A critic reading StructuredData.tsx vs index.html.

**Fix**: Rewrote StructuredData.tsx as a thin client dispatcher that:
1. Uses wouter useLocation (inside Router context)
2. Calls StructuredDataSSR with pathname prop
3. Delegates all schema building to the SSR component
4. Does NOT emit any globally-present schemas (those live in index.html shell only)

**Prevention rule**: Global schemas in static HTML + page-specific schemas in React is a valid pattern, but ensure page-specific components NEVER duplicate globals.

---

## Pitfall 16: Inline em-dashes in Framer Motion initial prop strings

**Symptom**: Em-dashes were in React props, JSX children, TypeScript string literals. Simple global find-replace broke some cases.

**Root cause**: Em-dashes appeared in many contexts:
- `<span>—</span>` (literal character as child)
- `" — "` (inside strings with spaces around)
- `"word—word"` (inside strings without spaces)
- In comments
- In JSX attributes

**Fix**: Ordered Python replacement rules:
```python
content = content.replace(">—<", ">•<")    # JSX child -> bullet
content = content.replace(" — ", " - ")     # spaced
content = content.replace(" —", " -")        # trailing space
content = content.replace("— ", "- ")        # leading space
content = content.replace("—", "-")          # raw
```

The ordering matters: bullet replacement first (catches JSX children), then spacing variants, then raw. Global regex alone would miss the JSX child case.

**Prevention rule**: Batch character replacements should handle multiple context cases in ordered passes. Test on a small subset first.

---

## General lessons

### Lesson 1: Adversarial critics are 10x better than self-review
We found 67 bugs across 3 critic passes. Many were subtle (duplicate routes bypassing wrappers, schema drift between files). Manual self-review would have missed most of them.

**Pattern**: After any significant code change, spawn a fresh `general-purpose` subagent with a hostile critic brief (minimum 10 findings required). Apply critical + high fixes. Re-run the critic if the fixes touched many files.

### Lesson 2: Test cross-file consistency constantly
Most critical bugs we found were NOT in a single file — they were MISMATCHES between files (canonical/title/schema drift, sitemap/route/PAGE_META drift, platform name duplication).

**Pattern**: After any edit, run the cross-file sanity grep battery from `state/07-COMMANDS.md`.

### Lesson 3: Don't trust framework-specific flags for SSR behavior
Framer Motion `MotionConfig reducedMotion="always"` is the textbook fix for animation-in-SSR issues. It doesn't work in v12. The fix lives in a post-processor.

**Pattern**: When framework docs say "use X for Y", verify empirically by generating output and grepping for the expected result.

### Lesson 4: Manus platform is a dependency, not infrastructure
We can't SSH into Manus. We can't deploy to it. We can only:
- Download source ZIPs
- Chat with the Manus agent to apply changes
- Push to their GitHub mirror (if we had access)

**Pattern**: Keep a local working copy. Verify TypeScript in the working copy. Plan sync paths BEFORE finishing work (Bucket A in `state/08-NEXT-BUCKETS.md`).

### Lesson 5: Em-dashes are everywhere in LLM output
LLMs (both Claude and Manus AI agents) heavily use em-dashes. If you have a brand rule against them, you'll find 100+ instances in any large codebase.

**Pattern**: Run the em-dash purge as a standard Round N cleanup step.

### Lesson 6: Deferred low-priority findings should be documented, not silently dropped
Phase F critic found 10 LOW and some MEDIUM findings that we didn't fix immediately. They're documented in `state/05-CRITIC-FINDINGS.md` so a future session can pick them up.

**Pattern**: After each critic pass, categorize:
- Critical + High → fix now
- Medium → fix if time, document if not
- Low → document, possibly defer
- False positive → document why

### Lesson 7: Decision reasoning must be persisted
Future sessions won't know WHY we made choices. Document decisions + reasoning so a fresh session doesn't reverse them.

**Pattern**: `state/02-BUSINESS-CONTEXT.md` has "locked strategic decisions" with reasoning. `state/01-INDEX.md` has "NEVER DO" and "ALWAYS DO" lists.
