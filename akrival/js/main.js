/* ============================================================
   Akrival OÜ — ühine JavaScript
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. Hamburger-menüü ---------- */
  var hamburger = document.querySelector('.hamburger');
  var mainNav = document.querySelector('.main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function () {
      var open = mainNav.classList.toggle('is-open');
      hamburger.classList.toggle('is-active', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      hamburger.setAttribute('aria-label', open ? 'Sulge menüü' : 'Ava menüü');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Sulge menüü, kui klikitakse lingil (v.a rippmenüü avamine mobiilis)
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        // Mobiilis avab esimene puudutus "Teenused" alammenüü — menüüd ei suleta
        if (link.parentElement.classList.contains('has-dropdown') &&
            window.matchMedia('(max-width: 900px)').matches &&
            !link.parentElement.classList.contains('is-open')) {
          return;
        }
        mainNav.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- 2. Rippmenüü (mobiilis ja klaviatuuriga) ---------- */
  document.querySelectorAll('.has-dropdown').forEach(function (item) {
    var trigger = item.querySelector('.nav-link');
    if (!trigger) return;

    trigger.addEventListener('click', function (e) {
      // Mobiilis avab esimene puudutus alammenüü, teine navigeerib
      if (window.matchMedia('(max-width: 900px)').matches && !item.classList.contains('is-open')) {
        e.preventDefault();
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    item.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  });

  // Sulge rippmenüü, kui klikitakse väljapoole
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.has-dropdown.is-open').forEach(function (item) {
      if (!item.contains(e.target)) {
        item.classList.remove('is-open');
        var trigger = item.querySelector('.nav-link');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---------- 3. Aktiivne menüüelement ---------- */
  (function () {
    var path = window.location.pathname.replace(/\\/g, '/');
    var current = path.split('/').pop() || 'index.html';
    var inServices = path.indexOf('/teenused/') !== -1;

    document.querySelectorAll('.nav-list a').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      var target = href.split('/').pop();

      if (target === current) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
      // Teenuse alamlehel tõsta esile ka "Teenused" peamenüüs
      if (inServices && target === 'teenused.html' && link.classList.contains('nav-link')) {
        link.classList.add('is-active');
      }
    });
  })();

  /* ---------- 4. Accordion (KKK ja hinnakiri) ---------- */
  document.querySelectorAll('.accordion-header').forEach(function (header) {
    header.addEventListener('click', function () {
      var item = header.closest('.accordion-item');
      var body = item.querySelector('.accordion-body');
      var isOpen = item.classList.contains('is-open');

      // Sulge teised sama accordioni üksused
      var accordion = item.closest('.accordion');
      if (accordion) {
        accordion.querySelectorAll('.accordion-item.is-open').forEach(function (other) {
          if (other !== item) {
            other.classList.remove('is-open');
            other.querySelector('.accordion-body').style.maxHeight = null;
            other.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
          }
        });
      }

      item.classList.toggle('is-open', !isOpen);
      header.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      body.style.maxHeight = !isOpen ? body.scrollHeight + 'px' : null;
    });
  });

  /* ---------- 5. Tabid (KKK leht) ---------- */
  document.querySelectorAll('.tabs-nav').forEach(function (nav) {
    var buttons = nav.querySelectorAll('.tab-btn');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-tab');
        if (!targetId) return;

        buttons.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        document.querySelectorAll('.tab-panel').forEach(function (panel) {
          panel.classList.toggle('is-active', panel.id === targetId);
        });
      });
    });
  });

  /* ---------- 6. Scroll-to-top nupp ---------- */
  var scrollBtn = document.querySelector('.scroll-top');
  if (scrollBtn) {
    var toggleScrollBtn = function () {
      scrollBtn.classList.toggle('is-visible', window.scrollY > 480);
    };
    window.addEventListener('scroll', toggleScrollBtn, { passive: true });
    toggleScrollBtn();

    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 7. Sujuv kerimine ankrulinkidele ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- 8. Kontaktvorm ---------- */
  var contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Täname! Võtame teiega ühendust 24 tunni jooksul.');
      contactForm.reset();
    });
  }

  /* ---------- 9. Ilmumisanimatsioon kerimisel ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
