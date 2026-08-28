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
 *   - div.experiencefragment         "Need help?" support CTA — pre-footer band on the
 *                                    source; migrated into the footer block fragment.
 *   - div.acknowledgementofcountry   Acknowledgement of Country — a sibling of the source
 *                                    <contentinfo> footer; migrated into the footer block.
 *
 * NOTE: div.pageheader is the hero block (authorable) and is NOT removed.
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
      'div.experiencefragment',   // "Need help?" support CTA — moved to footer fragment
      'div.acknowledgementofcountry', // Acknowledgement of Country — moved to footer fragment
      'iframe',                   // tracking / ad pixels
    ]);
  }
}
