function toggleMenu(btn) {
  btn.classList.toggle('open');
  document.getElementById('mobile-menu').classList.toggle('open');
}
function closeMenu() {
  const b = document.querySelector('.hamburger');
  const m = document.getElementById('mobile-menu');
  if (b) b.classList.remove('open');
  if (m) m.classList.remove('open');
}
const scrollBtn = document.getElementById('scroll-top');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 300);
  });
}
(function() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
})();

// Hero page: solid header on scroll
if (document.body.classList.contains('hero-page')) {
  const heroSection = document.querySelector('.hero-fullscreen');
  const onScroll = () => {
    const threshold = heroSection ? heroSection.offsetHeight * 0.7 : 300;
    document.body.classList.toggle('scrolled', window.scrollY > threshold);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Nascondi scroll-chevron dopo scroll
(function() {
  var chevron = document.querySelector('.scroll-chevron');
  if (!chevron) return;
  window.addEventListener('scroll', function() {
    if (window.scrollY > 80) {
      chevron.classList.add('hidden');
    } else {
      chevron.classList.remove('hidden');
    }
  }, { passive: true });
})();
