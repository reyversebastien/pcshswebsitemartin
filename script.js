


function toggleTheme() {
  const body = document.body;
  const icon = document.querySelector('#themeToggle i');
  const isDark = body.getAttribute('data-theme') === 'dark';
  if (isDark) {
    body.removeAttribute('data-theme');
    icon.className = 'fas fa-moon';
    localStorage.setItem('pcshs-theme', 'light');
  } else {
    body.setAttribute('data-theme', 'dark');
    icon.className = 'fas fa-sun';
    localStorage.setItem('pcshs-theme', 'dark');
  }
}

(function initTheme() {
  const saved = localStorage.getItem('pcshs-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const icon = document.querySelector('#themeToggle i');
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.body.setAttribute('data-theme', 'dark');
    if (icon) icon.className = 'fas fa-sun';
  }
})();


window.addEventListener('scroll', () => {
  const header = document.getElementById('mainHeader');
  const utilityBar = document.getElementById('utilityBar');
  const backToTop = document.getElementById('backToTop');
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
    if (backToTop) backToTop.classList.add('visible');
  } else {
    header.classList.remove('scrolled');
    if (backToTop) backToTop.classList.remove('visible');
  }
});


function toggleMobileNav() {
  const nav = document.getElementById('mainNav');
  const ham = document.getElementById('hamburger');
  nav.classList.toggle('open');
  ham.classList.toggle('active');
}


let currentSlide = 0;
let slideInterval;

function goToSlide(idx) {
  const slides = document.querySelectorAll('.slide');
  const btns = document.querySelectorAll('.slide-btn');
  slides[currentSlide].classList.remove('active');
  btns[currentSlide].classList.remove('active');
  currentSlide = (idx + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  btns[currentSlide].classList.add('active');
}

function changeSlide(dir) {
  goToSlide(currentSlide + dir);
  resetSlideInterval();
}

function resetSlideInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(() => goToSlide(currentSlide + 1), 6000);
}

slideInterval = setInterval(() => goToSlide(currentSlide + 1), 6000);


function animateCount(el, target, suffix) {
  let start = 0;
  const duration = 2000;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = start.toLocaleString();
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const item = entry.target;
      const numEl = item.querySelector('.stat-num');
      const target = parseInt(item.getAttribute('data-count'));
      animateCount(numEl, target);
      statsObserver.unobserve(item);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(el => statsObserver.observe(el));


const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.news-card, .program-card, .life-card, .event-item, .faculty-card, .mv-card, .gal-item, .step, .pillar'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});


function filterGallery(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.gal-item').forEach(item => {
    if (cat === 'all' || item.getAttribute('data-cat') === cat) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
}


function openLightbox(el) {
  const img = el.querySelector('img');
  const caption = el.querySelector('.gal-overlay span');
  document.getElementById('lightboxImg').src = img.src;
  document.getElementById('lightboxCaption').textContent = caption ? caption.textContent : '';
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (!e || e.target === document.getElementById('lightbox') || e.currentTarget.classList.contains('lb-close')) {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
  }
}


let currentQuote = 0;
let quoteInterval;

function goToQuote(idx) {
  const slides = document.querySelectorAll('.quote-slide');
  const dots = document.querySelectorAll('.q-dot');
  slides[currentQuote].classList.remove('active');
  dots[currentQuote].classList.remove('active');
  currentQuote = (idx + slides.length) % slides.length;
  slides[currentQuote].classList.add('active');
  dots[currentQuote].classList.add('active');
}

quoteInterval = setInterval(() => goToQuote(currentQuote + 1), 7000);


function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      m.classList.remove('active');
    });
    closeSearch();
    closeLightbox();
    document.body.style.overflow = '';
  }
});


