# Source Registry Reference

`data/sources.json` is the list of places this project is willing to learn from.

## Authority policy

**Primary** means the provider's own reference documentation, its official documentation site, or its official source repository. Only a primary source can confirm a published claim.

**Secondary** means anything else: a vendor blog post, a conference talk, a community wiki, or another site's comparison. A secondary source must carry a `note` explaining why it is being used, and it can never confirm a claim on its own. A claim supported only by secondary sources is reported as `ambiguous`.

This asymmetry is deliberate. Being wrong about a configuration path costs a reader real debugging time, so the bar for publishing is a primary source and the fallback is an honest gap.

## Coverage levels

`tracked` providers are published or actively being prepared for publication, and must have at least one primary source. `candidate` providers are being evaluated for the compatibility index; their claims are compared normally, but the absence of published site data is expected rather than a defect.

## Retrieval hints

Several providers publish a machine-readable variant that is far more reliable than scraping rendered HTML. The `retrieval` block records how to get it:

- `markdown: "{url}.md"` appends a suffix the provider serves markdown at.
- `markdown: "https://.../body?pathname={pathname}"` uses a documentation API.
- `note` records a limitation, such as a client-rendered site whose HTML snapshots are unusable.

Where a provider publishes an `llms.txt` index, the `index` block points at it. That index is the fastest way to discover new pages and to notice that a page has moved.

## Adding a source

1. Find the page on the provider's official documentation site or source repository.
2. Confirm it is reference material, not a blog post or release note.
3. Add an entry with a `<provider>.<slug>` id, a topic from the vocabulary, the canonical URL, and `authority: "primary"`.
4. Run `provider-docs sources --check-urls --allow-network` and confirm it resolves.
5. Run `bun test` from `.github/skills/refresh-provider-docs` to confirm registry integrity.

## Adding a provider

Add the provider with `coverage: "candidate"` and at least one primary source for instructions. Retrieve, write claims, and compare before proposing any site change. A provider earns `tracked` status once its claims are cited and its panel is published.

Do not add a provider whose configuration model is documented only in a README example or a blog post. That is exactly the material that goes stale without notice.

## Maintaining the registry

Documentation pages move. A moved page usually returns a redirect or a 404 rather than an error anyone notices, which is how published claims quietly go stale. Run the URL check on every refresh and treat a broken source as a blocking problem: repair the entry, or retire it and mark the claims it supported as unverified.

`maxSourceAgeDays` sets how long retrieved evidence stays usable. Evidence older than the limit becomes `ambiguous` rather than silently continuing to back a published claim.
