/* --- MAIN LOGIC --- */
document.addEventListener("DOMContentLoaded", () => {
  
  // 1. SPOTLIGHT EFFECT
  const cards = document.querySelectorAll(".spotlight");
  document.addEventListener("mousemove", (e) => {
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--cursor-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--cursor-y", `${e.clientY - rect.top}px`);
    });
  });

  // 1.5. CARD ANIMATION ON SCROLL
  const cardElements = document.querySelectorAll(".card");
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        cardObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });
  
  cardElements.forEach(card => {
    cardObserver.observe(card);
  });

  // 2. NAV HIGHLIGHT
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");
  let currentActiveId = null;
  let rafId = null;
  let isScrolling = false;
  
  // Function to set active nav link
  function setActiveNavLink(id) {
    if(currentActiveId === id) return; // Avoid unnecessary updates
    currentActiveId = id;
    // Update both desktop and mobile nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove("active");
      link.removeAttribute('aria-current');
    });
    document.querySelectorAll(`.nav-link[href="#${id}"]`).forEach(link => {
      link.classList.add("active");
      link.setAttribute('aria-current', 'page');
    });
  }
  
  // Make it globally available
  window.setActiveNavLink = setActiveNavLink;
  
  // Handle click on nav links with smooth scroll
  function handleNavClick(e, link) {
    e.preventDefault();
    const href = link.getAttribute("href");
    if(href.startsWith("#")) {
      const id = href.substring(1);
      const target = document.getElementById(id);
      if(target) {
        if(window.lenis) {
          window.lenis.scrollTo(target, { offset: -20 });
        } else {
          window.scrollTo({ top: target.offsetTop - 20, behavior: 'smooth' });
        }
        setActiveNavLink(id);
        
        // Close mobile menu if open
        const mobileNav = document.getElementById('mobile-nav');
        const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        if(mobileNav && mobileNav.classList.contains('active')) {
          mobileNav.classList.remove('active');
          mobileNavOverlay.classList.remove('active');
          mobileNav.setAttribute('aria-hidden', 'true');
          mobileNavOverlay.setAttribute('aria-hidden', 'true');
          if(mobileToggle) mobileToggle.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    }
  }
  
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => handleNavClick(e, link));
  });
  
  // Mobile menu links
  const mobileNavLinks = document.querySelectorAll('.mobile-nav .nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener("click", (e) => handleNavClick(e, link));
  });
  
  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  
  function toggleMobileMenu() {
    const isActive = mobileNav.classList.contains('active');
    mobileNav.classList.toggle('active');
    mobileNavOverlay.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    mobileNav.setAttribute('aria-hidden', isActive ? 'true' : 'false');
    mobileNavOverlay.setAttribute('aria-hidden', isActive ? 'true' : 'false');
    document.body.style.overflow = isActive ? '' : 'hidden';
  }
  
  if(mobileMenuToggle && mobileNav) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    mobileNavOverlay.addEventListener('click', toggleMobileMenu);
  }
  
  // Smooth scroll detection function
  function updateActiveSection() {
    let activeSection = null;
    let minDistance = Infinity;
    const scrollY = window.scrollY;
    const viewportCenter = scrollY + window.innerHeight * 0.3; // 30% from top
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionTop = scrollY + rect.top;
      const sectionCenter = sectionTop + rect.height / 2;
      const distance = Math.abs(sectionCenter - viewportCenter);
      
      // Check if section is visible in viewport
      if(rect.top < window.innerHeight && rect.bottom > 0) {
        // Prefer sections that are above or at viewport center
        if(sectionCenter <= viewportCenter + 100) {
          if(distance < minDistance) {
            minDistance = distance;
            activeSection = section;
          }
        }
      }
    });
    
    // If no section found above center, find the closest visible one
    if(!activeSection) {
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if(rect.top < window.innerHeight && rect.bottom > 0) {
          const sectionTop = scrollY + rect.top;
          const distance = Math.abs(sectionTop - scrollY - 150);
          if(distance < minDistance) {
            minDistance = distance;
            activeSection = section;
          }
        }
      });
    }
    
    if(activeSection) {
      setActiveNavLink(activeSection.id);
    }
  }
  
  // Smooth scroll handler using requestAnimationFrame
  function handleScroll() {
    if(!isScrolling) {
      isScrolling = true;
    }
    
    if(rafId) {
      cancelAnimationFrame(rafId);
    }
    
    rafId = requestAnimationFrame(() => {
      updateActiveSection();
      isScrolling = false;
    });
  }
  
  // Scroll event listener
  window.addEventListener("scroll", handleScroll, { passive: true });
  
  // Also update when scroll ends (for final accuracy)
  let scrollEndTimeout = null;
  window.addEventListener("scroll", () => {
    if(scrollEndTimeout) clearTimeout(scrollEndTimeout);
    scrollEndTimeout = setTimeout(() => {
      updateActiveSection();
    }, 150);
  }, { passive: true });
  
  // Initial update
  updateActiveSection();
  
  // Update aria-current on initial load
  setTimeout(() => {
    document.querySelectorAll('.nav-link').forEach(link => {
      if(link.classList.contains('active')) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }, 100);
});

// Service Worker Registration with Auto-Update
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', {
      scope: '/'
    })
    .then((registration) => {
      console.log('[SW] Service Worker registered:', registration.scope);
      
      // Check for updates every hour
      setInterval(() => {
        registration.update();
      }, 3600000); // 1 hour
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available, reload page to activate
              console.log('[SW] New service worker available, reloading...');
              window.location.reload();
            }
          });
        }
      });
    })
    .catch((error) => {
      console.error('[SW] Service Worker registration failed:', error);
    });
    
    // Listen for controller change (when new SW takes control)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[SW] New service worker activated, reloading...');
      window.location.reload();
    });
  });
}



