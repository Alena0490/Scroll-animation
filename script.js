/** NAVIGATION - ACTIVE STATE (IntersectionObserver) */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === `#${id}`
                    );
                });
            }
        });
    },
    {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0
    }
);

sections.forEach(section => observer.observe(section));

/****  BURGER MENU */
const burgerToggle = document.getElementById('burger-toggle');
const burgerNav = document.querySelector('.mobile-nav');
const burgerMenu = document.querySelector('.burger-menu');

burgerToggle.addEventListener('click', () => {
    const isOpen = burgerMenu.classList.toggle('is-open');
    burgerNav.style.display = isOpen ? 'flex' : 'none';
    burgerToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Show menu');
});

// Close burger after clicking on link
burgerNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        burgerMenu.classList.remove('is-open');
        burgerNav.style.display = 'none';
        burgerToggle.setAttribute('aria-label', 'Show menu');
    });
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
          if (e.target === overlay) hideLightbox(); // Klik mimo obrázek zavře overlay
        });
        document.addEventListener('keydown', e => {
          if (e.key === 'Escape') hideLightbox(); // Zavření klávesou Esc
          if (e.key === 'ArrowRight') showNext(); // Šipka doprava
          if (e.key === 'ArrowLeft') showPrev();  // Šipka doleva
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
  