const searchData = [
  { title: 'About PCSHS', desc: 'Learn about our history, mission, and values.', href: '#about' },
  { title: 'Admissions', desc: 'How to apply, requirements, and exam schedule.', href: '#admissions' },
  { title: 'Academics & Programs', desc: 'Explore our STEM curriculum and courses.', href: '#academics' },
  { title: 'Student Life', desc: 'Clubs, sports, arts, and activities.', href: '#life' },
  { title: 'News & Announcements', desc: 'Latest news and updates from PCSHS.', href: '#news' },
  { title: 'Gallery', desc: 'Photos from school events and activities.', href: '#gallery' },
  { title: 'Events & Calendar', desc: 'Upcoming school events and key dates.', href: '#events' },
  { title: 'Faculty & Administration', desc: 'Meet our dedicated educators.', href: '#administration' },
  { title: 'Contact Us', desc: 'Get in touch with PCSHS offices.', href: '#contact' },
  { title: 'Research Program', desc: 'Student research opportunities at PCSHS.', href: '#research' },
  { title: 'Science Olympiad', desc: 'PCSHS award-winning olympiad teams.', href: '#honors' },
  { title: 'Student Portal Login', desc: 'Access your student account.', href: '#' },
  { title: 'Library', desc: 'Access the PCSHS digital library.', href: '#' },
  { title: 'Mission & Vision', desc: 'Our guiding principles and goals.', href: '#mission' },
  { title: 'Alumni Network', desc: 'Connect with PCSHS graduates.', href: '#' },
];

function openSearch() {
  document.getElementById('searchOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('searchInput').focus(), 100);
}

function closeSearch() {
  document.getElementById('searchOverlay').classList.remove('active');
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
  document.body.style.overflow = '';
}

function doSearch(query) {
  const resultsEl = document.getElementById('searchResults');
  if (!query.trim()) { resultsEl.innerHTML = ''; return; }
  const q = query.toLowerCase();
  const results = searchData.filter(d =>
    d.title.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q)
  );
  if (results.length === 0) {
    resultsEl.innerHTML = '<p style="opacity:.5;text-align:center;margin-top:1rem">No results found.</p>';
    return;
  }
  resultsEl.innerHTML = results.slice(0, 6).map(r => `
    <div class="search-result-item" onclick="closeSearch();window.location='${r.href}'">
      <strong>${r.title}</strong>
      <p style="font-size:.85rem;opacity:.6;margin:.2rem 0 0">${r.desc}</p>
    </div>
  `).join('');
}


document.getElementById('searchInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const first = document.querySelector('.search-result-item');
    if (first) first.click();
  }
});


function submitContact(e) {
  e.preventDefault();
  closeModal('contactModal');
  showToast('✅ Message sent! We\'ll get back to you soon.');
  e.target.reset();
}

function submitApplication(e) {
  e.preventDefault();
  closeModal('applyModal');
  showToast('🎉 Application submitted successfully! Check your email for confirmation.');
  e.target.reset();
}

function fakeLogin(e) {
  e.preventDefault();
  showToast('⚠️ Portal maintenance. Please try again later.');
}

function subscribeNewsletter(e) {
  e.preventDefault();
  showToast('📧 Subscribed! Thank you for joining our newsletter.');
  e.target.reset();
}


function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}


const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.main-nav ul li > a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 150;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});


document.querySelectorAll('.has-dropdown > a').forEach(a => {
  a.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const parent = a.parentElement;
      parent.classList.toggle('open');
    }
  });
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 120;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      
      document.getElementById('mainNav').classList.remove('open');
      document.getElementById('hamburger').classList.remove('active');
    }
  });
});


window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(s => {
      s.style.transform = `translateY(${scrolled * 0.25}px)`;
    });
  }
});


const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.progress-fill');
      fills.forEach(fill => {
        const pct = fill.getAttribute('data-pct');
        setTimeout(() => { fill.style.width = pct + '%'; }, 200);
      });
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const progressSection = document.querySelector('.progress-list');
if (progressSection) progressObserver.observe(progressSection);


document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

console.log('🎓 Pasig City Science High School — Official Website Loaded.');




const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}


