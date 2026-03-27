/* ========================================
   承毅實業 — Script
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Hero Swiper ----
  const heroEl = document.querySelector('.hero-swiper');
  if (heroEl) {
    new Swiper('.hero-swiper', {
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      speed: 800,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    });
  }

  // ---- Testimonials Swiper ----
  const testEl = document.querySelector('.testimonials-swiper');
  if (testEl) {
    new Swiper('.testimonials-swiper', {
      loop: true,
      autoplay: { delay: 4000, disableOnInteraction: false },
      speed: 600,
      slidesPerView: 1,
      spaceBetween: 24,
      pagination: { el: '.testimonials-pagination', clickable: true },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }

  // ---- Mobile Menu ----
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          hamburger.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Mobile dropdown toggle
    document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
      const link = dropdown.querySelector('.nav-link');
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        }
      });
    });
  }

  // ---- Sticky Header Shadow ----
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10
        ? '0 2px 20px rgba(0,0,0,0.08)'
        : 'none';
    });
  }

  // ---- Back to Top ----
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Scroll Animations ----
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll(
    '.stat-card, .product-card, .service-card, .testimonial-card, .news-card, .step, .cert-card, .cert-detail-card, .oem-card, .partner-card, .article-card'
  );
  animateElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${i % 4 * 0.1}s, transform 0.6s ease ${i % 4 * 0.1}s`;
    observer.observe(el);
  });

  // ---- Contact Form (demo) ----
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('感謝您的詢問！我們將盡快與您聯繫。\n（此為展示頁面，表單尚未連接後端）');
      form.reset();
    });
  }

  // ---- Hamburger Animation ----
  const style = document.createElement('style');
  style.textContent = `
    .hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .hamburger.active span:nth-child(2) { opacity: 0; }
    .hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
  `;
  document.head.appendChild(style);

  // ---- Product Filter (Products Page) ----
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productCategories = document.querySelectorAll('.product-category');
  const articleCards = document.querySelectorAll('.article-card');

  if (filterTabs.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;

        // Product page filtering
        if (productCategories.length > 0) {
          productCategories.forEach(cat => {
            if (filter === 'all' || cat.dataset.category === filter) {
              cat.style.display = '';
            } else {
              cat.style.display = 'none';
            }
          });
        }

        // Article page filtering
        if (articleCards.length > 0) {
          articleCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
              card.style.display = '';
            } else {
              card.style.display = 'none';
            }
          });
        }
      });
    });
  }

  // ---- Sidebar Category Filter (Articles Page) ----
  const sidebarCats = document.querySelectorAll('.sidebar-cats a');
  if (sidebarCats.length > 0) {
    sidebarCats.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = link.dataset.filter;
        // Sync with top filter tabs
        filterTabs.forEach(t => {
          t.classList.toggle('active', t.dataset.filter === filter);
        });
        articleCards.forEach(card => {
          card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
        });
      });
    });
  }

  // ---- Search (Products & Articles) ----
  const productSearch = document.getElementById('productSearch');
  if (productSearch) {
    productSearch.addEventListener('input', () => {
      const q = productSearch.value.toLowerCase().trim();
      document.querySelectorAll('.product-row:not(.product-row-head)').forEach(row => {
        row.style.display = q === '' || row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  const articleSearch = document.getElementById('articleSearch');
  if (articleSearch) {
    articleSearch.addEventListener('input', () => {
      const q = articleSearch.value.toLowerCase().trim();
      articleCards.forEach(card => {
        card.style.display = q === '' || card.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  // ---- Cert Bar Duplicate for Infinite Scroll ----
  const certBarScroll = document.querySelector('.cert-bar-scroll');
  if (certBarScroll) {
    certBarScroll.innerHTML += certBarScroll.innerHTML;
  }
});
