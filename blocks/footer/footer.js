import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Brand logo fallback: the /footer brand link is authored empty, so render the
  // RMIT logo when no image/text is present.
  const brandAnchor = [...footer.querySelectorAll('a')]
    .find((a) => a.getAttribute('href') === '/' && !a.querySelector('img, svg') && !a.textContent.trim());
  if (brandAnchor) {
    brandAnchor.setAttribute('aria-label', 'RMIT University');
    const logo = document.createElement('img');
    logo.src = '/icons/rmit-logo.svg';
    logo.alt = 'RMIT University';
    logo.className = 'footer-brand-logo';
    logo.width = 150;
    logo.height = 52;
    brandAnchor.append(logo);
  }

  // Acknowledgement of Country images: the fragment pipeline rewrites these
  // <img src> to "about:error", so repoint them to the local /images assets,
  // matched by alt text. Flags render inline-small; the artwork renders large.
  const ackImages = [
    ['aboriginal flag', '/images/flag-aboriginal.png', 'Aboriginal flag'],
    ['torres strait', '/images/flag-torres-strait.png', 'Torres Strait Islander flag'],
    ['sentient', '/images/acknowledgement-artwork.jpg', "'Sentient' by Hollie Johnson, Gunaikurnai and Monero Ngarigo"],
  ];
  footer.querySelectorAll('img[src="about:error"], img:not([src])').forEach((img) => {
    const alt = (img.getAttribute('alt') || '').toLowerCase();
    const match = ackImages.find(([needle]) => alt.includes(needle));
    if (!match) return;
    const [, src, altText] = match;
    img.src = src;
    img.alt = altText;
    img.removeAttribute('width');
    img.removeAttribute('height');
  });

  // Render social links as icons (source: circular social buttons in the legal
  // bar). Matched by hostname so only the social row is affected.
  const socialMap = [
    ['facebook.com', 'facebook'],
    ['twitter.com', 'twitter'],
    ['x.com', 'twitter'],
    ['instagram.com', 'instagram'],
    ['linkedin.com', 'linkedin'],
    ['youtube.com', 'youtube'],
    ['weibo.com', 'weibo'],
  ];
  footer.querySelectorAll('a[href]').forEach((a) => {
    let host;
    try { host = new URL(a.href).hostname; } catch { return; }
    const match = socialMap.find(([domain]) => host === domain || host.endsWith(`.${domain}`));
    if (!match) return;
    a.setAttribute('aria-label', a.textContent.trim() || match[1]);
    a.classList.add('footer-social-link');
    a.textContent = '';
    const icon = document.createElement('img');
    icon.src = `/icons/social-${match[1]}.svg`;
    icon.alt = '';
    icon.width = 32;
    icon.height = 32;
    a.append(icon);
  });

  block.append(footer);
}
