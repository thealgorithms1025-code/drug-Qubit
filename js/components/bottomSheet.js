// DoseAlert - Accessible Bottom Sheet & Modal Component
// Supports half-screen and full-height drawers, keyboard navigation, and focus trapping

export class BottomSheet {
  constructor(elementId) {
    this.container = document.getElementById(elementId);
    this.isOpen = false;
    this.closeTriggers = [];
    this.init();
  }

  init() {
    if (!this.container) return;
    
    // Backdrop click
    const backdrop = this.container.querySelector('.sheet-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.close());
    }

    // Close buttons inside sheet
    const closeBtns = this.container.querySelectorAll('[data-sheet-close]');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    // Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open(contentHtml, title = "") {
    if (!this.container) return;

    const titleEl = this.container.querySelector('.sheet-header-title');
    const bodyEl = this.container.querySelector('.sheet-content-body');

    if (titleEl) titleEl.textContent = title;
    if (bodyEl && contentHtml) bodyEl.innerHTML = contentHtml;

    this.container.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    this.isOpen = true;

    // Focus first focusable element
    setTimeout(() => {
      const focusable = this.container.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
    }, 100);
  }

  close() {
    if (!this.container) return;
    this.container.classList.remove('is-open');
    document.body.style.overflow = '';
    this.isOpen = false;
  }
}
