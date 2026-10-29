function initLightbox() {
  const contentImages = document.querySelectorAll('.md-content img:not([data-lightbox="disabled"])');

  contentImages.forEach(function (contentImage) {
    if (contentImage.closest('a')) return;

    contentImage.tabIndex = 0;
    contentImage.setAttribute('role', 'button');
    contentImage.setAttribute(
      'aria-label',
      'Ampliar imagen' + (contentImage.alt ? ': ' + contentImage.alt : '')
    );
  });

  if (document.querySelector('.lightbox-overlay')) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Vista ampliada de la imagen');
  overlay.setAttribute('aria-hidden', 'true');

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

  let previousFocus = null;

  function openLightbox(src, alt) {
    previousFocus = document.activeElement;
    image.src = src;
    image.alt = alt || 'Vista ampliada';
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  }

  function closeLightbox() {
    if (!overlay.classList.contains('is-open')) return;

    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    image.removeAttribute('src');
    image.alt = 'Vista ampliada';

    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  }

  function getLightboxImage(target) {
    const contentImage = target instanceof Element
      ? target.closest('.md-content img:not([data-lightbox="disabled"])')
      : null;

    return contentImage && !contentImage.closest('a') ? contentImage : null;
  }

  function openFromImage(contentImage) {
    openLightbox(
      contentImage.currentSrc || contentImage.src,
      contentImage.alt || contentImage.title || ''
    );
  }

  document.addEventListener('click', function (event) {
    const clickedImage = getLightboxImage(event.target);

    if (!clickedImage) return;

    event.preventDefault();
    openFromImage(clickedImage);
  });

  document.addEventListener('keydown', function (event) {
    const selectedImage = getLightboxImage(event.target);

    if (selectedImage && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      openFromImage(selectedImage);
      return;
    }

    if (!overlay.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeLightbox();
    } else if (event.key === 'Tab') {
      event.preventDefault();
      closeButton.focus();
    }
  });

  overlay.addEventListener('click', function (event) {
    if (event.target === overlay || event.target === dialog) {
      closeLightbox();
    }
  });

  closeButton.addEventListener('click', closeLightbox);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLightbox);
} else {
  initLightbox();
}

window.addEventListener('load', initLightbox);

if (typeof document$ !== 'undefined') {
  document$.subscribe(initLightbox);
}
