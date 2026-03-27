/* ═══════════════════════════════════
   I18N LANGUAGE SWITCH
═══════════════════════════════════ */
function initLang() {
  var saved = localStorage.getItem('demo-lang') || 'zh'
  setLang(saved)
}

function setLang(lang) {
  document.documentElement.setAttribute('data-lang', lang)
  localStorage.setItem('demo-lang', lang)
  var btns = document.querySelectorAll('.lang-btn')
  btns.forEach(function(btn) {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang)
  })
}

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('lang-btn')) {
    setLang(e.target.getAttribute('data-lang'))
  }
})

/* ═══════════════════════════════════
   NAV SCROLL
═══════════════════════════════════ */
function initNav() {
  var nav = document.getElementById('nav')
  if (!nav) return
  window.addEventListener('scroll', function() {
    nav.classList.toggle('scrolled', window.scrollY > 60)
  })
  // initial check
  nav.classList.toggle('scrolled', window.scrollY > 60)
}

/* ═══════════════════════════════════
   MOBILE MENU
═══════════════════════════════════ */
function initMobile() {
  var menu = document.getElementById('mobileMenu')
  var openBtn = document.getElementById('hamburgerBtn')
  var closeBtn = document.getElementById('mobileClose')
  if (!menu || !openBtn) return

  openBtn.addEventListener('click', function() {
    menu.classList.add('open')
  })
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      menu.classList.remove('open')
    })
  }
  menu.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      menu.classList.remove('open')
    })
  })
}

/* ═══════════════════════════════════
   HERO CAROUSEL
═══════════════════════════════════ */
function initCarousel() {
  var slides = document.querySelectorAll('.hero-slide')
  var dots = document.querySelectorAll('.hero-dot')
  if (slides.length === 0) return

  var current = 0
  var interval

  function goTo(n) {
    slides[current].classList.remove('active')
    dots[current].classList.remove('active')
    current = n
    slides[current].classList.add('active')
    dots[current].classList.add('active')
  }

  function next() {
    goTo((current + 1) % slides.length)
  }

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      clearInterval(interval)
      goTo(parseInt(dot.dataset.slide))
      interval = setInterval(next, 5500)
    })
  })

  interval = setInterval(next, 5500)
}

/* ═══════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════ */
function initReveal() {
  var els = document.querySelectorAll('.reveal')
  if (els.length === 0) return

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.15 })

  els.forEach(function(el) { observer.observe(el) })
}

/* ═══════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════ */
function initCounters() {
  var counters = document.querySelectorAll('.counter')
  if (counters.length === 0) return

  var started = false
  var target = document.querySelector('.achievements-grid')
  if (!target) return

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !started) {
        started = true
        counters.forEach(function(counter) {
          var end = parseInt(counter.dataset.target)
          var duration = 2000
          var step = end / (duration / 16)
          var cur = 0
          function update() {
            cur += step
            if (cur < end) {
              counter.textContent = Math.floor(cur).toLocaleString()
              requestAnimationFrame(update)
            } else {
              counter.textContent = end.toLocaleString()
            }
          }
          update()
        })
      }
    })
  }, { threshold: 0.5 })

  observer.observe(target)
}

/* ═══════════════════════════════════
   NEWS TABS
═══════════════════════════════════ */
function initNewsTabs() {
  var tabs = document.querySelectorAll('.news-tab')
  if (tabs.length === 0) return

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active') })
      tab.classList.add('active')
      document.querySelectorAll('.news-list').forEach(function(l) { l.classList.add('hidden') })
      var target = document.getElementById(tab.dataset.target)
      if (target) target.classList.remove('hidden')
    })
  })
}

/* ═══════════════════════════════════
   CONTACT FORM
═══════════════════════════════════ */
function handleSubmit(e) {
  e.preventDefault()
  var lang = document.documentElement.getAttribute('data-lang')
  if (lang === 'en') {
    alert('Thank you for your inquiry. We will contact you shortly.')
  } else {
    alert('感謝您的諮詢，我們將盡快與您聯繫。')
  }
  e.target.reset()
}

/* ═══════════════════════════════════
   INIT ALL
═══════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  initLang()
  initNav()
  initMobile()
  initCarousel()
  initReveal()
  initCounters()
  initNewsTabs()
})
