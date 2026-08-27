import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change rows to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      // The label cell is the one containing a link; the other is the icon cell.
      if (div.querySelector('a')) {
        div.className = 'cards-links-card-body';
      } else {
        div.className = 'cards-links-card-icon';
      }
    });
    ul.append(li);
  });

  // Reverse EDS button auto-decoration: labels are plain links, not buttons.
  ul.querySelectorAll('a.button').forEach((a) => {
    a.classList.remove('button', 'primary', 'secondary');
    if (!a.className) a.removeAttribute('class');
    const container = a.closest('.button-container');
    if (container) container.classList.remove('button-container');
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
