const track = document.querySelector('#project-track');
let dots;
let activeProject = 0;
document.querySelector('.hero .eyebrow').textContent = 'FRONTEND DEVELOPER · PORTFOLIO';
document.querySelector('.available').innerHTML = '<i></i> Open to internship and entry-level opportunities';
document.querySelector('.contact h2').textContent = 'Looking for a developer who cares about the details?';
const brand = document.querySelector('.brand');
brand.innerHTML = 'Rancy <span>Guevarra</span>';
brand.setAttribute('aria-label', 'Rancy Guevarra — home');
const linkedInUrl = 'https://www.linkedin.com/in/rancy-guevarra-51681538a';
const campusDemoLink = document.querySelector('.campus .project-button');
if (campusDemoLink) {
  campusDemoLink.href = 'campus-companion.html';
  campusDemoLink.textContent = 'Open live demo ↗';
}
const arcadiaSlide = document.createElement('article');
arcadiaSlide.className = 'slide arcadia';
arcadiaSlide.innerHTML = `<div class="project-info"><span class="number">03</span><p class="type">BROWSER GAME HUB</p><h3>Arcadia</h3><p class="summary">An original browser arcade with eight quick-play games, responsive controls, local high scores, and purpose-built canvas gameplay.</p><div class="chips"><span>JavaScript</span><span>Canvas</span><span>Responsive UI</span></div><div class="project-links"><a class="project-button" href="arcadia/index.html">Open live demo ↗</a><a class="project-button secondary-link" href="https://github.com/rancyguevarra9/rancyguevarra9.github.io/tree/main/arcadia" target="_blank" rel="noreferrer">View source code ↗</a></div></div><div class="arcadia-ui"><header><span>✦</span><b>ARCADIA</b><i>8 GAMES</i></header><div class="arcade-road"><b>Ridge Runner</b><small>Fuel · hills · high score</small><em>PLAY →</em></div><div class="arcade-grid"><span>Shade Duel</span><span>Maze Shift</span><span>Neon Lane</span><span>+ 4 more</span></div><footer>Original browser mini games.</footer></div>`;
track.append(arcadiaSlide);
const arcadiaDot = document.createElement('button');
arcadiaDot.setAttribute('aria-label', 'Show Arcadia');
document.querySelector('#dots').append(arcadiaDot);
dots = [...document.querySelectorAll('#dots button')];
const sliderControls = document.querySelector('.slider-controls');
if (sliderControls && track) {
  track.closest('.slider').append(sliderControls);
  sliderControls.id = 'project-navigation';
  sliderControls.style.cssText = 'display:flex;justify-content:center;align-items:center;gap:14px;margin:0;padding:18px 0 20px;border-top:1px solid #563269;position:relative;z-index:2';
}
const exploreWorkButton = document.querySelector('.hero .button[href="#work"]');
if (exploreWorkButton) {
  exploreWorkButton.href = '#project-navigation';
  exploreWorkButton.addEventListener('click', event => {
    event.preventDefault();
    if (!sliderControls) return;
    const controlsBottom = sliderControls.getBoundingClientRect().bottom + window.scrollY;
    const target = Math.max(0, controlsBottom - window.innerHeight + 28);
    window.scrollTo({ top: target, behavior: 'auto' });
  });
}
const arcadiaStyles = document.createElement('style');
arcadiaStyles.textContent = `.arcadia{background:linear-gradient(135deg,#10234b,#251449)}.arcadia-ui{display:grid;gap:10px;padding:18px;border:1px solid #657fd6;border-radius:16px;background:#101b3d;box-shadow:0 0 34px #4a7fff45;color:#f4f7ff}.arcadia-ui header{display:flex;align-items:center;gap:8px}.arcadia-ui header span{display:grid;place-items:center;width:27px;height:27px;border-radius:8px;background:#5d86ff}.arcadia-ui header i{margin-left:auto;color:#b6caff;font-size:10px;font-style:normal}.arcade-road{display:grid;gap:5px;padding:16px;border-radius:11px;background:linear-gradient(135deg,#2552a1,#22356d)}.arcade-road small{color:#cae0ff;font-size:10px}.arcade-road em{color:#80eeff;font:800 10px 'DM Mono';font-style:normal}.arcade-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.arcade-grid span{padding:11px;border-radius:9px;background:#202d61;color:#d9e5ff;font-size:10px;font-weight:800}.arcadia-ui footer{color:#b7c9f5;font-size:10px}body.dark .arcadia{background:linear-gradient(135deg,#e9f1ff,#f6ecfb)}body.dark .arcadia-ui{background:#111d43;color:#f4f7ff}`;
document.head.append(arcadiaStyles);
const skills = document.createElement('section');
skills.className = 'skills-showcase';
skills.setAttribute('aria-label', 'Core skills and tools');
skills.innerHTML = `<div class="skills-copy"><p class="eyebrow">CORE SKILLS</p><h3>Built with a practical frontend toolkit.</h3><p>Every project combines clear interface design with responsive, functional browser technology.</p></div><div class="skills-grid"><article><b>01</b><strong>HTML & CSS</strong><span>Structured, polished interfaces</span></article><article><b>02</b><strong>JavaScript</strong><span>Interactive product behavior</span></article><article><b>03</b><strong>Responsive UI</strong><span>Desktop and mobile layouts</span></article><article><b>04</b><strong>UX design</strong><span>Clear, user-focused flows</span></article><article><b>05</b><strong>Local storage</strong><span>Useful saved browser state</span></article><article><b>06</b><strong>Canvas & APIs</strong><span>Games and Chrome extensions</span></article></div>`;
document.querySelector('.principles').before(skills);
const linkedInNav = document.createElement('a');
linkedInNav.href = linkedInUrl; linkedInNav.target = '_blank'; linkedInNav.rel = 'noreferrer'; linkedInNav.textContent = 'LinkedIn ↗';
document.querySelector('.nav nav').append(linkedInNav);
const linkedInContact = document.createElement('a');
linkedInContact.href = linkedInUrl; linkedInContact.target = '_blank'; linkedInContact.rel = 'noreferrer'; linkedInContact.className = 'plain'; linkedInContact.textContent = 'Connect on LinkedIn ↗';
document.querySelector('.contact .button').after(linkedInContact);
const contactDetails = document.createElement('div');
contactDetails.className = 'contact-details';
contactDetails.innerHTML = '<span class="contact-label">DIRECT CONTACT</span><div class="contact-actions"><a href="tel:+639620627126" aria-label="Call Rancy Guevarra"><span class="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.37 2.3.57 3.5.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.57 21 3 13.43 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.57 3.5a1 1 0 0 1-.24 1z"/></svg></span> 0962 062 7126</a><a href="mailto:rancyguevarra9@gmail.com" aria-label="Email Rancy Guevarra"><span class="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3.5 6.5A2.5 2.5 0 0 1 6 4h12a2.5 2.5 0 0 1 2.5 2.5v11A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5zm1.8-.5L12 11l6.7-5z"/></svg></span> rancyguevarra9@gmail.com</a></div>';
document.querySelector('.contact h2 + p').after(contactDetails);
const contactStyles = document.createElement('style');
contactStyles.textContent = '.contact-details{display:grid;gap:11px;max-width:510px;margin:22px 0 27px;padding:16px;border:1px solid #5e3b73;border-radius:13px;background:#1c0d2a}.contact-label{color:#ff8bd5;font:10px "DM Mono";letter-spacing:.13em}.contact-actions{display:flex;flex-wrap:wrap;gap:9px}.contact-details a{display:inline-flex;align-items:center;gap:8px;padding:10px 12px;border:1px solid #5e3b73;border-radius:9px;background:#21102f;color:#f8edff;font-size:12px;font-weight:800;text-decoration:none}.contact-details a:hover{border-color:#ff8bd5;transform:translateY(-2px)}.contact-icon{display:grid;place-items:center;width:16px;height:16px;color:#ff8bd5}.contact-icon svg{width:15px;height:15px;fill:currentColor}body.dark .contact-details{border-color:#dfcce9;background:#f8f4fb}body.dark .contact-details a{border-color:#dfcce9;background:#fff;color:#241331}';
document.head.append(contactStyles);
const themeButton = document.createElement('button');
themeButton.className = 'theme-button'; themeButton.type = 'button'; themeButton.setAttribute('aria-label', 'Toggle color theme');
document.querySelector('.nav nav').append(themeButton);
function updateTheme() { const dark = document.body.classList.contains('dark'); themeButton.textContent = dark ? '☀' : '◐'; localStorage.setItem('rancy-portfolio-theme', dark ? 'dark' : 'light'); }
document.body.classList.toggle('dark', localStorage.getItem('rancy-portfolio-theme') === 'dark'); updateTheme();
themeButton.onclick = () => { document.body.classList.toggle('dark'); updateTheme(); };
function showProject(index) {
  activeProject = (index + dots.length) % dots.length;
  track.style.transform = `translateX(-${activeProject * 100}%)`;
  dots.forEach((dot, position) => dot.classList.toggle('active', position === activeProject));
}
document.querySelector('#previous').onclick = () => showProject(activeProject - 1);
document.querySelector('#next').onclick = () => showProject(activeProject + 1);
dots.forEach((dot, index) => dot.onclick = () => showProject(index));
document.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') showProject(activeProject - 1); if (event.key === 'ArrowRight') showProject(activeProject + 1); });
let startX = 0;
track.addEventListener('pointerdown', event => { startX = event.clientX; });
track.addEventListener('pointerup', event => { const change = event.clientX - startX; if (Math.abs(change) > 45) showProject(activeProject + (change < 0 ? 1 : -1)); });

