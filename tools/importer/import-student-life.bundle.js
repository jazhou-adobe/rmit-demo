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

  // tools/importer/import-student-life.js
  var import_student_life_exports = {};
  __export(import_student_life_exports, {
    default: () => import_student_life_default
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

  // tools/importer/parsers/cards-tile.js
  function parse2(element, { document: document2 }) {
    const items = Array.from(
      element.querySelectorAll(".cmp-list__item, .events-gridcmp__item, .columnfeature-card, .icon-feature")
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
      const iconFeatureCta = item.querySelector("a.iconfeature-cta");
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
        if (iconFeatureCta) {
          const ctaP = document2.createElement("p");
          iconFeatureCta.querySelectorAll("svg, span.icon, img").forEach((s) => s.remove());
          const a = document2.createElement("a");
          a.setAttribute("href", iconFeatureCta.getAttribute("href") || "");
          a.textContent = iconFeatureCta.textContent.replace(/\s+/g, " ").trim();
          ctaP.appendChild(a);
          textCell.appendChild(ctaP);
        }
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-tile", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-links.js
  function parse3(element, { document: document2 }) {
    const headingSource = element.querySelector(":scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6");
    const heading = headingSource ? headingSource.cloneNode(true) : null;
    const isIconFeature = element.classList.contains("iconfeature") || !!element.querySelector(".icon-card");
    const sections = isIconFeature ? Array.from(element.querySelectorAll(".icon-feature")) : Array.from(element.querySelectorAll(".iconlistsvg__section"));
    if (sections.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    sections.forEach((section) => {
      const icon = section.querySelector(
        ".iconlistsvg__section--svg svg, .iconlistsvg__section--svg img, figure img, svg, img"
      );
      const link = section.querySelector(".iconlistsvg__section--text a, a.iconfeature-cta, a");
      const imageCell = document2.createDocumentFragment();
      imageCell.appendChild(document2.createComment(" field:image "));
      if (icon) imageCell.appendChild(icon);
      const textCell = document2.createDocumentFragment();
      textCell.appendChild(document2.createComment(" field:text "));
      if (link) {
        if (isIconFeature) {
          const title = section.querySelector("h3, h4, h2");
          const a = document2.createElement("a");
          a.setAttribute("href", link.getAttribute("href") || "");
          const label = (title ? title.textContent : link.textContent).replace(/\s+/g, " ").trim();
          a.textContent = label;
          textCell.appendChild(a);
        } else {
          textCell.appendChild(link);
        }
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-links", cells });
    if (heading) {
      element.replaceWith(heading, block);
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/columns-promo.js
  function parse4(element, { document: document2 }) {
    const image = element.querySelector(".stdbanner_imagebox img, img");
    const content = element.querySelector(".stdbanner_contentbox .verticalcentercontent, .stdbanner_contentbox");
    if (!image && !content) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imageCol = [];
    if (image) imageCol.push(image);
    const contentCol = [];
    if (content) {
      const heading = content.querySelector(".stdbanner_heading, h1, h2, h3, h4");
      if (heading) {
        const h = document2.createElement(/^h[1-6]$/i.test(heading.tagName) ? heading.tagName.toLowerCase() : "h3");
        h.textContent = heading.textContent.replace(/\s+/g, " ").trim();
        contentCol.push(h);
      }
      const desc = content.querySelector(".stdbanner_description");
      if (desc) {
        desc.querySelectorAll("p").forEach((p) => {
          const np = document2.createElement("p");
          np.textContent = p.textContent.replace(/\s+/g, " ").trim();
          if (np.textContent) contentCol.push(np);
        });
      }
      const btn = content.querySelector('.btn_Wrap_Secondary_stdban a, [class*="btn_Wrap"] a, a');
      if (btn) {
        const p = document2.createElement("p");
        const a = document2.createElement("a");
        a.setAttribute("href", btn.getAttribute("href") || "");
        a.textContent = btn.textContent.replace(/\s+/g, " ").trim();
        p.appendChild(a);
        contentCol.push(p);
      }
    }
    const cells = [[imageCol, contentCol]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-promo", cells });
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
        "div.breadcrumb",
        // breadcrumb navigation bar (sub-pages, e.g. /students/student-life)
        "noscript",
        // GTM <noscript> iframe ("GTM body script") + other no-JS fallbacks
        "iframe"
        // tracking / ad pixels
      ]);
      const bodyH1 = element.querySelector(":scope > h1");
      if (bodyH1) bodyH1.remove();
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

  // tools/importer/import-student-life.js
  var PAGE_TEMPLATE = {
    name: "student-life",
    description: "Student life landing page: hero, intro, a topics tile grid, a social-media icon row, a navy promo banner, a student-media tile row, and Need help. Shares block variants with the students template.",
    urls: [
      "https://www.rmit.edu.au/students/student-life"
    ],
    blocks: [
      {
        name: "hero-overlay",
        instances: ["div.pageheader"]
      },
      {
        name: "cards-tile",
        instances: [
          "div.generic-gridlist",
          "div.iconfeature:has(div.image-card)"
        ]
      },
      {
        name: "cards-links",
        instances: ["div.iconfeature:has(div.icon-card)"]
      },
      {
        name: "columns-promo",
        instances: ["div.standardbanners"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "div.pageheader",
        style: null,
        blocks: ["hero-overlay"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Intro",
        selector: "div.intro",
        style: null,
        blocks: [],
        defaultContent: ["div.intro"]
      },
      {
        id: "section-3",
        name: "Student life topics grid",
        selector: "div.generic-gridlist",
        style: null,
        blocks: ["cards-tile"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Follow us on social media",
        selector: "div.sectionarea.nopixel",
        style: "grey",
        blocks: ["cards-links"],
        defaultContent: ["div.text-component"]
      },
      {
        id: "section-5",
        name: "Explore campus facilities promo banner",
        selector: "div.standardbanners",
        style: null,
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Student media",
        selector: "div.sectionarea.bground-grey:not(.nopixel)",
        style: "grey",
        blocks: ["cards-tile"],
        defaultContent: ["div.text-component"]
      },
      {
        id: "section-7",
        name: "Need help",
        selector: "div.experiencefragment",
        style: "need-help",
        blocks: [],
        defaultContent: ["div.experiencefragment"]
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
    "cards-tile": parse2,
    "cards-links": parse3,
    "columns-promo": parse4
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
  var import_student_life_default = {
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
  return __toCommonJS(import_student_life_exports);
})();
