const track = document.querySelector('#project-track');
let dots;
let activeProject = 0;
document.querySelector('.hero .eyebrow').textContent = 'BSIT STUDENT · MY DEVELOPER PORTFOLIO';
document.querySelector('.hero h1').innerHTML = 'From ideas to interfaces.<br/><em>Built to be used.</em>';
document.querySelector('.hero h1 + p').textContent = 'I’m Rancy Guevarra, a BSIT student at NU Clark building responsive, user-centered web experiences that make everyday tasks easier to understand and act on.';
document.querySelector('.available').innerHTML = '<i></i> Open to internship and entry-level web development opportunities';
document.querySelector('.contact h2').textContent = 'Let’s build something useful.';
document.querySelector('.contact h2 + p').textContent = 'I’m open to internship and entry-level web development opportunities. Reach out directly, or explore my work on GitHub and LinkedIn.';
const brand = document.querySelector('.brand');
brand.textContent = 'Rancy';
brand.setAttribute('aria-label', 'Rancy Guevarra — home');
const linkedInUrl = 'https://www.linkedin.com/in/rancy-guevarra-51681538a';
const campusPreview = document.querySelector('.campus-ui');
if (campusPreview) {
  campusPreview.outerHTML = '<figure class="project-screenshot campus-screenshot"><img src="campus-companion-dashboard.png" alt="Campus Companion dashboard showing schedules, deadlines, tasks, and a study goal"/><figcaption>A student dashboard for planning the week in one place.</figcaption></figure>';
}

