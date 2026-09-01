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

  // The /footer fragment authors four groups, in content order:
  //   - Acknowledgement of Country (h4 + flags + artwork)
  //   - brand + quick links (empty <a href="/"> + a list)
  //   - the five link columns (multiple h3 + lists)
  //   - the legal line + social links
  // Classify them semantically (never positionally — the Acknowledgement is
  // authored first, which would otherwise land in the wrong slot).
  const groups = [...fragment.children];
  const brand = groups.find((d) => d.querySelector('a[href="/"]'));
  const ack = groups.find((d) => d.querySelector('h4'));
  const nav = groups.find((d) => d.querySelectorAll('h3').length >= 2);
  const legal = groups.find((d) => d.querySelector(
    'a[href*="facebook.com"], a[href*="instagram.com"], a[href*="linkedin.com"]',
  ));

  block.textContent = '';

  // loadFragment decorates the fragment into sections, so each group's real
  // content lives inside a .default-content-wrapper — unwrap to that.
  const contentOf = (el) => el.querySelector(':scope > .default-content-wrapper') || el;

  // Acknowledgement of Country — light, full-bleed band above the navy footer
  // (source renders it on a light band, not inside the navy nav area).
  if (ack) {
    const band = document.createElement('div');
    band.className = 'footer-acknowledgement';
    const inner = document.createElement('div');
    inner.className = 'footer-acknowledgement-inner';
    const ac = contentOf(ack);
    while (ac.firstChild) inner.append(ac.firstChild);
    band.append(inner);
    block.append(band);
  }

  // Navy content: a columns row (brand + one column per link group) then the
  // legal + social bar.
  const content = document.createElement('div');
  content.className = 'footer-inner';

  const columns = document.createElement('div');
  columns.className = 'footer-columns';

  // Brand column: logo + quick links.
  if (brand) {
    const brandCol = document.createElement('div');
    brandCol.className = 'footer-brand footer-col';
    const bc = contentOf(brand);
    while (bc.firstChild) brandCol.append(bc.firstChild);
    // Brand logo fallback: the /footer brand link is authored empty, so render
    // the RMIT logo (red mark + white wordmark, for the navy bar).
    const brandAnchor = [...brandCol.querySelectorAll('a')]
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
    columns.append(brandCol);
  }

  // Split the five h3 + list groups into one column each.
  if (nav) {
    let col = null;
    [...contentOf(nav).children].forEach((el) => {
      if (/^H[1-6]$/.test(el.tagName)) {
        col = document.createElement('div');
        col.className = 'footer-col';
        columns.append(col);
      }
      if (col) col.append(el);
      else columns.append(el);
    });
  }

  content.append(columns);

  // Legal + social bar.
  if (legal) {
    const legalCol = document.createElement('div');
    legalCol.className = 'footer-legal';
    const lc = contentOf(legal);
    while (lc.firstChild) legalCol.append(lc.firstChild);
    content.append(legalCol);
  }

  block.append(content);

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
  block.querySelectorAll('a[href]').forEach((a) => {
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
}