function syncNews() {
  const newsGrid = document.querySelector('.news-grid');
  if (!newsGrid) return;
  const items = JSON.parse(localStorage.getItem('pcshs_news') || '[]');
  if (!items.length) return;

  newsGrid.innerHTML = '';
  items.slice(0, 4).forEach((n, i) => {
    const featured = (n.featured || i === 0) && i === 0;
    const imgUrl = n.img || 'https://images.unsplash.com/photo-1532094349884-543559b8ef09?w=800&q=80';
    const card = document.createElement('div');
    card.className = 'news-card' + (featured ? ' featured reveal' : ' reveal');
    card.innerHTML = `
      <div class="news-img" style="background-image:url('${imgUrl}')">
        <span class="news-cat">${n.category}</span>
      </div>
      <div class="news-body">
        <span class="news-date"><i class="fas fa-calendar"></i> ${formatDate(n.date)}</span>
        <h3>${n.title}</h3>
        <p>${n.summary}</p>
        <a href="#" class="read-more" onclick="openNewsDetail('${n.id}',event)">Read More <i class="fas fa-arrow-right"></i></a>
      </div>`;
    newsGrid.appendChild(card);
    revealObserver.observe(card);
  });
}


function syncEvents() {
  const list = document.querySelector('.events-list');
  if (!list) return;
  const items = JSON.parse(localStorage.getItem('pcshs_events') || '[]');
  if (!items.length) return;

  list.innerHTML = items.map(ev => `
    <div class="event-item reveal">
      <div class="event-date"><span class="ev-month">${ev.month}</span><span class="ev-day">${ev.day}</span></div>
      <div class="event-info">
        <h4>${ev.title}</h4>
        <p><i class="fas fa-map-marker-alt"></i> ${ev.location} &nbsp;|&nbsp; <i class="fas fa-clock"></i> ${ev.time}</p>
      </div>
      <a href="#" class="event-btn" onclick="openEventDetail('${ev.id}',event)">Details</a>
    </div>
  `).join('');

  list.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}


