/* HIMGAE — Vanilla JS interactions */

// Responsive navigation: hamburger toggle
const body = document.body;
const toggleBtn = document.querySelector('.nav-toggle');
const nav = document.getElementById('primary-nav');

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const isOpen = body.classList.toggle('menu-open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    toggleBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close menu when a nav link is clicked (mobile)
  nav?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      body.classList.remove('menu-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// Carousel logic
const track = document.querySelector('.carousel-track');
const slides = Array.from(document.querySelectorAll('.slide'));
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const dots = Array.from(document.querySelectorAll('.dot'));
let index = 0;
let autoplayId;

function updateCarousel(newIndex) {
  index = (newIndex + slides.length) % slides.length;
  const offset = -index * 100;
  track.style.transform = `translate3d(${offset}%, 0, 0)`;
  slides.forEach((s, i) => s.classList.toggle('current', i === index));
  dots.forEach((d, i) => d.classList.toggle('current', i === index));
}

function next() { updateCarousel(index + 1); }
function prev() { updateCarousel(index - 1); }

nextBtn?.addEventListener('click', () => { next(); restartAutoplay(); });
prevBtn?.addEventListener('click', () => { prev(); restartAutoplay(); });
dots.forEach((d, i) => d.addEventListener('click', () => { updateCarousel(i); restartAutoplay(); }));

function startAutoplay() {
  stopAutoplay();
  autoplayId = setInterval(next, 6000);
}
function stopAutoplay() { if (autoplayId) clearInterval(autoplayId); }
function restartAutoplay() { startAutoplay(); }
startAutoplay();

// Pause autoplay on hover/focus (desktop)
const carousel = document.querySelector('.carousel');
carousel?.addEventListener('mouseenter', stopAutoplay);
carousel?.addEventListener('mouseleave', startAutoplay);
carousel?.addEventListener('focusin', stopAutoplay);
carousel?.addEventListener('focusout', startAutoplay);

// IntersectionObserver for reveal animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// Smooth scroll for internal nav links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href')?.slice(1);
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Back to top button behavior
const backBtn = document.getElementById('backToTop');
if (backBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) backBtn.classList.add('show');
    else backBtn.classList.remove('show');
  });
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}