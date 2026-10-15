const track = document.querySelector('#project-track');
const dots = [...document.querySelectorAll('#dots button')];
let activeProject = 0;
document.querySelector('.hero .eyebrow').textContent = 'FRONTEND DEVELOPER · PORTFOLIO';
document.querySelector('.available').innerHTML = '<i></i> Open to internship and entry-level opportunities';
document.querySelector('.contact h2').textContent = 'Looking for a developer who cares about the details?';
const linkedInUrl = 'https://www.linkedin.com/in/rancy-guevarra-51681538a';
const campusDemoLink = document.querySelector('.campus .project-button');
if (campusDemoLink) campusDemoLink.href = 'https://rancy-guevarra-portfolio.upbeatbread2.chatgpt.site/campus-companion/index.html';
const linkedInNav = document.createElement('a');
linkedInNav.href = linkedInUrl; linkedInNav.target = '_blank'; linkedInNav.rel = 'noreferrer'; linkedInNav.textContent = 'LinkedIn ↗';
document.querySelector('.nav nav').append(linkedInNav);
const linkedInContact = document.createElement('a');
linkedInContact.href = linkedInUrl; linkedInContact.target = '_blank'; linkedInContact.rel = 'noreferrer'; linkedInContact.className = 'plain'; linkedInContact.textContent = 'Connect on LinkedIn ↗';
document.querySelector('.contact .button').after(linkedInContact);
const themeButton = document.createElement('button');
themeButton.className = 'theme-button'; themeButton.type = 'button'; themeButton.setAttribute('aria-label', 'Toggle color theme');
document.querySelector('.nav nav').append(themeButton);
function updateTheme() { const dark = document.body.classList.contains('dark'); themeButton.textContent = dark ? '☀' : '◐'; localStorage.setItem('rancy-portfolio-theme', dark ? 'dark' : 'light'); }
document.body.classList.toggle('dark', localStorage.getItem('rancy-portfolio-theme') === 'dark'); updateTheme();
themeButton.onclick = () => { document.body.classList.toggle('dark'); updateTheme(); };
function showProject(index) {
  activeProject = (index + 2) % 2;
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
