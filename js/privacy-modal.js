/* --- PRIVACY MODAL --- */

const privacyModal = document.getElementById('privacy-modal');
const privacyModalOverlay = document.getElementById('privacy-modal-overlay');
const privacyModalClose = document.getElementById('privacy-modal-close');
const privacyModalContent = document.getElementById('privacy-modal-content');
const privacyModalTitle = document.getElementById('privacy-modal-title');

const privacyPolicies = {
  'converter': 'privacy-policy-converter.md',
  'sudoku': 'privacy-policy-sudoku.md',
  'retro-arcade': 'privacy-policy-retro-arcade.md',
  '3D-Solar-System': 'privacy-policy-3D-Solar-System.md'
};

function markdownToHTML(markdown) {
  let html = markdown;
  // Headers
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  // Bold and italic
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  // Horizontal rule
  html = html.replace(/^---$/gim, '<hr>');
  // Process lists - wrap consecutive list items
  const lines = html.split('\n');
  let inList = false;
  let listItems = [];
  let processedLines = [];
  
  lines.forEach((line, index) => {
    const isListItem = /^[\-\*] (.+)$/.test(line.trim()) || /^\d+\. (.+)$/.test(line.trim());
    
    if (isListItem) {
      if (!inList) {
        inList = true;
        listItems = [];
      }
      const content = line.replace(/^[\-\*] /, '').replace(/^\d+\. /, '');
      listItems.push('<li>' + content + '</li>');
    } else {
      if (inList) {
        processedLines.push('<ul>' + listItems.join('') + '</ul>');
        listItems = [];
        inList = false;
      }
      if (line.trim()) {
        processedLines.push(line);
      }
    }
  });
  
  if (inList && listItems.length > 0) {
    processedLines.push('<ul>' + listItems.join('') + '</ul>');
  }
  
  html = processedLines.join('\n');
  
  // Process paragraphs
  html = html.split('\n\n').map(para => {
    para = para.trim();
    if (!para) return '';
    if (para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<hr')) {
      return para;
    }
    return '<p>' + para + '</p>';
  }).join('\n');
  
  // Clean up
  html = html.replace(/<p><h/gim, '<h');
  html = html.replace(/<\/h([1-6])><\/p>/gim, '</h$1>');
  html = html.replace(/<p><ul>/gim, '<ul>');
  html = html.replace(/<\/ul><\/p>/gim, '</ul>');
  html = html.replace(/<p><hr><\/p>/gim, '<hr>');
  html = html.replace(/<p><\/p>/gim, '');
  return html;
}

