/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay. Base block: hero.
 * Source: https://www.rmit.edu.au/students (div.pageheader)
 * Generated for xwalk project (field hints per model blocks/hero-overlay/_hero-overlay.json).
 *
 * Library structure: 1 column, 3 rows.
 *   Row 1: block name (added by createBlock)
 *   Row 2: background image (field:image; imageAlt collapses into <img alt>)
 *   Row 3: title + subheading + optional CTA (field:text)
 */
export default function parse(element, { document }) {
  // --- INPUT EXTRACTION (validated against source.html) ---
  const bgImage = element.querySelector('.img-wpr img, img.img-responsive, img[class*="object-fit"]');

  const heading = element.querySelector('h1, h2.heading, .content-wpr h2, .content-wpr h1');
  // Capture all descriptive paragraphs (source has responsive desktop + mobile variants).
  const descriptions = Array.from(element.querySelectorAll('p.desc, p.desc-mob, .content-wpr p'))
    // de-duplicate the same node if matched by multiple selectors
    .filter((p, i, arr) => arr.indexOf(p) === i);
  const ctaLinks = Array.from(element.querySelectorAll('.content-wpr a, .content a.button, a.btn'));

  // Empty-block guard
  if (!heading && descriptions.length === 0 && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (field:image). imageAlt is collapsed into the <img alt>.
  const imageCell = document.createDocumentFragment();
  imageCell.appendChild(document.createComment(' field:image '));
  if (bgImage) imageCell.appendChild(bgImage);
  cells.push([imageCell]);

  // Row 3: text content (field:text) — heading, subheading, optional CTA(s).
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) textCell.appendChild(heading);
  descriptions.forEach((p) => textCell.appendChild(p));
  ctaLinks.forEach((cta) => textCell.appendChild(cta));
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
