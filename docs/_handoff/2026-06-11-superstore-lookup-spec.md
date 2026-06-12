# Superstore lookup spec (plan item 4.3; build lands in 7.4)

Purpose: given a guest name or topic keyword, return REAL products from
creationsuperstore.com (title, price, url) so on-air plugs are never fabricated. A
no-match returns empty, never invented (canon rule). Verified live 2026-06-11.

## Platform (verified)

WordPress + WooCommerce + Yoast (sitemap.xml is a Yoast index with 3 product sitemaps,
~2,113 products; Shopify /products.json 404s). The whole /wp-json/ tree, including the
WooCommerce Store API, is host-blocked with 403 even with a browser user agent: there is
NO JSON API. The lookup uses HTML search, with a sitemap-built slug index as the cache.

## Fetch contract

- Request: `GET https://creationsuperstore.com/?s=<url-encoded query>&post_type=product`
  with a desktop-browser User-Agent (the firewall blocks non-browser clients).
- Parse: `ul.products > li.product`; title from the `h2.woocommerce-loop-product__title`;
  url from the link to `/product/<slug>/`; price from `.woocommerce-Price-amount bdi`.
- Count: `.woocommerce-result-count` ("Showing all 19 results" / "Showing 1-48 of N").
- Pagination: 48 per page; page N = `/page/N/?s=<query>&post_type=product`. Page 1 is
  almost always enough for guest/topic lookups.
- EMPTY contract (the canon-critical part): HTTP 200 with no `ul.products` and the text
  "No products were found matching your selection." Return `[]` on that signal. Never
  synthesize a product.
- Vendor filtering: titles carry vendor suffixes ("| ICR - Geology", "| DRM"), so
  prefer-DRM ranking works from the title string alone.

## Cache layer (nightly job, later)

Pull the 3 Yoast product sitemaps (slug + lastmod) into a local index so fuzzy guest-name
matching does not hammer search. Politeness: read-only GETs, max 1 req/sec, cache ~24h,
one search request per lookup.

## Live examples (2026-06-11)

- `steve austin` -> 12 results incl. "Steve Austin Book & DVD Bundle" ($17.95) and
  "Footprints in the Ash" (the exact resource named in the June Topic 09 interview doc).
- `volcano` -> 19 results incl. "Volcanoes: Earth's Explosive Past" (ICR, $9.95).
- nonsense query -> HTTP 200, zero products, the no-products message (empty contract holds).

Build home: plan item 7.4 (rides the Mac worker for the nightly cache; the per-lookup
search can run server-side in the dashboard). Ledger: CL-049.
