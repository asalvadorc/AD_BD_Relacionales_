function initLightbox() {
  if (document.querySelector('.lightbox-overlay')) {
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Vista ampliada');

  const dialog = document.createElement('div');
  dialog.className = 'lightbox-dialog';

  const image = document.createElement('img');
  image.className = 'lightbox-image';
  image.alt = 'Vista ampliada';

  const closeButton = document.createElement('button');
  closeButton.className = 'lightbox-close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Cerrar');
  closeButton.textContent = '×';

  dialog.appendChild(image);
  dialog.appendChild(closeButton);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  function openLightbox(src, alt) {
    image.src = src;
    image.alt = alt || 'Vista ampliada';
    overlay.classList.add('is-open');
    document.body.classList.add('lightbox-open');
  }

  function closeLightbox() {
    overlay.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    image.removeAttribute('src');
    image.alt = 'Vista ampliada';
  }

  document.addEventListener('click', function (event) {
    const clickedImage = event.target.closest('.md-content img');

    if (!clickedImage || clickedImage.dataset.lightbox === 'disabled') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    openLightbox(clickedImage.currentSrc || clickedImage.src, clickedImage.alt || clickedImage.title || '');
  });

  overlay.addEventListener('click', function (event) {
    if (event.target === overlay || event.target === dialog) {
      closeLightbox();
    }
  });

  closeButton.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLightbox);
} else {
  initLightbox();
}

window.addEventListener('load', initLightbox);
