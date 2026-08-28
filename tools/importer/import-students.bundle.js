/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-students.js
  var import_students_exports = {};
  __export(import_students_exports, {
    default: () => import_students_default
  });

  // tools/importer/parsers/hero-overlay.js
  function parse(element, { document: document2 }) {
    const bgImage = element.querySelector('.img-wpr img, img.img-responsive, img[class*="object-fit"]');
    const heading = element.querySelector("h1, h2.heading, .content-wpr h2, .content-wpr h1");
    const descriptions = Array.from(element.querySelectorAll("p.desc, p.desc-mob, .content-wpr p")).filter((p, i, arr) => arr.indexOf(p) === i);
    const ctaLinks = Array.from(element.querySelectorAll(".content-wpr a, .content a.button, a.btn"));
    if (!heading && descriptions.length === 0 && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const imageCell = document2.createDocumentFragment();
    imageCell.appendChild(document2.createComment(" field:image "));
    if (bgImage) imageCell.appendChild(bgImage);
    cells.push([imageCell]);
    const textCell = document2.createDocumentFragment();
    textCell.appendChild(document2.createComment(" field:text "));
    if (heading) textCell.appendChild(heading);
    descriptions.forEach((p) => textCell.appendChild(p));
    ctaLinks.forEach((cta) => textCell.appendChild(cta));
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-links.js
  function parse2(element, { document: document2 }) {
    const headingSource = element.querySelector("h1, h2, h3, h4, h5, h6");
    const heading = headingSource ? headingSource.cloneNode(true) : null;
    const sections = Array.from(element.querySelectorAll(".iconlistsvg__section"));
    if (sections.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    sections.forEach((section) => {
      const icon = section.querySelector(".iconlistsvg__section--svg svg, .iconlistsvg__section--svg img, svg, img");
      const link = section.querySelector(".iconlistsvg__section--text a, a");
      const imageCell = document2.createDocumentFragment();
      imageCell.appendChild(document2.createComment(" field:image "));
      if (icon) imageCell.appendChild(icon);
      const textCell = document2.createDocumentFragment();
      textCell.appendChild(document2.createComment(" field:text "));
      if (link) textCell.appendChild(link);
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-links", cells });
    if (heading) {
      element.replaceWith(heading, block);
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/columns-feature.js
  function buildColumn(scope, document2) {
    const wrapper = scope.querySelector(".columnlinklist-wrapper") || scope;
    const cellContent = [];
    const image = wrapper.querySelector(".columnlinklist-image img, img");
    const heading = wrapper.querySelector(".columnlinklist-body h4, h4, h3, h2");
    if (image) cellContent.push(image);
    if (heading) cellContent.push(heading);
    const links = Array.from(wrapper.querySelectorAll("ul.columnlinklist-links > li > a, .columnlinklist-links li a"));
    if (links.length) {
      const ul = document2.createElement("ul");
      links.forEach((a) => {
        a.querySelectorAll("svg, .columnlinklist-chevron, span").forEach((s) => s.remove());
        const li = document2.createElement("li");
        const link = document2.createElement("a");
        link.setAttribute("href", a.getAttribute("href") || "");
        link.textContent = a.textContent.replace(/\s+/g, " ").trim();
        li.appendChild(link);
        ul.appendChild(li);
      });
      cellContent.push(ul);
    }
    return cellContent;
  }
  function parse3(element, { document: document2 }) {
    const columns = [element];
    let sib = element.nextElementSibling;
    while (sib && sib.classList && sib.classList.contains("columnlinklist")) {
      columns.push(sib);
      sib = sib.nextElementSibling;
    }
    const row = columns.map((col) => buildColumn(col, document2));
    if (row.every((c) => c.length === 0)) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-feature", cells });
    columns.slice(1).forEach((col) => col.remove());
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-tile.js
  function parse4(element, { document: document2 }) {
    const items = Array.from(
      element.querySelectorAll(".cmp-list__item, .events-gridcmp__item, .columnfeature-card")
    );
    if (items.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const image = item.querySelector(
        ".cmp-list__item-img img, .events-gridcmp__item-img img, img.columnfeature-img, .box-photo img, figure img, img"
      );
      const titleLink = item.querySelector(
        "a.cmp-list__item-link, h4 a.events-title, .events-gridcmp__item-content h4 a, .cmp-list__item-content a.h-bar"
      );
      const heading = item.querySelector(
        ".cmp-list__item-content h3, .events-gridcmp__item-content h4, .colfeature-content h4, h3, h4, h2"
      );
      const featureDesc = item.querySelector(".columnfeature-card-desc");
      const featureCta = item.querySelector(".columnfeature-footer a, .columnfeature-card-footer a");
      const dateBlock = item.querySelector(".events-calendar");
      const locationBlock = item.querySelector(".events-location");
      const description = item.querySelector(".short-desc-gen, .events-desc, .cmp-list__item-content p, .events-gridcmp__item-content p, p");
      const imageCell = document2.createDocumentFragment();
      imageCell.appendChild(document2.createComment(" field:image "));
      if (image) imageCell.appendChild(image);
      const textCell = document2.createDocumentFragment();
      textCell.appendChild(document2.createComment(" field:text "));
      if (titleLink) {
        titleLink.querySelectorAll("span.generic-chevron, span.fa").forEach((s) => s.remove());
        if (titleLink.querySelector("h1, h2, h3, h4, h5, h6")) {
          titleLink.textContent = titleLink.textContent.replace(/\s+/g, " ").trim();
        }
        textCell.appendChild(titleLink);
      } else if (heading) {
        textCell.appendChild(heading);
      }
      if (dateBlock) textCell.appendChild(dateBlock);
      if (locationBlock) textCell.appendChild(locationBlock);
      if (!titleLink && heading && featureDesc) {
        const descP = document2.createElement("p");
        descP.textContent = featureDesc.textContent.replace(/\s+/g, " ").trim();
        textCell.appendChild(descP);
        if (featureCta) {
          const ctaP = document2.createElement("p");
          featureCta.querySelectorAll("svg, span.icon, img").forEach((s) => s.remove());
          const a = document2.createElement("a");
          a.setAttribute("href", featureCta.getAttribute("href") || "");
          a.textContent = featureCta.textContent.replace(/\s+/g, " ").trim();
          ctaP.appendChild(a);
          textCell.appendChild(ctaP);
        }
      } else if (description) {
        textCell.appendChild(description);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-tile", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/rmit-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "div.top-nav",
        // desktop + mobile nav, search, skip link, logo
        "section.top-nav__accordion",
        // mobile nav accordion (sibling of div.top-nav)
        "div.mobinav__display",
        // hidden mobile-nav accordion embedded in pageheader
        "div.mobinav__wrapper",
        // any other mobile-nav wrapper instances
        "div.primarynav",
        // primary mega-nav dropdown link lists (outside top-nav)
        "div.footer.rmit-bs",
        // global site footer
        "div.acknowledgementofcountry",
        // Acknowledgement of Country — moved to footer fragment
        "iframe"
        // tracking / ad pixels
      ]);
    }
  }

  // tools/importer/transformers/rmit-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  var LINKED_DM_INLINE_WRAPPER_TAGS = /* @__PURE__ */ new Set(["PICTURE"]);
  var LINKED_DM_WRAPPER_SIBLING_TAGS = /* @__PURE__ */ new Set(["SOURCE"]);
  function findLinkedDmCarrier(img) {
    if (!img || !img.parentElement) return null;
    let node = img;
    let parent = img.parentElement;
    while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
      let foundNode = false;
      for (const child of parent.children) {
        if (child === node) {
          foundNode = true;
        } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
          return null;
        }
      }
      if (!foundNode) return null;
      node = parent;
      parent = parent.parentElement;
    }
    if (!parent || parent.tagName !== "A") return null;
    if (parent.children.length !== 1 || parent.children[0] !== node) return null;
    if (parent.textContent.trim() !== "") return null;
    return parent;
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const linkedAnchor = findLinkedDmCarrier(img);
      if (linkedAnchor) {
        linkedAnchor.setAttribute("title", src);
        linkedAnchor.textContent = altToLinkText(alt);
        return;
      }
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/transformers/rmit-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform3(hookName, element, payload) {
    const sections = payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-students.js
  var PAGE_TEMPLATE = {
    name: "students",
    description: "Current students landing page: hero, icon-link grid, two-column feature panels, and multiple image-tile card rows (feedback, resources, events, news).",
    urls: [
      "https://www.rmit.edu.au/students"
    ],
    blocks: [
      {
        name: "hero-overlay",
        instances: ["div.pageheader"]
      },
      {
        name: "cards-links",
        instances: ["div.iconlistsvg.bg-white"]
      },
      {
        name: "columns-feature",
        instances: ["div.columnlinklist"]
      },
      {
        name: "cards-tile",
        instances: [
          "div.columnfeaturecontent.cardstyle",
          "div.generic-gridlist",
          "div.gridlist.list.horizontal.img-tile",
          "div.eventgridlist"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "body > div.root:nth-of-type(1) > section > div:nth-of-type(2)",
        style: null,
        blocks: ["hero-overlay"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Student essentials",
        selector: "div.iconlistsvg.bg-white",
        style: "grey",
        blocks: ["cards-links"],
        defaultContent: ["div.text-component"]
      },
      {
        id: "section-3",
        name: "Study tools & Popular pages",
        selector: "div.columnlinklist",
        style: "grey",
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Feedback / Census / Safety cards",
        selector: "div.columnfeaturecontent.cardstyle",
        style: null,
        blocks: ["cards-tile"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Explore resources for current students",
        selector: "div.section-title",
        style: "grey",
        blocks: ["cards-tile"],
        defaultContent: ["div.section-title"]
      },
      {
        id: "section-6",
        name: "Events and activities",
        selector: "div.eventgridlist",
        style: null,
        blocks: ["cards-tile"],
        defaultContent: ["div.section-title", "div.rmitctabutton"]
      },
      {
        id: "section-7",
        name: "Student news",
        selector: "div.gridlist.list.horizontal.img-tile",
        style: "grey",
        blocks: ["cards-tile"],
        defaultContent: ["div.section-title", "div.rmitctabutton"]
      },
      {
        id: "section-8",
        name: "Need help",
        selector: "div.experiencefragment",
        style: "need-help",
        blocks: [],
        defaultContent: ["div.experiencefragment"]
      },
      {
        id: "section-9",
        name: "Acknowledgement of Country",
        selector: "div.acknowledgementofcountry",
        style: null,
        blocks: [],
        defaultContent: ["div.acknowledgementofcountry"]
      }
    ]
  };
  var transformers = [
    transform,
    transform2,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform3] : []
  ];
  var parsers = {
    "hero-overlay": parse,
    "cards-links": parse2,
    "columns-feature": parse3,
    "cards-tile": parse4
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_students_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_students_exports);
})();
