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
 *
 * NOTE: div.experiencefragment (section-8 "Need help") and
 * div.acknowledgementofcountry (section-9) are authorable template sections and
 * are intentionally NOT removed. div.pageheader is the hero block (authorable).
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
      'iframe',                   // tracking / ad pixels
    ]);
  }
}
