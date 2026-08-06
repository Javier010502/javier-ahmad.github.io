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

  // Lightbox (kept for items that do NOT have a detail modal)
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const lbClose = document.getElementById('lbClose');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      // If this item has detailed modal data, open the field detail modal instead
      if (item.dataset.desc || item.dataset.location || item.dataset.equipment) {
        openFieldModal(item);
        return;
      }
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

  // ===== PROJECT MODAL =====
  const projectModal = document.getElementById('projectModal');
  const projectModalOverlay = document.getElementById('projectModalOverlay');
  const projectModalClose = document.getElementById('projectModalClose');
  const projectCards = document.querySelectorAll('.proj-card');

  // State untuk gallery multi-foto
  let projectGalImages = [];
  let projectGalIndex = 0;

  const setProjectGalleryImage = () => {
    const modalImg = document.getElementById('projectModalImg');
    if (!projectGalImages.length) return;
    modalImg.src = projectGalImages[projectGalIndex];
    modalImg.alt = `${document.getElementById('projectModalTitle').textContent} — foto ${projectGalIndex + 1}`;
    document.getElementById('projectGalCounter').textContent =
      `${projectGalIndex + 1} / ${projectGalImages.length}`;
  };

  document.getElementById('projectGalPrev').addEventListener('click', () => {
    if (!projectGalImages.length) return;
    projectGalIndex = (projectGalIndex - 1 + projectGalImages.length) % projectGalImages.length;
    setProjectGalleryImage();
  });
  document.getElementById('projectGalNext').addEventListener('click', () => {
    if (!projectGalImages.length) return;
    projectGalIndex = (projectGalIndex + 1) % projectGalImages.length;
    setProjectGalleryImage();
  });

  // Project data - each card will have these data attributes
  const openProjectModal = (card) => {
    const num = card.dataset.num || '';
    const title = card.dataset.title || card.querySelector('.proj-title')?.textContent || '';
    const cat = card.dataset.cat || card.querySelector('.proj-cat')?.textContent || '';
    const desc = card.dataset.desc || card.querySelector('.proj-desc')?.textContent || '';
    const tech = card.dataset.tech ? JSON.parse(card.dataset.tech) : [];
    const role = card.dataset.role || '';
    const tags = card.dataset.tags ? JSON.parse(card.dataset.tags) : [];
    const outcome = card.dataset.outcome || '';
    const imgSrc = card.dataset.img || card.querySelector('img')?.src || '';

    document.getElementById('projectModalNum').textContent = num;
    document.getElementById('projectModalTitle').textContent = title;
    document.getElementById('projectModalCat').textContent = cat;
    document.getElementById('projectModalDesc').textContent = desc;
    document.getElementById('projectModalRole').textContent = role;
    document.getElementById('projectModalOutcome').textContent = outcome;

    // Technical details list
    const techList = document.getElementById('projectModalTech');
    techList.innerHTML = '';
    tech.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      techList.appendChild(li);
    });

    // Tags
    const tagsContainer = document.getElementById('projectModalTags');
    tagsContainer.innerHTML = '';
    tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'exp-tag';
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });

    // Image (+ multi-foto gallery jika ada data-imgs)
    const modalImg = document.getElementById('projectModalImg');
    const gallery = document.getElementById('projectModalGallery');
    const imgs = card.dataset.imgs ? JSON.parse(card.dataset.imgs) : [];
    if (imgs.length > 1) {
      projectGalImages = imgs;
      projectGalIndex = 0;
      setProjectGalleryImage();
      gallery.hidden = false;
    } else {
      projectGalImages = [];
      gallery.hidden = true;
      if (imgSrc) {
        modalImg.src = imgSrc;
        modalImg.alt = title;
        modalImg.style.display = 'block';
      } else {
        modalImg.style.display = 'none';
      }
    }

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  projectCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      // Don't open modal if clicking on a link inside
      if (e.target.tagName === 'A') return;
      openProjectModal(card);
    });
    // Keyboard accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProjectModal(card);
      }
    });
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Lihat detail proyek ${card.querySelector('.proj-title')?.textContent || ''}`);
  });

  projectModalClose.addEventListener('click', closeProjectModal);
  projectModalOverlay.addEventListener('click', closeProjectModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('open')) {
      closeProjectModal();
    }
  });

  // ===== FIELD WORK MODAL =====
  const fieldModal = document.getElementById('fieldModal');
  const fieldModalOverlay = document.getElementById('fieldModalOverlay');
  const fieldModalClose = document.getElementById('fieldModalClose');
  const galItems = document.querySelectorAll('.gal-item');

  // State untuk gallery multi-foto
  let fieldGalImages = [];
  let fieldGalIndex = 0;

  const setFieldGalleryImage = () => {
    const modalImg = document.getElementById('fieldModalImg');
    if (!fieldGalImages.length) return;
    modalImg.src = fieldGalImages[fieldGalIndex];
    modalImg.alt = `${document.getElementById('fieldModalTitle').textContent} — foto ${fieldGalIndex + 1}`;
    document.getElementById('fieldGalCounter').textContent =
      `${fieldGalIndex + 1} / ${fieldGalImages.length}`;
  };

  document.getElementById('fieldGalPrev').addEventListener('click', () => {
    if (!fieldGalImages.length) return;
    fieldGalIndex = (fieldGalIndex - 1 + fieldGalImages.length) % fieldGalImages.length;
    setFieldGalleryImage();
  });
  document.getElementById('fieldGalNext').addEventListener('click', () => {
    if (!fieldGalImages.length) return;
    fieldGalIndex = (fieldGalIndex + 1) % fieldGalImages.length;
    setFieldGalleryImage();
  });

  const openFieldModal = (item) => {
    const num = item.dataset.num || '';
    const title = item.dataset.title || item.querySelector('figcaption')?.textContent || '';
    const cat = item.dataset.cat || item.dataset.cat-label || '';
    const location = item.dataset.location || '';
    const desc = item.dataset.desc || item.dataset.desc || '';
    const challenge = item.dataset.challenge || '';
    const equipment = item.dataset.equipment ? JSON.parse(item.dataset.equipment) : [];
    const tags = item.dataset.tags ? JSON.parse(item.dataset.tags) : [];
    const imgSrc = item.querySelector('img')?.src || '';

    document.getElementById('fieldModalNum').textContent = num;
    document.getElementById('fieldModalTitle').textContent = title;
    document.getElementById('fieldModalCat').textContent = cat;
    document.getElementById('fieldModalLocation').textContent = location;
    document.getElementById('fieldModalDesc').textContent = desc;
    document.getElementById('fieldModalChallenge').textContent = challenge;

    // Equipment list
    const equipList = document.getElementById('fieldModalEquipment');
    equipList.innerHTML = '';
    equipment.forEach(eq => {
      const li = document.createElement('li');
      li.textContent = eq;
      equipList.appendChild(li);
    });

    // Tags
    const tagsContainer = document.getElementById('fieldModalTags');
    tagsContainer.innerHTML = '';
    tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'exp-tag';
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });

    // Image (+ multi-foto gallery jika ada data-imgs)
    const modalImg = document.getElementById('fieldModalImg');
    const gallery = document.getElementById('fieldModalGallery');
    const imgs = item.dataset.imgs ? JSON.parse(item.dataset.imgs) : [];
    if (imgs.length > 1) {
      fieldGalImages = imgs;
      fieldGalIndex = 0;
      setFieldGalleryImage();
      gallery.hidden = false;
    } else {
      fieldGalImages = [];
      gallery.hidden = true;
      if (imgSrc) {
        modalImg.src = imgSrc;
        modalImg.alt = title;
        modalImg.style.display = 'block';
      } else {
        modalImg.style.display = 'none';
      }
    }

    fieldModal.classList.add('open');
    fieldModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeFieldModal = () => {
    fieldModal.classList.remove('open');
    fieldModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  galItems.forEach(item => {
    // Only add click for modal if it has detailed modal data
    if (item.dataset.desc || item.dataset.location || item.dataset.equipment) {
      item.style.cursor = 'pointer';
      item.addEventListener('click', (e) => {
        openFieldModal(item);
      });
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openFieldModal(item);
        }
      });
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `Lihat detail ${item.querySelector('figcaption')?.textContent || ''}`);
    }
  });

  fieldModalClose.addEventListener('click', closeFieldModal);
  fieldModalOverlay.addEventListener('click', closeFieldModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fieldModal.classList.contains('open')) {
      closeFieldModal();
    }
  });
});