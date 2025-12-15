/* --- UTILITIES --- */

// COPY TO CLIPBOARD with improved feedback
function copyToClip(text, element) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      element.classList.add('copied');
      const tooltip = element.querySelector('.copy-tooltip');
      if(tooltip) tooltip.textContent = 'COPIED';
      setTimeout(() => {
        element.classList.remove('copied');
        if(tooltip) tooltip.textContent = '';
      }, 2000);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        element.classList.add('copied');
        setTimeout(() => element.classList.remove('copied'), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
      document.body.removeChild(textArea);
    });
  }
}

// SAVE SCROLL POSITION
function saveScrollPosition() {
  sessionStorage.setItem('scrollPosition', window.scrollY.toString());
}

function restoreScrollPosition() {
  const savedPosition = sessionStorage.getItem('scrollPosition');
  if(savedPosition) {
    window.scrollTo(0, parseInt(savedPosition, 10));
    sessionStorage.removeItem('scrollPosition');
  }
}

// Save scroll position before unload
window.addEventListener('beforeunload', saveScrollPosition);

// Restore on load (with slight delay for layout)
window.addEventListener('load', () => {
  setTimeout(restoreScrollPosition, 100);
});

// Make copyToClip globally available
window.copyToClip = copyToClip;



