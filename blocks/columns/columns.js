export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // "Link card" variant: every cell is an image + heading + list of quick links
  // (source: rmit.edu.au/students "Study tools and support"). Render each cell as
  // a white card with a full-bleed image and a 2-column chevron link grid.
  const rows = [...block.children];
  const isCardGrid = rows.length > 0 && rows.every((row) => [...row.children].length > 0
    && [...row.children].every((col) => col.querySelector('h1,h2,h3,h4,h5,h6') && col.querySelector('ul a')));
  if (isCardGrid) {
    block.classList.add('columns-cards');
    rows.forEach((row) => {
      [...row.children].forEach((col) => {
        const body = document.createElement('div');
        body.className = 'columns-card-body';
        [...col.children].forEach((child) => {
          if (child.querySelector && child.querySelector('picture')) {
            child.classList.add('columns-card-media');
          } else if (child.tagName === 'PICTURE') {
            const media = document.createElement('div');
            media.className = 'columns-card-media';
            child.replaceWith(media);
            media.append(child);
          } else {
            body.append(child);
          }
        });
        col.append(body);
      });
    });
  }

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
