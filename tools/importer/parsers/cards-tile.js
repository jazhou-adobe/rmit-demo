/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-tile. Base block: cards.
 * Source: https://www.rmit.edu.au/students
 *   Instances: div.generic-gridlist, div.gridlist.list.horizontal.img-tile, div.eventgridlist
 * Generated for xwalk project (field hints per model blocks/cards-tile/_cards-tile.json).
 *
 * Library structure: container block, N rows (one per card). Each row has 2 cells:
 *   cell 1: image (field:image) — imageAlt collapses into <img alt>
 *   cell 2: text (field:text) — title (linked heading), optional date/location, description
 *
 * Handles TWO source layouts (cross-page union):
 *   A) Generic/news grid: `.cmp-list__item` with `.cmp-list__item-img` + `.cmp-list__item-content`
 *      (linked h3 in `a.cmp-list__item-link`, description in `p.short-desc-gen`).
 *   B) Events grid: `.events-gridcmp__item` with `.events-gridcmp__item-img` +
 *      `.events-gridcmp__item-content` (h4 > `a.events-title`, `.events-calendardate`,
 *      `.events-locationplace`, `p.events-desc`).
 */
export default function parse(element, { document }) {
  // Union of card-item selectors across the three instance layouts.
  const items = Array.from(
    element.querySelectorAll('.cmp-list__item, .events-gridcmp__item'),
  );

  // Empty-block guard
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  items.forEach((item) => {
    // --- Image (field:image) ---
    const image = item.querySelector(
      '.cmp-list__item-img img, .events-gridcmp__item-img img, .box-photo img, figure img, img',
    );

    // --- Text (field:text): title link, optional date/location, description ---
    // Title anchor (preserve link + heading). Generic vs events markup.
    const titleLink = item.querySelector(
      'a.cmp-list__item-link, h4 a.events-title, .events-gridcmp__item-content h4 a, .cmp-list__item-content a.h-bar',
    );
    const heading = item.querySelector(
      '.cmp-list__item-content h3, .events-gridcmp__item-content h4, h3, h4, h2',
    );
    // Events layout: date + location blocks (each includes an icon + text).
    const dateBlock = item.querySelector('.events-calendar');
    const locationBlock = item.querySelector('.events-location');
    const description = item.querySelector('.short-desc-gen, .events-desc, .cmp-list__item-content p, .events-gridcmp__item-content p, p');

    // Image cell
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (image) imageCell.appendChild(image);

    // Text cell
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (titleLink) {
      // Strip decorative chevron/icon spans so only the heading text remains linked.
      titleLink.querySelectorAll('span.generic-chevron, span.fa').forEach((s) => s.remove());
      // Flatten any nested heading (h1-h6) inside the anchor to plain text.
      // Otherwise md conversion emits a literal "### " prefix inside the link
      // text (e.g. "### My course"). Collapse the anchor to its text content.
      if (titleLink.querySelector('h1, h2, h3, h4, h5, h6')) {
        titleLink.textContent = titleLink.textContent.replace(/\s+/g, ' ').trim();
      }
      textCell.appendChild(titleLink);
    } else if (heading) {
      textCell.appendChild(heading);
    }
    if (dateBlock) textCell.appendChild(dateBlock);
    if (locationBlock) textCell.appendChild(locationBlock);
    if (description) textCell.appendChild(description);

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tile', cells });
  element.replaceWith(block);
}
