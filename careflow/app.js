const seed = [
  { id: 10, name: 'Mika Santos', service: 'Dental checkup', time: '9:00 AM', status: 'done', type: 'Appointment' },
  { id: 11, name: 'Jordan Lee', service: 'Teeth cleaning', time: '9:30 AM', status: 'done', type: 'Appointment' },
  { id: 12, name: 'Sam Rivera', service: 'Dental checkup', time: '10:00 AM', status: 'waiting', type: 'Appointment' },
  { id: 13, name: 'Jamie Cruz', service: 'Tooth pain consultation', time: '10:15 AM', status: 'waiting', type: 'Appointment' },
  { id: 14, name: 'Avery Lim', service: 'Follow-up visit', time: '10:30 AM', status: 'serving', type: 'Appointment' }
];
const queueKey = 'careflow-dental-queue-v1';
const bookingKey = 'careflow-dental-booking-v1';
const storedQueue = JSON.parse(localStorage.getItem(queueKey) || 'null');
let queue = (storedQueue || seed).filter(item => item.type === 'Appointment').map(item => ({ ...item, type: 'Appointment' }));
let activeFilter = 'all';
const $ = s => document.querySelector(s);
const escapeHtml = value => String(value).replace(/[&<>\"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
const toast = message => { const t = $('#toast'); t.textContent = message; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2800); };
function save(){ localStorage.setItem(queueKey, JSON.stringify(queue)); }
function showTicket(item, dateLabel, wait){
  $('#patient-empty').hidden = true; $('#patient-ticket').hidden = false;
  $('#ticket-name').textContent = item.name; $('#ticket-service').textContent = item.service;
  $('#ticket-number').textContent = `A-${item.id}`; $('#ticket-date').textContent = dateLabel;
  $('#ticket-wait').textContent = wait;
}
function renderQueue(){
  const visible = queue.filter(item => activeFilter === 'all' || item.status === activeFilter);
  $('#queue-list').innerHTML = visible.length ? visible.map(item => `<article class="queue-row"><span class="queue-no">A-${item.id}</span><div class="queue-person"><b>${escapeHtml(item.name)}</b><small>Confirmed appointment</small></div><span class="queue-service">${escapeHtml(item.service)} · ${escapeHtml(item.time)}</span><span class="status ${item.status}">${item.status}</span><div class="row-actions">${item.status === 'waiting' ? `<button data-action="serve" data-id="${item.id}">Start visit</button>` : ''}${item.status === 'serving' ? `<button data-action="done" data-id="${item.id}">Complete visit</button>` : ''}</div></article>`).join('') : '<div class="empty"><h3>No appointments in this view</h3><p>Choose another filter to see scheduled visits.</p></div>';
  ['waiting','serving','done'].forEach(status => $(`#${status}-count`).textContent = queue.filter(item => item.status === status).length);
}
document.querySelectorAll('[data-role]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('[data-role]').forEach(b => b.classList.toggle('active', b === button)); document.querySelectorAll('.view').forEach(view => view.classList.toggle('active', view.id === `${button.dataset.role}-view`)); }));
$('.brand').addEventListener('click', event => { event.preventDefault(); document.querySelector('[data-role="patient"]').click(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => { activeFilter = button.dataset.filter; document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b === button)); renderQueue(); }));
$('#queue-list').addEventListener('click', e => {
  const button = e.target.closest('[data-action]');
  if (!button) return;
  const item = queue.find(i => i.id === Number(button.dataset.id));
  if (!item) { renderQueue(); toast('That appointment is no longer in the queue.'); return; }
  item.status = button.dataset.action === 'serve' ? 'serving' : 'done';
  save();
  renderQueue();
  toast(button.dataset.action === 'serve' ? `${item.name}'s appointment has started.` : `${item.name}'s visit is complete.`);
});
$('#booking-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#patient-name').value.trim();
  const dateValue = $('#visit-date').value;
  if (!name) { $('#patient-name').focus(); toast('Enter your full name to confirm an appointment.'); return; }
  if (!dateValue) { $('#visit-date').focus(); toast('Choose an appointment date to continue.'); return; }
  const service = $('#service').value;
  const date = new Date(dateValue + 'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric'}); const time = $('#visit-time').value; const id = Math.max(...queue.map(i => i.id), 11) + 1; const item = {id,name,service,time,status:'waiting',type:'Appointment'}; const booking = {id,dateLabel:`${date} · ${time}`,wait:`${Math.max(12, queue.filter(i => i.status === 'waiting').length * 6)} min`}; queue.push(item); save(); localStorage.setItem(bookingKey, JSON.stringify(booking)); renderQueue(); showTicket(item, booking.dateLabel, booking.wait); toast('Appointment confirmed. Your queue number is ready.'); e.target.reset(); $('#visit-date').value = new Date().toISOString().split('T')[0]; });
$('#cancel-booking').addEventListener('click', () => { const booking = JSON.parse(localStorage.getItem(bookingKey) || 'null'); if(booking){ queue = queue.filter(item => item.id !== booking.id); save(); localStorage.removeItem(bookingKey); renderQueue(); } $('#patient-ticket').hidden = true; $('#patient-empty').hidden = false; toast('Appointment cancelled and removed from the queue.'); });
const themeButton = $('#theme-toggle');
const syncThemeButton = () => {
  const dark = document.body.classList.contains('dark');
  $('#theme-label').textContent = dark ? 'Light mode' : 'Dark mode';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
};
themeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('careflow-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  syncThemeButton();
});
$('#reset-demo').addEventListener('click', () => {
  queue = seed.map(item => ({ ...item }));
  activeFilter = 'all';
  document.querySelectorAll('.filter').forEach(button => button.classList.toggle('active', button.dataset.filter === 'all'));
  localStorage.removeItem(queueKey);
  localStorage.removeItem(bookingKey);
  save();
  renderQueue();
  $('#patient-ticket').hidden = true;
  $('#patient-empty').hidden = false;
  toast('Sample day restored — the original appointments are back.');
});
$('#visit-date').min = new Date().toISOString().split('T')[0]; $('#visit-date').value = new Date().toISOString().split('T')[0]; if(localStorage.getItem('careflow-theme') === 'dark') document.body.classList.add('dark'); syncThemeButton(); renderQueue(); const savedBooking = JSON.parse(localStorage.getItem(bookingKey) || 'null'); if(savedBooking){ const item = queue.find(entry => entry.id === savedBooking.id); if(item) showTicket(item, savedBooking.dateLabel, savedBooking.wait); }

