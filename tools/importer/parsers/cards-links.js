/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-links. Base block: cards.
 * Generated for xwalk project (field hints per model blocks/cards-links/_cards-links.json).
 *
 * Library structure: container block, N rows (one per card). Each row has 2 cells:
 *   cell 1: image/icon (field:image)
 *   cell 2: text — the linked title (field:text)
 *
 * Handles TWO source layouts (cross-page union):
 *   A) Icon list (https://www.rmit.edu.au/students, div.iconlistsvg.bg-white):
 *      each `.iconlistsvg__section` is a card with an SVG/img icon and an anchor.
 *      The section heading (h3, e.g. "Student essentials") is default content and
 *      is preserved before the block; "View all"/"Show less" chrome is excluded.
 *   B) Icon feature (https://www.rmit.edu.au/students/student-life, social row —
 *      div.iconfeature:has(div.icon-card)): each `.icon-feature` column has an
 *      icon <img>, an <h3> title and a CTA anchor (`a.iconfeature-cta`). The card
 *      link is the CTA; the title is folded into the linked text.
 */
export default function parse(element, { document }) {
  // Section heading (e.g. "Student essentials") lives inside the block element.
  // It is default content, not a card — clone it so it survives element.replaceWith.
  const headingSource = element.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6');
  const heading = headingSource ? headingSource.cloneNode(true) : null;

  // Layout A: icon-list sections. Layout B: icon-feature columns.
  const isIconFeature = element.classList.contains('iconfeature') || !!element.querySelector('.icon-card');
  const sections = isIconFeature
    ? Array.from(element.querySelectorAll('.icon-feature'))
    : Array.from(element.querySelectorAll('.iconlistsvg__section'));

  // Empty-block guard
  if (sections.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  sections.forEach((section) => {
    // Icon can be an inline <svg> (live DOM) or an <img> (data-URI in cleaned HTML).
    const icon = section.querySelector(
      '.iconlistsvg__section--svg svg, .iconlistsvg__section--svg img, figure img, svg, img',
    );
    const link = section.querySelector('.iconlistsvg__section--text a, a.iconfeature-cta, a');

    // Image cell (field:image) — the icon; imageAlt collapses into <img alt>.
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (icon) imageCell.appendChild(icon);

    // Text cell (field:text) — the linked title. Preserve the anchor href.
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (link) {
      if (isIconFeature) {
        // The CTA holds a chevron <img> and its own label; prefer the card <h3>
        // title as the link text so cards read as "RMIT Students Instagram".
        const title = section.querySelector('h3, h4, h2');
        const a = document.createElement('a');
        a.setAttribute('href', link.getAttribute('href') || '');
        const label = (title ? title.textContent : link.textContent).replace(/\s+/g, ' ').trim();
        a.textContent = label;
        textCell.appendChild(a);
      } else {
        textCell.appendChild(link);
      }
    }

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
