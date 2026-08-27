/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature. Base block: columns.
 * Source: https://www.rmit.edu.au/students (div.columnfeaturecontent.cardstyle)
 * Generated for xwalk project.
 *
 * Library structure: columns block — row 1 is the block name, row 2 has one cell per column.
 * NOTE: Columns blocks do NOT use field-hint comments (per hinting rules, Columns exception).
 * Source: each `.columnfeature-card` swiper-slide is a column containing an image,
 * a heading, a description, and a footer CTA link.
 */
export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll('.columnfeature-card, .swiper-slide.columnfeature-card'));

  // Empty-block guard
  if (slides.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const row = slides.map((slide) => {
    const cellContent = [];

    const image = slide.querySelector('.card-img img.columnfeature-img, .card-img > div > img, img.card-img-top');
    const heading = slide.querySelector('.colfeature-content h4, h4, h3, h2');
    const description = slide.querySelector('.columnfeature-card-desc, .colfeature-content .mt-0');
    const cta = slide.querySelector('.columnfeature-footer a, .columnfeature-card-footer a, a');

    if (image) cellContent.push(image);
    if (heading) cellContent.push(heading);
    if (description) cellContent.push(description);
    if (cta) cellContent.push(cta);

    return cellContent;
  });

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
