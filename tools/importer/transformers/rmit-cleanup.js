/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: RMIT site-wide cleanup.
 *
 * Removes non-authorable site chrome so the import contains only page-level
 * authorable content. All selectors verified against migration-work/cleaned.html
 * for https://www.rmit.edu.au/students.
 *
 * Non-authorable regions found in captured DOM:
 *   - div.top-nav        (line 9)    desktop + mobile navigation, search box,
 *                                    skip-to-content link, logo (topnav-*, mobinav-*)
 *   - div.primarynav                 primary mega-nav dropdown link lists that sit
 *                                    OUTSIDE top-nav (New students/My course/... trees).
 *                                    Navigation chrome now provided by the header block.
 *   - div.footer.rmit-bs (line 2396) global site footer (footer-cols, footer-legal, etc.)
 *   - iframe             (lines 2670, 2686) tracking / advertising pixels
 *   - div.acknowledgementofcountry   Acknowledgement of Country — a sibling of the source
 *                                    <contentinfo> footer; migrated into the footer block.
 *
 * NOTE: div.pageheader is the hero block (authorable) and is NOT removed.
 * NOTE: div.experiencefragment ("Need help?") is authorable page content and is
 * kept in the page body (NOT moved to the footer).
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome (selectors from captured DOM).
    WebImporter.DOMUtils.remove(element, [
      'div.top-nav',              // desktop + mobile nav, search, skip link, logo
      'section.top-nav__accordion', // mobile nav accordion (sibling of div.top-nav)
      'div.mobinav__display',     // hidden mobile-nav accordion embedded in pageheader
      'div.mobinav__wrapper',     // any other mobile-nav wrapper instances
      'div.primarynav',           // primary mega-nav dropdown link lists (outside top-nav)
      'div.footer.rmit-bs',       // global site footer
      'div.acknowledgementofcountry', // Acknowledgement of Country — moved to footer fragment
      'div.breadcrumb',           // breadcrumb navigation bar (sub-pages, e.g. /students/student-life)
      'noscript',                 // GTM <noscript> iframe ("GTM body script") + other no-JS fallbacks
      'iframe',                   // tracking / ad pixels
    ]);

    // Redundant page-title heading: sub-pages (e.g. /students/student-life) emit a
    // bare <h1> as a direct child of <body>, above the hero. The visible title is
    // the hero overlay, so this duplicate <h1> would render twice — remove it.
    const bodyH1 = element.querySelector(':scope > h1');
    if (bodyH1) bodyH1.remove();
  }
}
