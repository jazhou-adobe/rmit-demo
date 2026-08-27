/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroOverlayParser from './parsers/hero-overlay.js';
import cardsLinksParser from './parsers/cards-links.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import cardsTileParser from './parsers/cards-tile.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/rmit-cleanup.js';
import dmImagesTransformer from './transformers/rmit-dm-images.js';
import sectionsTransformer from './transformers/rmit-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'students',
  description: 'Current students landing page: hero, icon-link grid, two-column feature panels, and multiple image-tile card rows (feedback, resources, events, news).',
  urls: [
    'https://www.rmit.edu.au/students',
  ],
  blocks: [
    {
      name: 'hero-overlay',
      instances: ['div.pageheader'],
    },
    {
      name: 'cards-links',
      instances: ['div.iconlistsvg.bg-white'],
    },
    {
      name: 'columns-feature',
      instances: ['div.columnfeaturecontent.cardstyle'],
    },
    {
      name: 'cards-tile',
      instances: [
        'div.generic-gridlist',
        'div.gridlist.list.horizontal.img-tile',
        'div.eventgridlist',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: 'body > div.root:nth-of-type(1) > section > div:nth-of-type(2)',
      style: null,
      blocks: ['hero-overlay'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Student essentials',
      selector: 'div.iconlistsvg.bg-white',
      style: 'grey',
      blocks: ['cards-links'],
      defaultContent: ['div.text-component'],
    },
    {
      id: 'section-3',
      name: 'Study tools & Popular pages',
      selector: 'div.columnfeaturecontent.cardstyle',
      style: 'grey',
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Feedback / Census / Safety cards',
      selector: 'div.generic-gridlist',
      style: null,
      blocks: ['cards-tile'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Explore resources for current students',
      selector: 'div.section-title',
      style: 'grey',
      blocks: ['cards-tile'],
      defaultContent: ['div.section-title'],
    },
    {
      id: 'section-6',
      name: 'Events and activities',
      selector: 'div.eventgridlist',
      style: null,
      blocks: ['cards-tile'],
      defaultContent: ['div.section-title', 'div.rmitctabutton'],
    },
    {
      id: 'section-7',
      name: 'Student news',
      selector: 'div.gridlist.list.horizontal.img-tile',
      style: 'grey',
      blocks: ['cards-tile'],
      defaultContent: ['div.section-title', 'div.rmitctabutton'],
    },
    {
      id: 'section-8',
      name: 'Need help',
      selector: 'div.experiencefragment',
      style: null,
      blocks: [],
      defaultContent: ['div.experiencefragment'],
    },
    {
      id: 'section-9',
      name: 'Acknowledgement of Country',
      selector: 'div.acknowledgementofcountry',
      style: null,
      blocks: [],
      defaultContent: ['div.acknowledgementofcountry'],
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
  'cards-links': cardsLinksParser,
  'columns-feature': columnsFeatureParser,
  'cards-tile': cardsTileParser,
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
