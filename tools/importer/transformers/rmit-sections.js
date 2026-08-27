/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: RMIT section breaks and Section Metadata.
 *
 * Driven by payload.template.sections (from page-templates.json). Section
 * selectors were DOM-verified during page analysis; used directly here.
 *
 * Follows the reference implementation exactly:
 *   - beforeTransform: insert <hr> breaks while every section element still
 *     exists (block parsers run between the hooks and replaceWith() their
 *     matched elements, so afterTransform-only insertion would silently miss
 *     sections whose boundary is the parsed element). A marker attribute on
 *     the <hr> gives a stable anchor for the metadata pass.
 *   - afterTransform: insert Section Metadata blocks anchored to the marker
 *     <hr> (or the surviving original element for the first section).
 *   - Reverse iteration in both hooks so inserts never disturb the positions
 *     of sections not yet processed.
 *
 * For the students template: 9 sections → 8 section breaks; styled sections
 * (section-2, 3, 5, 7 = "grey") → 4 Section Metadata blocks.
 */

const SECTION_MARKER_ATTR = 'data-excat-section-id';

export default function transform(hookName, element, payload) {
  const sections = payload.template.sections || [];

  if (hookName === 'beforeTransform') {
    // Insert breaks now, before parsers can replace any section element.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !section.style) continue; // first section: no break, no metadata needed
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue; // selector didn't match on this page — skip, never guess

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    // Parsers have now run and may have replaced section elements. Anchor each
    // styled section's Section Metadata block to whichever still exists: the
    // marker <hr> placed above, or (first section, no marker inserted) the
    // original element itself.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || element.querySelector(section.selector);
      if (!anchor) continue; // neither survived — selector didn't match post-parse; skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // section 0 never gets a real leading break
      }
    }
  }
}
