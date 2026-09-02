/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroOverlayParser from './parsers/hero-overlay.js';
import cardsTileParser from './parsers/cards-tile.js';
import cardsLinksParser from './parsers/cards-links.js';
import columnsPromoParser from './parsers/columns-promo.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/rmit-cleanup.js';
import dmImagesTransformer from './transformers/rmit-dm-images.js';
import sectionsTransformer from './transformers/rmit-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json (template: student-life)
const PAGE_TEMPLATE = {
  name: 'student-life',
  description: 'Student life landing page: hero, intro, a topics tile grid, a social-media icon row, a navy promo banner, a student-media tile row, and Need help. Shares block variants with the students template.',
  urls: [
    'https://www.rmit.edu.au/students/student-life',
  ],
  blocks: [
    {
      name: 'hero-overlay',
      instances: ['div.pageheader'],
    },
    {
      name: 'cards-tile',
      instances: [
        'div.generic-gridlist',
        'div.iconfeature:has(div.image-card)',
      ],
    },
    {
      name: 'cards-links',
      instances: ['div.iconfeature:has(div.icon-card)'],
    },
    {
      name: 'columns-promo',
      instances: ['div.standardbanners'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: 'div.pageheader',
      style: null,
      blocks: ['hero-overlay'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Intro',
      selector: 'div.intro',
      style: null,
      blocks: [],
      defaultContent: ['div.intro'],
    },
    {
      id: 'section-3',
      name: 'Student life topics grid',
      selector: 'div.generic-gridlist',
      style: null,
      blocks: ['cards-tile'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Follow us on social media',
      selector: 'div.sectionarea.nopixel',
      style: 'grey',
      blocks: ['cards-links'],
      defaultContent: ['div.text-component'],
    },
    {
      id: 'section-5',
      name: 'Explore campus facilities promo banner',
      selector: 'div.standardbanners',
      style: null,
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Student media',
      selector: 'div.sectionarea.bground-grey:not(.nopixel)',
      style: 'grey',
      blocks: ['cards-tile'],
      defaultContent: ['div.text-component'],
    },
    {
      id: 'section-7',
      name: 'Need help',
      selector: 'div.experiencefragment',
      style: 'need-help',
      blocks: [],
      defaultContent: ['div.experiencefragment'],
    },
  ],
};

// TRANSFORMER REGISTRY - order matters: cleanup, then DM image rewrite, then section breaks/metadata
const transformers = [
  cleanupTransformer,
  dmImagesTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

// PARSER REGISTRY
const parsers = {
  'hero-overlay': heroOverlayParser,
  'cards-tile': cardsTileParser,
  'cards-links': cardsLinksParser,
  'columns-promo': columnsPromoParser,
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
