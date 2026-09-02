/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature. Base block: columns.
 * Source: https://www.rmit.edu.au/students
 *   Instance selector: div.columnlinklist (two adjacent components:
 *   "Study tools and support" + "Popular pages").
 *
 * Library structure: columns block — row 1 is the block name, row 2 has one cell
 * per column. NOTE: Columns blocks do NOT use field-hint comments (Columns exception).
 *
 * The two columnlinklist components are adjacent siblings. To build a single
 * side-by-side 2-column block, the parser (invoked on the FIRST component) gathers
 * ALL adjacent `.columnlinklist` siblings as columns and removes the extras; when
 * the import framework later calls parse() on the sibling, it has already been
 * detached (import.js guards on parentNode) so it is skipped.
 *
 * Each column's source `.columnlinklist-wrapper` contains:
 *   - an image (.columnlinklist-image img)
 *   - a heading (.columnlinklist-body h4)
 *   - a link list (ul.columnlinklist-links > li > a) — decorative chevron svgs stripped.
 */
function buildColumn(scope, document) {
  const wrapper = scope.querySelector('.columnlinklist-wrapper') || scope;
  const cellContent = [];

  const image = wrapper.querySelector('.columnlinklist-image img, img');
  const heading = wrapper.querySelector('.columnlinklist-body h4, h4, h3, h2');

  if (image) cellContent.push(image);
  if (heading) cellContent.push(heading);

  const links = Array.from(wrapper.querySelectorAll('ul.columnlinklist-links > li > a, .columnlinklist-links li a'));
  if (links.length) {
    const ul = document.createElement('ul');
    links.forEach((a) => {
      a.querySelectorAll('svg, .columnlinklist-chevron, span').forEach((s) => s.remove());
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.setAttribute('href', a.getAttribute('href') || '');
      link.textContent = a.textContent.replace(/\s+/g, ' ').trim();
      li.appendChild(link);
      ul.appendChild(li);
    });
    cellContent.push(ul);
  }

  return cellContent;
}

export default function parse(element, { document }) {
  // Gather this component plus any adjacent columnlinklist siblings as columns.
  const columns = [element];
  let sib = element.nextElementSibling;
  while (sib && sib.classList && sib.classList.contains('columnlinklist')) {
    columns.push(sib);
    sib = sib.nextElementSibling;
  }

  const row = columns.map((col) => buildColumn(col, document));

  // Empty-block guard
  if (row.every((c) => c.length === 0)) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });

  // Remove the sibling components we absorbed, then replace the first with the block.
  columns.slice(1).forEach((col) => col.remove());
  element.replaceWith(block);
}