async function loadPrivacyPolicy(type) {
  const fileName = privacyPolicies[type];
  if (!fileName) return;
  
  privacyModalContent.innerHTML = '<p>Loading...</p>';
  
  try {
    const response = await fetch(fileName);
    if (!response.ok) throw new Error('Failed to load');
    const markdown = await response.text();
    const html = markdownToHTML(markdown);
    privacyModalContent.innerHTML = html;
    
    const titleMatch = markdown.match(/^# (.+)$/m);
    if (titleMatch) {
      privacyModalTitle.textContent = titleMatch[1];
    }
  } catch (error) {
    privacyModalContent.innerHTML = '<p>Error loading privacy policy. Please try again later.</p>';
  }
}

function openPrivacyModal(type) {
  // Save current scroll position
  const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
  
  // Prevent body scroll without shifting content
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = scrollbarWidth + 'px';
  
  // Prevent iOS bounce scroll and preserve scroll position
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';
  
  // Store scroll position for restoration
  document.body.setAttribute('data-scroll-y', scrollY);
  
  loadPrivacyPolicy(type);
  
  // Ensure modal is positioned correctly after content loads
  setTimeout(() => {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const isMobile = viewportWidth <= 900;
    const isShortScreen = viewportHeight <= 600;
    
    // Calculate max height based on viewport
    let modalMaxHeight;
    if (isShortScreen) {
      modalMaxHeight = viewportHeight - 20;
    } else if (isMobile) {
      modalMaxHeight = viewportHeight - 20;
    } else {
      modalMaxHeight = Math.min(viewportHeight * 0.9, viewportHeight - 40);
    }
    
    privacyModal.style.maxHeight = modalMaxHeight + 'px';
    
    // Reset positioning
    privacyModal.style.top = '';
    privacyModal.style.left = '50%';
    
    // Check if modal would go outside viewport and adjust
    requestAnimationFrame(() => {
      const modalRect = privacyModal.getBoundingClientRect();
      const padding = 10;
      
      // Check bottom overflow
      if (modalRect.bottom > viewportHeight - padding) {
        const overflow = modalRect.bottom - (viewportHeight - padding);
        if (isShortScreen) {
          privacyModal.style.top = `${padding}px`;
          privacyModal.style.transform = 'translate(-50%, 0) scale(1)';
        } else {
          privacyModal.style.top = `calc(50% - ${overflow}px)`;
        }
      }
      
      // Check top overflow
      if (modalRect.top < padding) {
        privacyModal.style.top = `${padding}px`;
        if (isShortScreen) {
          privacyModal.style.transform = 'translate(-50%, 0) scale(1)';
        } else {
          privacyModal.style.transform = 'translate(-50%, 0) scale(1)';
        }
      }
      
      // Check horizontal overflow
      if (modalRect.left < padding) {
        privacyModal.style.left = `${padding + modalRect.width / 2}px`;
      }
      if (modalRect.right > viewportWidth - padding) {
        privacyModal.style.left = `${viewportWidth - padding - modalRect.width / 2}px`;
      }
    });
  }, 50);
  
  privacyModal.classList.add('active');
  privacyModalOverlay.classList.add('active');
  privacyModal.setAttribute('aria-hidden', 'false');
}

function closePrivacyModal() {
  privacyModal.classList.remove('active');
  privacyModalOverlay.classList.remove('active');
  
  // Get saved scroll position
  const scrollY = document.body.getAttribute('data-scroll-y');
  
  // Restore scroll position BEFORE removing fixed positioning
  // This prevents any visible scroll animation
  if (scrollY) {
    const scrollValue = parseInt(scrollY, 10);
    // Set scroll position directly on all possible scroll containers
    document.documentElement.scrollTop = scrollValue;
    document.body.scrollTop = scrollValue;
    window.pageYOffset = scrollValue;
  }
  
  // Remove fixed positioning - this will reveal the already-set scroll position
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.body.removeAttribute('data-scroll-y');
  
  // Ensure scroll position is maintained (some browsers might reset it)
  if (scrollY) {
    // Use immediate scrollTo without animation as final fallback
    window.scrollTo(0, parseInt(scrollY, 10));
  }
  
  privacyModal.setAttribute('aria-hidden', 'true');
  
  // Reset modal position after animation
  setTimeout(() => {
    privacyModal.style.top = '';
    privacyModal.style.left = '50%';
    privacyModal.style.transform = '';
  }, 350);
}

document.querySelectorAll('[data-privacy]').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const type = button.getAttribute('data-privacy');
    openPrivacyModal(type);
  });
});

if (privacyModalClose) {
  privacyModalClose.addEventListener('click', closePrivacyModal);
}
if (privacyModalOverlay) {
  privacyModalOverlay.addEventListener('click', closePrivacyModal);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && privacyModal && privacyModal.classList.contains('active')) {
    closePrivacyModal();
  }
});

// Handle window resize to keep modal in viewport
let resizeTimeout;
window.addEventListener('resize', () => {
  if (privacyModal && privacyModal.classList.contains('active')) {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const isMobile = viewportWidth <= 900;
      const isShortScreen = viewportHeight <= 600;
      
      let modalMaxHeight;
      if (isShortScreen) {
        modalMaxHeight = viewportHeight - 20;
      } else if (isMobile) {
        modalMaxHeight = viewportHeight - 20;
      } else {
        modalMaxHeight = Math.min(viewportHeight * 0.9, viewportHeight - 40);
      }
      
      privacyModal.style.maxHeight = modalMaxHeight + 'px';
      
      requestAnimationFrame(() => {
        const modalRect = privacyModal.getBoundingClientRect();
        const padding = 10;
        
        // Reset positioning
        privacyModal.style.top = '';
        privacyModal.style.left = '50%';
        
        // Check and fix positioning
        if (modalRect.bottom > viewportHeight - padding) {
          const overflow = modalRect.bottom - (viewportHeight - padding);
          if (isShortScreen) {
            privacyModal.style.top = `${padding}px`;
            privacyModal.style.transform = 'translate(-50%, 0) scale(1)';
          } else {
            privacyModal.style.top = `calc(50% - ${overflow}px)`;
          }
        }
        
        if (modalRect.top < padding) {
          privacyModal.style.top = `${padding}px`;
          privacyModal.style.transform = 'translate(-50%, 0) scale(1)';
        }
      });
    }, 150);
  }
});

// Make functions globally available
window.openPrivacyModal = openPrivacyModal;
window.closePrivacyModal = closePrivacyModal;

