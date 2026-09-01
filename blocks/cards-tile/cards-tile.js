import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-tile-card-image';
      else div.className = 'cards-tile-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // "Feature card" variant (source: rmit.edu.au/students columnfeature cards —
  // e.g. the promo/feedback row under Study tools): cards that carry a real
  // heading + body + CTA render as white bordered cards with a divider and a
  // red-chevron CTA. Gridlist blocks (title-as-link, no heading) stay borderless.
  const isFeature = [...ul.children].some((li) => li.querySelector('.cards-tile-card-body :is(h1,h2,h3,h4,h5,h6)'));
  if (isFeature) {
    block.classList.add('cards-tile-cards');
    [...ul.children].forEach((li) => {
      // the CTA is the auto-decorated single-link paragraph (p.button-container)
      const cta = li.querySelector('.cards-tile-card-body p.button-container');
      if (cta) cta.classList.add('cards-tile-card-cta');
    });
  }

  block.textContent = '';
  block.append(ul);
}
