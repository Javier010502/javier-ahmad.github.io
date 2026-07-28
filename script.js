// Javier Ahmad — Portfolio interactions
document.addEventListener('DOMContentLoaded', () => {
  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Navbar background on scroll
  const nav = document.getElementById('nv');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu toggle
  const toggle = document.getElementById('nvToggle');
  const links = document.getElementById('nvLinks');
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );

  // Smooth scroll with nav offset
  const navHeight = () => nav.getBoundingClientRect().height;
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = navHeight();
        const targetPos = target.getBoundingClientRect().top + window.scrollY - offset - 8;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // Scroll reveal with IntersectionObserver
  const reveals = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), (i % 5) * 60);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => obs.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Gallery filter
  const filterBtns = document.querySelectorAll('.gal-btn');
  const galleryItems = document.querySelectorAll('.gal-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      galleryItems.forEach(it => {
        const show = f === 'all' || it.dataset.cat === f;
        it.classList.toggle('hide', !show);
      });
    });
  });

  // Lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const lbClose = document.getElementById('lbClose');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = item.querySelector('figcaption').textContent;
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
    });
  });
  const closeLb = () => {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
  };
  lbClose.addEventListener('click', closeLb);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });
});