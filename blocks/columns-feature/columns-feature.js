export default function decorate(block) {
  const row = block.firstElementChild;
  const cards = [...row.children];
  block.classList.add(`columns-feature-${cards.length}-cols`);

  cards.forEach((card) => {
    card.classList.add('columns-feature-card');

    // image = the paragraph that wraps the picture
    const imgP = [...card.children].find(
      (el) => el.tagName === 'P' && el.querySelector('picture') && !el.querySelector('a'),
    );
    if (imgP) imgP.classList.add('columns-feature-image');

    // footer = the paragraph that contains the CTA link
    const linkP = [...card.children].find(
      (el) => el.tagName === 'P' && el.querySelector('a'),
    );
    if (linkP) linkP.classList.add('columns-feature-footer');

    // description = remaining paragraph(s) after the heading
    [...card.children].forEach((el) => {
      if (
        el.tagName === 'P'
        && !el.classList.contains('columns-feature-image')
        && !el.classList.contains('columns-feature-footer')
      ) {
        el.classList.add('columns-feature-card-desc');
      }
    });
  });
}
