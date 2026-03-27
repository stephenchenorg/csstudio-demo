// ===== Default News Data =====
const DEFAULT_NEWS = [
  {
    id: 1,
    titleZh: '猛健樂｜減重原理・副作用與飲食建議一次看懂',
    titleEn: 'Mounjaro | Weight Loss Mechanism, Side Effects & Dietary Tips Explained',
    excerptZh: 'GLP-1 受體促效劑如何幫助體重管理？搭配高蛋白飲食的關鍵策略，避免肌肉流失的營養補充方案...',
    excerptEn: 'How do GLP-1 receptor agonists aid weight management? Key strategies for high-protein diets and nutrition plans to prevent muscle loss...',
    tag: '保健新知',
    tagEn: 'Insights',
    date: '2026-03-15',
    image: 'images/hero-protein.png'
  },
  {
    id: 2,
    titleZh: '從膠囊到果凍：HG BIO 杭州參訪金采生物，觀察劑型創新方向',
    titleEn: 'From Capsules to Jellies: HG BIO Visits Hangzhou to Explore Dosage Form Innovation',
    excerptZh: '和聚團隊赴杭州參訪金采生物，實地了解果凍條、口溶膜等新型劑型技術，掌握保健食品劑型發展趨勢...',
    excerptEn: 'The HG BIO team visited Hangzhou to explore jelly stick, oral film, and other new dosage form technologies, keeping up with industry trends...',
    tag: 'HG情報',
    tagEn: 'HG News',
    date: '2026-03-08',
    image: 'images/hero-brands-desktop.png'
  },
  {
    id: 3,
    titleZh: '從美國與台灣最新飲食指南，看保健食品市場趨勢',
    titleEn: 'Health Supplement Market Trends from the Latest US & Taiwan Dietary Guidelines',
    excerptZh: '2025-2030 美國飲食指南與台灣國民飲食指標更新，蛋白質攝取、腸道健康成為關注焦點...',
    excerptEn: 'With the 2025-2030 US dietary guidelines and Taiwan\'s updated national dietary recommendations, protein intake and gut health are now in the spotlight...',
    tag: '保健新知',
    tagEn: 'Insights',
    date: '2026-02-20',
    image: 'images/hero-news-desktop.png'
  }
];

function getNewsData() {
  const stored = localStorage.getItem('hgbio_news');
  return stored ? JSON.parse(stored) : DEFAULT_NEWS;
}

// ===== Render News Section from Data =====
function renderNewsSection() {
  const news = getNewsData();
  const container = document.getElementById('news-cards');
  if (!container) return;

  container.innerHTML = news.slice(0, 6).map(item => `
    <a href="#" class="news-card">
      <div class="news-card-image">
        <img src="${item.image}" alt="${item.titleZh}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%239ca3af%22 font-size=%2216%22%3ENo Image%3C/text%3E%3C/svg%3E'">
        <span class="news-tag">
          <span class="lang-zh">${item.tag}</span><span class="lang-en">${item.tagEn || item.tag}</span>
        </span>
      </div>
      <div class="news-card-body">
        <time>${item.date}</time>
        <h3>
          <span class="lang-zh">${item.titleZh}</span>
          <span class="lang-en">${item.titleEn}</span>
        </h3>
        <p>
          <span class="lang-zh">${item.excerptZh}</span>
          <span class="lang-en">${item.excerptEn}</span>
        </p>
      </div>
    </a>
  `).join('');

  // Re-apply current language state
  if (currentLang === 'en') {
    document.body.classList.add('en');
  }
}

// ===== Render News Ticker from Data =====
function renderNewsTicker() {
  const news = getNewsData();
  const wrapper = document.querySelector('.news-swiper .swiper-wrapper');
  if (!wrapper) return;

  wrapper.innerHTML = news.slice(0, 5).map(item => `
    <div class="swiper-slide">
      <a href="#">
        <span class="lang-zh">News：${item.titleZh}</span>
        <span class="lang-en">News: ${item.titleEn}</span>
      </a>
    </div>
  `).join('');
}

// ===== Init News =====
renderNewsTicker();
renderNewsSection();

// News Ticker Swiper
const newsSwiper = new Swiper('.news-swiper', {
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  speed: 500,
  allowTouchMove: false,
});

// Hero Swiper
const heroSwiper = new Swiper('.hero-swiper', {
  loop: true,
  autoplay: {
    delay: 5000,
    pauseOnMouseEnter: true,
  },
  speed: 500,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});

// Mobile Menu Toggle
const mobileToggle = document.getElementById('mobile-toggle');
const mainNav = document.getElementById('main-nav');

mobileToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  const icon = mobileToggle.querySelector('i');
  if (mainNav.classList.contains('open')) {
    icon.className = 'fas fa-times';
  } else {
    icon.className = 'fas fa-bars';
  }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
    mainNav.classList.remove('open');
    mobileToggle.querySelector('i').className = 'fas fa-bars';
  }
});

// Sticky header scroll behavior
const header = document.getElementById('site-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 100) {
    header.style.boxShadow = '0 2px 15px rgba(0,0,0,0.12)';
  } else {
    header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
  }
  lastScroll = currentScroll;
});

// ===== Language Toggle (ZH <-> EN) =====
const langToggle = document.getElementById('lang-toggle');
let currentLang = 'zh';

langToggle.addEventListener('click', (e) => {
  e.preventDefault();
  currentLang = currentLang === 'zh' ? 'en' : 'zh';
  document.body.classList.toggle('en', currentLang === 'en');
  document.documentElement.lang = currentLang === 'en' ? 'en' : 'zh-Hant';

  // Update input/textarea placeholders
  document.querySelectorAll('.lang-input').forEach((el) => {
    const key = currentLang === 'en' ? 'data-ph-en' : 'data-ph-zh';
    el.placeholder = el.getAttribute(key) || '';
  });

  // Update select options for contact form
  const serviceSelect = document.getElementById('service');
  if (serviceSelect) {
    const optionsZh = ['請選擇諮詢項目', '保健原料諮詢', 'OEM/ODM', '營養蛋白產品', '寵物保健原料', '大宗食品採購', '其他'];
    const optionsEn = ['Select inquiry type', 'Health Ingredients', 'OEM/ODM', 'Nutritional Protein', 'Pet Health', 'Bulk Food', 'Other'];
    const opts = currentLang === 'en' ? optionsEn : optionsZh;
    Array.from(serviceSelect.options).forEach((opt, i) => {
      if (i < opts.length) opt.textContent = opts[i];
    });
  }
});
