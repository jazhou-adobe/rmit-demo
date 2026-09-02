/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-promo. Base block: columns.
 * Source: https://www.rmit.edu.au/students/student-life (div.standardbanners)
 *
 * A single navy promo/CTA banner: a photo on the left half and a solid-navy
 * content panel on the right with a heading, description and one pill button.
 *
 * Library structure: columns block — row 1 is the block name (added by
 * createBlock), row 2 has one cell per column. NOTE: Columns blocks do NOT use
 * field-hint comments (Columns exception, matching columns-feature).
 *
 * Source markup:
 *   div.standardbanners > div.stdbannerwrap
 *     div.stdbanner_imagebox > img                          (left column)
 *     div.stdbanner_contentbox .verticalcentercontent       (right column)
 *       h3.stdbanner_heading
 *       div.stdbanner_description > p
 *       div.btn_Wrap_*_stdban > a[href] > span (button label)
 */
export default function parse(element, { document }) {
  const image = element.querySelector('.stdbanner_imagebox img, img');
  const content = element.querySelector('.stdbanner_contentbox .verticalcentercontent, .stdbanner_contentbox');

  // Empty-block guard
  if (!image && !content) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Left column: the image.
  const imageCol = [];
  if (image) imageCol.push(image);

  // Right column: heading, description, button.
  const contentCol = [];
  if (content) {
    const heading = content.querySelector('.stdbanner_heading, h1, h2, h3, h4');
    if (heading) {
      // Normalise to a plain heading tag stripped of source utility classes.
      const h = document.createElement(/^h[1-6]$/i.test(heading.tagName) ? heading.tagName.toLowerCase() : 'h3');
      h.textContent = heading.textContent.replace(/\s+/g, ' ').trim();
      contentCol.push(h);
    }

    const desc = content.querySelector('.stdbanner_description');
    if (desc) {
      desc.querySelectorAll('p').forEach((p) => {
        const np = document.createElement('p');
        np.textContent = p.textContent.replace(/\s+/g, ' ').trim();
        if (np.textContent) contentCol.push(np);
      });
    }

    // Button: an anchor whose label may sit inside a <span>. A lone linked
    // paragraph becomes an EDS button at render time.
    const btn = content.querySelector('.btn_Wrap_Secondary_stdban a, [class*="btn_Wrap"] a, a');
    if (btn) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', btn.getAttribute('href') || '');
      a.textContent = btn.textContent.replace(/\s+/g, ' ').trim();
      p.appendChild(a);
      contentCol.push(p);
    }
  }

  const cells = [[imageCol, contentCol]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
