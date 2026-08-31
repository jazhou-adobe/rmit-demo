export default function decorate(block) {
  // hero-overlay is a CSS-only variant. One import fix: the lead paragraph is
  // sometimes doubled in the text panel — drop a paragraph identical to the one
  // immediately before it.
  block.querySelectorAll('p').forEach((p) => {
    const prev = p.previousElementSibling;
    if (prev && prev.tagName === 'P' && prev.textContent.trim() === p.textContent.trim()) {
      p.remove();
    }
  });
}