const campusDemoLink = document.querySelector('.campus .project-button');
if (campusDemoLink) {
  campusDemoLink.href = 'campus-companion.html';
  campusDemoLink.textContent = 'Open live demo ↗';
}
const arcadiaSlide = document.createElement('article');
arcadiaSlide.className = 'slide arcadia';
arcadiaSlide.innerHTML = `<div class="project-info"><span class="number">03</span><p class="type">BROWSER GAME HUB</p><h3>Arcadia</h3><p class="summary">An original browser arcade with eight quick-play games, responsive controls, local high scores, and purpose-built canvas gameplay.</p><div class="chips"><span>JavaScript</span><span>Canvas</span><span>Responsive UI</span></div><div class="project-links"><a class="project-button" href="arcadia/index.html">Open live demo ↗</a><a class="project-button secondary-link" href="https://github.com/rancyguevarra9/rancyguevarra9.github.io/tree/main/arcadia" target="_blank" rel="noreferrer">View source code ↗</a></div></div><figure class="project-screenshot arcadia-screenshot"><img src="arcadia-game-library.png" alt="Arcadia game library showing eight original browser mini-games"/><figcaption>Eight quick-play browser games in one arcade library.</figcaption></figure>`;
track.append(arcadiaSlide);
const arcadiaDot = document.createElement('button');
arcadiaDot.setAttribute('aria-label', 'Show Arcadia');
document.querySelector('#dots').append(arcadiaDot);
const projectFeatures = [
  ['Save selected text with its source', 'Keep titles, links, and dates together', 'Copy organized citation details'],
  ['Plan classes, tasks, and deadlines', 'Track focus sessions and weekly goals', 'Keep progress saved in the browser'],
  ['Choose from eight original mini-games', 'Play with keyboard or touch controls', 'Track local scores and game progress']
];
[...document.querySelectorAll('.slide')].forEach((slide, index) => {
  const info = slide.querySelector('.project-info');
  const anchor = info.querySelector('.project-links') || info.querySelector('.project-button');
  if (!info || !anchor || !projectFeatures[index]) return;
  const summary = info.querySelector('.summary');
  const chips = info.querySelector('.chips');
  if (summary && !summary.querySelector('.project-detail-label')) {
    summary.insertAdjacentHTML('afterbegin', '<span class="project-detail-label">PROBLEM IT SOLVES</span>');
  }
  if (chips && !info.querySelector('.technical-proof-label')) {
    chips.insertAdjacentHTML('beforebegin', '<p class="technical-proof-label">TECHNICAL PROOF</p>');
  }
  const toggle = document.createElement('button');
  const panel = document.createElement('div');
  const panelId = `project-features-${index + 1}`;
  toggle.className = 'feature-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', panelId);
  toggle.innerHTML = 'View key features <span aria-hidden="true">+</span>';
  panel.className = 'feature-panel';
  panel.id = panelId;
  panel.innerHTML = `<p>KEY FEATURES</p><ul>${projectFeatures[index].map(feature => `<li>${feature}</li>`).join('')}</ul>`;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.querySelector('span').textContent = open ? '+' : '−';
    panel.classList.toggle('is-open', !open);
    requestAnimationFrame(matchMobileProjectCardHeights);
    });
  anchor.before(toggle, panel);
});
dots = [...document.querySelectorAll('#dots button')];
const sliderControls = document.querySelector('.slider-controls');
if (sliderControls && track) {
  track.closest('.slider').append(sliderControls);
  sliderControls.id = 'project-navigation';
  sliderControls.style.cssText = 'display:flex;justify-content:center;align-items:center;gap:14px;margin:0;padding:18px 0 20px;border-top:1px solid #563269;position:relative;z-index:2';
}
const projectNavigationLinks = [...document.querySelectorAll('.hero .button[href="#work"], [data-project-navigation]')];
const revealProjectNavigation = () => {
  if (!sliderControls) return;
  const controlsBottom = sliderControls.getBoundingClientRect().bottom + window.scrollY;
  const target = Math.max(0, controlsBottom - window.innerHeight + 28);
  window.scrollTo({ top: target, behavior: 'smooth' });
};
projectNavigationLinks.forEach(link => {
  link.href = '#project-navigation';
  link.addEventListener('click', event => {
    event.preventDefault();
    revealProjectNavigation();
  });
});
const returnToProjects = new URLSearchParams(window.location.search).get('return') === 'projects';
if (projectNavigationLinks.length && (window.location.hash === '#project-navigation' || returnToProjects)) {
  window.addEventListener('load', () => setTimeout(revealProjectNavigation, returnToProjects ? 180 : 300), { once: true });
}
const arcadiaStyles = document.createElement('style');
arcadiaStyles.textContent = `.arcadia{background:linear-gradient(135deg,#10234b,#251449)}.arcadia-ui{display:grid;gap:10px;padding:18px;border:1px solid #657fd6;border-radius:16px;background:#101b3d;box-shadow:0 0 34px #4a7fff45;color:#f4f7ff}.arcadia-ui header{display:flex;align-items:center;gap:8px}.arcadia-ui header span{display:grid;place-items:center;width:27px;height:27px;border-radius:8px;background:#5d86ff}.arcadia-ui header i{margin-left:auto;color:#b6caff;font-size:10px;font-style:normal}.arcade-road{display:grid;gap:5px;padding:16px;border-radius:11px;background:linear-gradient(135deg,#2552a1,#22356d)}.arcade-road small{color:#cae0ff;font-size:10px}.arcade-road em{color:#80eeff;font:800 10px 'DM Mono';font-style:normal}.arcade-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.arcade-grid span{padding:11px;border-radius:9px;background:#202d61;color:#d9e5ff;font-size:10px;font-weight:800}.arcadia-ui footer{color:#b7c9f5;font-size:10px}body.dark .arcadia{background:linear-gradient(135deg,#e9f1ff,#f6ecfb)}body.dark .arcadia-ui{background:#111d43;color:#f4f7ff}`;
document.head.append(arcadiaStyles);
const skills = document.createElement('section');
skills.className = 'skills-showcase';
skills.setAttribute('aria-label', 'Core skills and tools');
skills.innerHTML = `<div class="skills-copy"><p class="eyebrow">CORE SKILLS</p><h3>Built with a practical web development toolkit.</h3><p>Every project combines clear interface design with responsive, functional browser technology.</p></div><div class="skills-grid"><article><b>01</b><strong>HTML & CSS</strong><span>Structured, polished interfaces</span></article><article><b>02</b><strong>JavaScript</strong><span>Interactive product behavior</span></article><article><b>03</b><strong>Responsive UI</strong><span>Desktop and mobile layouts</span></article><article><b>04</b><strong>UX design</strong><span>Clear, user-focused flows</span></article><article><b>05</b><strong>Local storage</strong><span>Useful saved browser state</span></article><article><b>06</b><strong>Canvas & APIs</strong><span>Games and Chrome extensions</span></article></div>`;
document.querySelector('.principles').before(skills);
const linkedInNav = document.createElement('a');
linkedInNav.href = linkedInUrl; linkedInNav.target = '_blank'; linkedInNav.rel = 'noreferrer'; linkedInNav.textContent = 'LinkedIn ↗';
document.querySelector('.nav nav').append(linkedInNav);
const linkedInContact = document.createElement('a');
linkedInContact.href = linkedInUrl; linkedInContact.target = '_blank'; linkedInContact.rel = 'noreferrer'; linkedInContact.className = 'plain'; linkedInContact.textContent = 'Connect on LinkedIn ↗';
document.querySelector('.contact .button').after(linkedInContact);
const contactDetails = document.createElement('div');
contactDetails.className = 'contact-details';
contactDetails.innerHTML = '<span class="contact-label">REACH ME DIRECTLY</span><div class="contact-actions"><a href="tel:+639620627126" aria-label="Call Rancy Guevarra"><span class="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.37 2.3.57 3.5.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.57 21 3 13.43 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.57 3.5a1 1 0 0 1-.24 1z"/></svg></span> 0962 062 7126</a><a href="mailto:rancyguevarra9@gmail.com" aria-label="Email Rancy Guevarra"><span class="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3.5 6.5A2.5 2.5 0 0 1 6 4h12a2.5 2.5 0 0 1 2.5 2.5v11A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5zm1.8-.5L12 11l6.7-5z"/></svg></span> rancyguevarra9@gmail.com</a></div>';
document.querySelector('.contact h2 + p').after(contactDetails);
const contactStyles = document.createElement('style');
contactStyles.textContent = '.contact-details{display:grid;gap:9px;max-width:510px;margin:22px 0 27px}.contact-label{color:#d7a0f3;font:10px "DM Mono";letter-spacing:.13em}.contact-actions{display:flex;flex-wrap:wrap;gap:9px}.contact-details a{display:inline-flex;align-items:center;gap:8px;padding:9px 11px;border:1px solid #5e3b73;border-radius:9px;background:transparent;color:#f8edff;font-size:12px;font-weight:800;text-decoration:none}.contact-details a:hover{border-color:#ff8bd5;background:#21102f;transform:translateY(-2px)}.contact-icon{display:grid;place-items:center;width:16px;height:16px;color:#ff8bd5}.contact-icon svg{width:15px;height:15px;fill:currentColor}body.dark .contact-details a{border-color:#dfcce9;background:#fff;color:#241331}';
document.head.append(contactStyles);
const themeButton = document.createElement('button');
themeButton.className = 'theme-button'; themeButton.type = 'button'; themeButton.setAttribute('aria-label', 'Toggle color theme');
document.querySelector('.nav nav').append(themeButton);
function updateTheme() { const dark = document.body.classList.contains('dark'); themeButton.textContent = dark ? '☀' : '◐'; localStorage.setItem('rancy-portfolio-theme', dark ? 'dark' : 'light'); }
document.body.classList.toggle('dark', localStorage.getItem('rancy-portfolio-theme') === 'dark'); updateTheme();
themeButton.onclick = () => { document.body.classList.toggle('dark'); updateTheme(); };
const mobileProjectSlides = [...document.querySelectorAll('.slide')];
function matchMobileProjectCardHeights() {
  if (!window.matchMedia('(max-width: 700px)').matches) {
    mobileProjectSlides.forEach(slide => { slide.style.minHeight = ''; });
    return;
  }
  mobileProjectSlides.forEach(slide => { slide.style.minHeight = '0'; });
  const tallest = Math.max(...mobileProjectSlides.map(slide => slide.scrollHeight));
  mobileProjectSlides.forEach(slide => { slide.style.minHeight = tallest + 'px'; });
}
function showProject(index) {
  activeProject = (index + dots.length) % dots.length;
  track.style.transform = `translateX(-${activeProject * 100}%)`;
  dots.forEach((dot, position) => dot.classList.toggle('active', position === activeProject));
  requestAnimationFrame(syncMobileProjectHeight);
}
document.querySelector('#previous').onclick = () => showProject(activeProject - 1);
document.querySelector('#next').onclick = () => showProject(activeProject + 1);
dots.forEach((dot, index) => dot.onclick = () => showProject(index));
document.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') showProject(activeProject - 1); if (event.key === 'ArrowRight') showProject(activeProject + 1); });
let startX = 0;
track.addEventListener('pointerdown', event => { startX = event.clientX; });
track.addEventListener('pointerup', event => { const change = event.clientX - startX; if (Math.abs(change) > 45) showProject(activeProject + (change < 0 ? 1 : -1)); });
window.addEventListener('resize', matchMobileProjectCardHeights);
window.addEventListener('load', () => setTimeout(matchMobileProjectCardHeights, 80), { once: true });
mobileProjectSlides.forEach(slide => slide.querySelectorAll('img').forEach(image => image.addEventListener('load', matchMobileProjectCardHeights)));
matchMobileProjectCardHeights();

