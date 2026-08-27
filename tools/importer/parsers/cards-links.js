/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-links. Base block: cards.
 * Source: https://www.rmit.edu.au/students (div.iconlistsvg.bg-white)
 * Generated for xwalk project (field hints per model blocks/cards-links/_cards-links.json).
 *
 * Library structure: container block, N rows (one per card). Each row has 2 cells:
 *   cell 1: image/icon (field:image)
 *   cell 2: text — the linked title (field:text)
 * Source: each `.iconlistsvg__section` is a card with an SVG icon and an anchor link.
 * The section heading (h3, e.g. "Student essentials") is default content and is
 * preserved before the block; the "View all"/"Show less" chrome is excluded.
 */
export default function parse(element, { document }) {
  // Section heading (e.g. "Student essentials") lives inside the block element.
  // It is default content, not a card — clone it so it survives element.replaceWith.
  const headingSource = element.querySelector('h1, h2, h3, h4, h5, h6');
  const heading = headingSource ? headingSource.cloneNode(true) : null;

  // Each card is an icon "section" row.
  const sections = Array.from(element.querySelectorAll('.iconlistsvg__section'));

  // Empty-block guard
  if (sections.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  sections.forEach((section) => {
    // Icon can be an inline <svg> (live DOM) or an <img> (data-URI in cleaned HTML).
    const icon = section.querySelector('.iconlistsvg__section--svg svg, .iconlistsvg__section--svg img, svg, img');
    const link = section.querySelector('.iconlistsvg__section--text a, a');

    // Image cell (field:image) — the icon; imageAlt collapses into <img alt>.
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (icon) imageCell.appendChild(icon);

    // Text cell (field:text) — the linked title. Preserve the anchor href.
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (link) textCell.appendChild(link);

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-links', cells });
  // Preserve the section heading as default content before the block.
  if (heading) {
    element.replaceWith(heading, block);
  } else {
    element.replaceWith(block);
  }
}