function syncResearch() {
  const grid = document.querySelector('.research-grid');
  if (!grid) return;
  const items = JSON.parse(localStorage.getItem('pcshs_research') || '[]');
  if (!items.length) return;

  const topicImgs = {
    Biology: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=600&q=80',
    Physics: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=600&q=80',
    ICT: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
    default: 'https://images.unsplash.com/photo-1532094349884-543559b8ef09?w=600&q=80'
  };

  grid.innerHTML = items.slice(0, 3).map(r => `
    <div class="research-card reveal">
      <div class="research-img" style="background-image:url('${r.img || topicImgs[r.topic] || topicImgs.default}')">
        <span class="research-topic">${r.topic}</span>
      </div>
      <div class="research-body">
        <h4>${r.title}</h4>
        <p>${r.desc}</p>
        <div class="research-meta">
          <span><i class="fas fa-user"></i> ${r.grade}</span>
          ${r.award ? `<span><i class="fas fa-trophy"></i> ${r.award}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}


function syncAwards() {
  const ticker = document.getElementById('tickerContent');
  if (!ticker) return;
  const items = JSON.parse(localStorage.getItem('pcshs_awards') || '[]');
  if (!items.length) return;
  
  const doubled = [...items, ...items];
  ticker.innerHTML = doubled.map(a => `<span>${a.text}</span>`).join('');
}


function syncAlert() {
  const banner = document.getElementById('alertBanner');
  if (!banner) return;
  const data = JSON.parse(localStorage.getItem('pcshs_alert') || '{}');
  if (!data.msg) return;

  if (data.visible === false) {
    banner.style.display = 'none';
    return;
  }

  const inner = banner.querySelector('.alert-inner span');
  if (inner) {
    const link = data.linkText && data.linkUrl
      ? `<a href="${data.linkUrl}">${data.linkText}</a>` : '';
    inner.innerHTML = `<strong>${data.msg}</strong> ${link}`;
  }
  banner.style.display = '';
}


function openNewsDetail(id, e) {
  if (e) e.preventDefault();
  const items = JSON.parse(localStorage.getItem('pcshs_news') || '[]');
  const n = items.find(x => x.id === id);
  if (!n) return;

  let modal = document.getElementById('newsDetailModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'newsDetailModal';
    modal.className = 'modal-overlay';
    modal.onclick = (ev) => { if (ev.target === modal) closeNewsDetail(); };
    document.body.appendChild(modal);
  }

  const imgUrl = n.img || 'https://images.unsplash.com/photo-1532094349884-543559b8ef09?w=800&q=80';
  modal.innerHTML = `
    <div class="modal news-detail-modal" onclick="event.stopPropagation()">
      <button class="modal-close" onclick="closeNewsDetail()"><i class="fas fa-times"></i></button>
      <div class="ndm-img" style="background-image:url('${imgUrl}')">
        <span class="news-cat">${n.category}</span>
      </div>
      <div class="ndm-body">
        <span class="news-date"><i class="fas fa-calendar"></i> ${formatDate(n.date)}</span>
        <h2>${n.title}</h2>
        <p>${n.content || n.summary}</p>
      </div>
    </div>`;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeNewsDetail() {
  const modal = document.getElementById('newsDetailModal');
  if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
}


function openEventDetail(id, e) {
  if (e) e.preventDefault();
  const items = JSON.parse(localStorage.getItem('pcshs_events') || '[]');
  const ev = items.find(x => x.id === id);
  if (!ev) return;

  let modal = document.getElementById('eventDetailModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'eventDetailModal';
    modal.className = 'modal-overlay';
    modal.onclick = (evt) => { if (evt.target === modal) modal.classList.remove('active'); document.body.style.overflow = ''; };
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()">
      <button class="modal-close" onclick="document.getElementById('eventDetailModal').classList.remove('active');document.body.style.overflow=''"><i class="fas fa-times"></i></button>
      <h2><i class="fas fa-calendar-alt"></i> ${ev.title}</h2>
      <div style="margin-top:1.5rem;display:flex;flex-direction:column;gap:.85rem">
        <div><i class="fas fa-calendar" style="color:var(--blue-primary);margin-right:.5rem"></i> <strong>${ev.month} ${ev.day}</strong></div>
        <div><i class="fas fa-map-marker-alt" style="color:var(--blue-primary);margin-right:.5rem"></i> ${ev.location}</div>
        <div><i class="fas fa-clock" style="color:var(--blue-primary);margin-right:.5rem"></i> ${ev.time}</div>
      </div>
    </div>`;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}


function injectAdminLink() {
  const footerBottom = document.querySelector('.footer-bottom .container');
  if (!footerBottom) return;
  const link = document.createElement('a');
  link.href = 'admin.html';
  link.textContent = 'Admin';
  link.style.cssText = 'margin-left:1rem;color:rgba(255,255,255,.4);font-size:.75rem;';
  link.title = 'Admin Panel';
  const linksDiv = footerBottom.querySelector('.footer-bottom-links');
  if (linksDiv) linksDiv.appendChild(link);
}


document.addEventListener('DOMContentLoaded', () => {
  syncNews();
  syncEvents();
  syncResearch();
  syncAwards();
  syncAlert();
  injectAdminLink();
});




let currentStep = 1;
const TOTAL_STEPS = 4;


const _origOpenModal = window.openModal;
document.addEventListener('click', e => {
  if (e.target.closest('[onclick*="applyModal"]')) {
    setTimeout(() => resetApplyForm(), 50);
  }
});

function resetApplyForm() {
  currentStep = 1;
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const s = document.getElementById('mstep-' + i);
    if (s) s.style.display = i === 1 ? 'block' : 'none';
    const lbl = document.getElementById('msl-' + i);
    if (lbl) { lbl.classList.remove('active', 'done'); if (i === 1) lbl.classList.add('active'); }
  }
  const fill = document.getElementById('mstepFill');
  if (fill) fill.style.width = '25%';
}

function mstepNext(from) {
  
  const step = document.getElementById('mstep-' + from);
  const required = step.querySelectorAll('[required]');
  for (const el of required) {
    if (!el.value.trim()) {
      el.focus();
      el.style.borderColor = '#D32F2F';
      el.addEventListener('input', () => el.style.borderColor = '', { once: true });
      showToast('⚠️ Please fill in all required fields.');
      return;
    }
  }

  
  const lbl = document.getElementById('msl-' + from);
  if (lbl) { lbl.classList.remove('active'); lbl.classList.add('done'); }

  currentStep = from + 1;
  step.style.display = 'none';

  const nextStep = document.getElementById('mstep-' + currentStep);
  if (nextStep) nextStep.style.display = 'block';

  const nextLbl = document.getElementById('msl-' + currentStep);
  if (nextLbl) nextLbl.classList.add('active');

  const fill = document.getElementById('mstepFill');
  if (fill) fill.style.width = (currentStep / TOTAL_STEPS * 100) + '%';

  if (currentStep === 4) buildAppSummary();

  
  const modal = document.querySelector('#applyModal .modal');
  if (modal) modal.scrollTop = 0;
}

function mstepPrev(from) {
  const step = document.getElementById('mstep-' + from);
  const lbl = document.getElementById('msl-' + from);
  if (lbl) lbl.classList.remove('active');
  step.style.display = 'none';

  currentStep = from - 1;
  const prevStep = document.getElementById('mstep-' + currentStep);
  if (prevStep) prevStep.style.display = 'block';

  const prevLbl = document.getElementById('msl-' + currentStep);
  if (prevLbl) { prevLbl.classList.remove('done'); prevLbl.classList.add('active'); }

  const fill = document.getElementById('mstepFill');
  if (fill) fill.style.width = (currentStep / TOTAL_STEPS * 100) + '%';
}

function buildAppSummary() {
  const g = id => (document.getElementById(id) || {}).value || '—';
  const summary = document.getElementById('appSummary');
  if (!summary) return;
  summary.innerHTML = [
    ['Full Name', `${g('app-fname')} ${g('app-mname')} ${g('app-lname')}`],
    ['Date of Birth', g('app-dob')],
    ['Sex', g('app-sex')],
    ['Address', g('app-addr')],
    ['School', g('app-school')],
    ['Grade Level', g('app-grade')],
    ['GWA', g('app-gwa')],
    ['Track', g('app-track')],
    ['Parent/Guardian', g('app-parent')],
    ['Email', g('app-email')],
    ['Mobile', g('app-phone')],
  ].map(([label, val]) => `
    <div class="sum-item">
      <span>${label}</span>
      <strong>${val}</strong>
    </div>`).join('');
}

function submitApplicationFull() {
  const agree = document.getElementById('app-agree');
  if (!agree || !agree.checked) {
    showToast('⚠️ Please agree to the Terms & Conditions.');
    return;
  }

  
  const apps = JSON.parse(localStorage.getItem('pcshs_applications') || '[]');
  const g = id => (document.getElementById(id) || {}).value || '';
  apps.push({
    id: 'app_' + Date.now(),
    name: `${g('app-fname')} ${g('app-mname')} ${g('app-lname')}`.trim(),
    school: g('app-school'),
    gwa: g('app-gwa'),
    track: g('app-track'),
    email: g('app-email'),
    submitted: new Date().toLocaleString()
  });
  localStorage.setItem('pcshs_applications', JSON.stringify(apps));

  closeModal('applyModal');
  showToast('🎉 Application submitted! Check your email for confirmation.');
  resetApplyForm();
}


function openFacultyModal(id) {
  const modal = document.getElementById('facultyModal-' + id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeFacultyModal(id) {
  const modal = document.getElementById('facultyModal-' + id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}


const STATIC_RESEARCH = {
  r_static_1: {
    title: 'Antimicrobial Properties of Local Philippine Plants',
    topic: 'Biology',
    grade: 'Grade 10 – Biology',
    award: '🥇 Regional 1st Place, DepEd NCR Science Congress',
    img: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&q=80',
    abstract: 'This study investigates the antimicrobial properties of five native Philippine plant species — <em>Psidium guajava</em> (guava), <em>Momordica charantia</em> (ampalaya), <em>Allium sativum</em> (garlic), <em>Curcuma longa</em> (turmeric), and <em>Lagerstroemia speciosa</em> (bangon). Methanolic extracts were tested against <em>Escherichia coli</em> and <em>Staphylococcus aureus</em> using agar disk diffusion assays.',
    findings: 'Garlic and turmeric extracts exhibited the highest zones of inhibition against both bacterial strains, with garlic achieving a 22mm inhibition zone against E. coli. Guava leaf extracts showed significant activity against S. aureus with a minimum inhibitory concentration (MIC) of 0.5 mg/mL.',
    researchers: 'Team Lakas Hamon — Mikaela Santos, Renz Dela Cruz, Alyssa Chan',
  },
  r_static_2: {
    title: 'Low-Cost Solar Tracker Using Arduino Microcontrollers',
    topic: 'Physics',
    grade: 'Grade 9 – Physics',
    award: '🥈 National Finalist, Young Innovators Program 2024',
    img: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&q=80',
    abstract: 'This project presents the design, construction, and evaluation of a dual-axis solar tracking system powered by an Arduino Uno microcontroller and light-dependent resistor (LDR) sensors. The tracker continuously orients a photovoltaic panel toward the sun, maximizing energy conversion throughout the day.',
    findings: 'The solar tracker improved energy generation by an average of 34.7% compared to a fixed-angle panel in field tests over 14 days. Material costs totaled ₱1,850, demonstrating economic viability for rural off-grid applications in the Philippines.',
    researchers: 'Team Araw — Miguel Reyes, Jasmine Torres, Paolo Garcia',
  },
  r_static_3: {
    title: 'AI-Powered Early Flood Warning System for Pasig River',
    topic: 'ICT',
    grade: 'Grade 11 – ICT',
    award: '🌍 Intel ISEF Qualifier 2025 — Environmental Engineering',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    abstract: 'This research proposes a machine learning-based flood prediction system for the Pasig River watershed using a Gradient Boosted Trees model trained on 10 years of PAGASA rainfall data, river water level sensors, and real-time weather API feeds. The model is deployed as a Telegram bot and web dashboard.',
    findings: 'The model achieved 91.4% accuracy in predicting flood events 4–6 hours in advance with a precision of 88.2%. In simulated disaster scenarios, the system provided 4.3 hours of advance warning versus the traditional 1.5-hour baseline, potentially enabling earlier evacuations for riverside communities.',
    researchers: 'Team Likas — Andrea Lim, Joshua Aguilar, Maria Kristina Uy',
  }
};

function openResearchDetail(id, e) {
  if (e) e.stopPropagation();

  
  let r = STATIC_RESEARCH[id];
  if (!r) {
    const items = JSON.parse(localStorage.getItem('pcshs_research') || '[]');
    const stored = items.find(x => x.id === id);
    if (stored) {
      r = {
        title: stored.title, topic: stored.topic, grade: stored.grade,
        award: stored.award, img: stored.img,
        abstract: stored.desc,
        findings: 'No additional details available.',
        researchers: stored.grade,
      };
    }
  }
  if (!r) return;

  let modal = document.getElementById('researchDetailModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'researchDetailModal';
    modal.className = 'modal-overlay';
    modal.onclick = ev => { if (ev.target === modal) { modal.classList.remove('active'); document.body.style.overflow = ''; } };
    document.body.appendChild(modal);
  }

  const topicColors = { Biology: '#2E7D32', Physics: '#0038A8', ICT: '#6C3FC5', Chemistry: '#D32F2F', default: '#0097A7' };
  const color = topicColors[r.topic] || topicColors.default;

  modal.innerHTML = `
    <div class="modal research-detail-modal" onclick="event.stopPropagation()">
      <button class="modal-close" onclick="document.getElementById('researchDetailModal').classList.remove('active');document.body.style.overflow=''"><i class="fas fa-times"></i></button>
      <div class="rdm-img" style="background-image:url('${r.img || ''}')">
        <span class="research-topic" style="background:${color}">${r.topic}</span>
      </div>
      <div class="rdm-body">
        <h2>${r.title}</h2>
        <div class="rdm-meta">
          <span><i class="fas fa-user" style="color:${color}"></i> ${r.grade}</span>
          ${r.award ? `<span><i class="fas fa-trophy" style="color:#A67C00"></i> ${r.award}</span>` : ''}
        </div>
        <div class="rdm-section">
          <h4><i class="fas fa-scroll" style="color:${color}"></i> Abstract</h4>
          <p>${r.abstract}</p>
        </div>
        <div class="rdm-section">
          <h4><i class="fas fa-lightbulb" style="color:${color}"></i> Key Findings</h4>
          <p>${r.findings}</p>
        </div>
        ${r.researchers ? `<div class="rdm-section"><h4><i class="fas fa-users" style="color:${color}"></i> Research Team</h4><p>${r.researchers}</p></div>` : ''}
      </div>
    </div>`;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}
