/** NAVIGATION - ACTIVE STATE (IntersectionObserver) */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(
    (entries) => {
        let currentSection = null;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                currentSection = entry.target;
            }
        });

        if (currentSection) {
            const id = currentSection.getAttribute('id');

            navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${id}`;
                link.classList.toggle('active', isActive);

                if (isActive) {
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        };
    },
    {
        rootMargin: '-40% 0px -50% 0px',
        threshold: 0
    }
);

sections.forEach(section => observer.observe(section));

/**** BURGER MENU */
const burgerToggle = document.getElementById('burger-toggle');
const burgerNav = document.querySelector('.mobile-nav');
const burgerMenu = document.querySelector('.burger-menu');

function openMenu() {
    burgerMenu.classList.add('is-open');
    burgerNav.classList.add('is-open');
    burgerToggle.setAttribute('aria-label', 'Close menu');
    burgerToggle.setAttribute('aria-expanded', 'true');

    const firstLink = burgerNav.querySelector('a');
    firstLink?.focus();
}

function closeMenu() {
    burgerMenu.classList.remove('is-open');
    burgerNav.classList.remove('is-open');
    burgerToggle.setAttribute('aria-label', 'Show menu');
    burgerToggle.setAttribute('aria-expanded', 'false');
    burgerToggle.focus();
}

function toggleMenu() {
    if (burgerMenu.classList.contains('is-open')) {
        closeMenu();
    } else {
        openMenu();
    }
}

burgerToggle.addEventListener('click', toggleMenu);

// Close burger after clicking on link
burgerNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Closing the menu with the Escape button
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!burgerMenu.classList.contains('is-open')) return;

    closeMenu();
    burgerToggle.focus();
});

// Closing by clicking outside the menu
document.addEventListener('click', (e) => {
    if (!burgerMenu.classList.contains('is-open')) return;
    if (burgerMenu.contains(e.target)) return;

    closeMenu();
});

/*** Focus Trap */
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (!burgerMenu.classList.contains('is-open')) return;

    const focusableElements = burgerMenu.querySelectorAll(
        'button, a[href], [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
    }

    if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
    }
});

/** 3D MODEL ANIMATION */
window.addEventListener("load", () => {
    if (window.innerWidth < 1024) return;

    const startThree = async () => {
        await import("./three-animation.js");
    };

    if ("requestIdleCallback" in window) {
        requestIdleCallback(startThree, { timeout: 2000 });
    } else {
        setTimeout(startThree, 500);
    }
});

/** LIGHTBOX PHOTOGALLERY */
document.addEventListener("DOMContentLoaded", function () {
    // Load all links with aria-label="lightbox"
    const links = document.querySelectorAll('a[aria-label="lightbox"]');
  
    // Lightbox and navigation variables
    let overlay, overlayImg, closeBtn, leftBtn, rightBtn;
  
    // Index of currently shown image
    let currentIndex = -1;
  
    // Image URL array
    let images = [];
  
    // For every link...
    links.forEach((link, index) => {
      // Save URL
      images.push(link.getAttribute('href'));
  
      // Set event listener CLICK
      link.addEventListener('click', e => {
        e.preventDefault(); // Stop transition to image
  
        currentIndex = index; // Save the image index
  
        // Ger description from data-title
        const captionText = link.getAttribute("data-title");
  
        // Set the Lightbox functions
        showLightbox(images[currentIndex], captionText);
      });
    });
  
    function showLightbox(src, captionText) {
      if (!overlay) {
        // Create overlay
        overlay = document.createElement('div');
        overlay.id = 'lightbox-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
  
        // Create the img
        overlayImg = document.createElement('img');
        overlay.appendChild(overlayImg);
  
        /*** Lighbox navigation */
        const controls = document.createElement('div');
        controls.className = 'lightbox-controls';
  
        // Close button
        closeBtn = document.createElement('button');
        closeBtn.className = 'lightbox-button';
        closeBtn.innerHTML = '&times;';
        controls.appendChild(closeBtn);
  
        overlay.appendChild(controls);
  
        // Left Arrow
        leftBtn = document.createElement('button');
        leftBtn.className = 'arrow-left';
        leftBtn.textContent = '‹';
        overlay.appendChild(leftBtn);
  
        // Rigth arrow
        rightBtn = document.createElement('button');
        rightBtn.className = 'arrow-right';
        rightBtn.textContent = '›';
        overlay.appendChild(rightBtn);
  
        // Add overlay to the page
        document.body.appendChild(overlay);
  
        closeBtn.addEventListener('click', hideLightbox);
        overlay.addEventListener('click', e => {
          if (e.target === overlay) hideLightbox();
        });
        document.addEventListener('keydown', e => {
          if (!overlay || overlay.style.display !== 'flex') return;

          if (e.key === 'Escape') hideLightbox();
          if (e.key === 'ArrowRight') showNext();
          if (e.key === 'ArrowLeft') showPrev();
        });
        leftBtn.addEventListener('click', showPrev);
        rightBtn.addEventListener('click', showNext);
      }
  
      overlayImg.src = src;
  
      // Description
      const oldCaption = overlay.querySelector(".lightbox-caption");
      if (oldCaption) oldCaption.remove();
  
      // Create new description
      if (captionText) {
        const caption = document.createElement("p");
        caption.textContent = captionText;
        caption.classList.add("lightbox-caption");
        overlay.appendChild(caption);
      }
  
      // Show overloy - disable page scroll
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  
    // Hide Lightboy
    function hideLightbox() {
      overlay.style.display = 'none';
      overlayImg.src = '';
      document.body.style.overflow = '';
    }
  
    // Show previos image
    function showPrev() {
      if (currentIndex > 0) {
        currentIndex--;
        const captionText = links[currentIndex].getAttribute("data-title");
        showLightbox(images[currentIndex], captionText);
      }
    }
  
    // Show next image
    function showNext() {
      if (currentIndex < images.length - 1) {
        currentIndex++;
        const captionText = links[currentIndex].getAttribute("data-title");
        showLightbox(images[currentIndex], captionText);
      }
    }
  });
