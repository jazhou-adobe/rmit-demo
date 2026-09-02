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
 * Handles THREE source layouts (cross-page / cross-section union):
 *   A) Generic/news grid: `.cmp-list__item` with `.cmp-list__item-img` + `.cmp-list__item-content`
 *      (linked h3 in `a.cmp-list__item-link`, description in `p.short-desc-gen`).
 *   B) Events grid: `.events-gridcmp__item` with `.events-gridcmp__item-img` +
 *      `.events-gridcmp__item-content` (h4 > `a.events-title`, `.events-calendardate`,
 *      `.events-locationplace`, `p.events-desc`).
 *   C) Feature-card row (Feedback / Census / Safety): `.columnfeature-card` swiper-slide
 *      with `img.columnfeature-img`, `h4` heading, `.columnfeature-card-desc` description,
 *      and a footer CTA link (`.columnfeature-footer a`). Not a linked heading — the CTA
 *      is a separate "Find out more" style link kept as the card's link.
 *   D) Icon-feature image tiles (https://www.rmit.edu.au/students/student-life, Student
 *      media — div.iconfeature:has(div.image-card)): each `.icon-feature` column has a
 *      `figure img` photo, an `h3` title, a `p.desc-color` description and a separate CTA
 *      anchor (`a.iconfeature-cta`). Like layout C: plain heading + description + CTA.
 */
export default function parse(element, { document }) {
  // Union of card-item selectors across all instance layouts.
  const items = Array.from(
    element.querySelectorAll('.cmp-list__item, .events-gridcmp__item, .columnfeature-card, .icon-feature'),
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
      '.cmp-list__item-img img, .events-gridcmp__item-img img, img.columnfeature-img, .box-photo img, figure img, img',
    );

    // --- Text (field:text): title link, optional date/location, description ---
    // Title anchor (preserve link + heading). Generic vs events markup.
    const titleLink = item.querySelector(
      'a.cmp-list__item-link, h4 a.events-title, .events-gridcmp__item-content h4 a, .cmp-list__item-content a.h-bar',
    );
    const heading = item.querySelector(
      '.cmp-list__item-content h3, .events-gridcmp__item-content h4, .colfeature-content h4, h3, h4, h2',
    );
    // Feature-card (layout C) description + footer CTA link.
    const featureDesc = item.querySelector('.columnfeature-card-desc');
    const featureCta = item.querySelector('.columnfeature-footer a, .columnfeature-card-footer a');
    // Icon-feature tile (layout D): separate "... website" CTA anchor.
    const iconFeatureCta = item.querySelector('a.iconfeature-cta');
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
    // Feature-card (layout C): heading is not a link — append it, then its
    // description div and footer CTA link.
    if (!titleLink && heading && featureDesc) {
      const descP = document.createElement('p');
      descP.textContent = featureDesc.textContent.replace(/\s+/g, ' ').trim();
      textCell.appendChild(descP);
      if (featureCta) {
        const ctaP = document.createElement('p');
        featureCta.querySelectorAll('svg, span.icon, img').forEach((s) => s.remove());
        const a = document.createElement('a');
        a.setAttribute('href', featureCta.getAttribute('href') || '');
        a.textContent = featureCta.textContent.replace(/\s+/g, ' ').trim();
        ctaP.appendChild(a);
        textCell.appendChild(ctaP);
      }
    } else if (description) {
      textCell.appendChild(description);
      // Icon-feature tile (layout D): append the trailing "... website" CTA link.
      if (iconFeatureCta) {
        const ctaP = document.createElement('p');
        iconFeatureCta.querySelectorAll('svg, span.icon, img').forEach((s) => s.remove());
        const a = document.createElement('a');
        a.setAttribute('href', iconFeatureCta.getAttribute('href') || '');
        a.textContent = iconFeatureCta.textContent.replace(/\s+/g, ' ').trim();
        ctaP.appendChild(a);
        textCell.appendChild(ctaP);
      }
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tile', cells });
  element.replaceWith(block);
}
