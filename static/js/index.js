// Progressive enhancement: figures and all result tables also work without JavaScript.
const tabList = document.querySelector('.results-tabs');
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
function selectResult(tab) {
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
}
if (tabList && tabs.length) {
  tabs.forEach((tab, index) => {
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    tab.addEventListener('click', () => selectResult(tab));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        selectResult(tabs[next]);
        tabs[next].focus();
      }
    });
  });
  selectResult(tabs[0]);
  tabList.hidden = false;
}

const figureDialog = document.getElementById('figure-dialog');
if (figureDialog && typeof figureDialog.showModal === 'function') {
  document.querySelectorAll('[data-lightbox]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const image = figureDialog.querySelector('img');
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
      figureDialog.showModal();
    });
  });
  figureDialog.querySelector('button').addEventListener('click', () => figureDialog.close());
  figureDialog.addEventListener('click', (event) => {
    if (event.target === figureDialog) figureDialog.close();
  });
}

const copyButton = document.querySelector('.copy-bibtex-btn');
if (copyButton) {
  copyButton.addEventListener('click', async () => {
    const text = document.getElementById('bibtex-code').textContent;
    const label = copyButton.querySelector('.copy-text');
    try {
      await navigator.clipboard.writeText(text);
      label.textContent = 'Copied!';
      copyButton.classList.add('copied');
    } catch {
      const range = document.createRange();
      range.selectNodeContents(document.getElementById('bibtex-code'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      label.textContent = 'Selected — copy manually';
    }
    setTimeout(() => {
      label.textContent = 'Copy';
      copyButton.classList.remove('copied');
    }, 2500);
  });
}

const scrollButton = document.querySelector('.scroll-to-top');
if (scrollButton) {
  const updateScrollButton = () => scrollButton.classList.toggle('visible', window.scrollY > 300);
  window.addEventListener('scroll', updateScrollButton, { passive: true });
  updateScrollButton();
  scrollButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
}
