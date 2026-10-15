const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const taskList = $('#task-list');
const eventList = $('#event-list');
const assignmentList = $('#assignment-list');
const notesList = $('#notes-list');
const studyList = $('#study-list');
const toast = $('#toast');
const storageKey = 'campus-companion-state-v2';
const editables = ['h1', 'h2', 'h3', '.muted', '.class-card b', '.class-card p', '.deadline b', '.deadline p', '.event b', '.event p', '.goal-copy h3', '.goal-copy p'];
let studyMinutes = 1080, goalMinutes = 1500, editing = false, archivedTasks = [], archivedEvents = [], archivedWork = [], archivedStudies = [], selectedScheduleDay = 'Tuesday';
let focusSeconds = 1500, focusInterval;

function showToast(message) { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2400); }
function taskActions() { return '<div class="task-actions"><button type="button" class="task-action done" title="Mark task as done">✓ Done</button><button type="button" class="task-action archive" title="Archive task">Archive</button><button type="button" class="task-action remove" title="Remove task" aria-label="Remove task">×</button></div>'; }
function eventActions() { return '<div class="event-actions"><button type="button" class="event-action done">✓ Done</button><button type="button" class="event-action archive">Archive</button><button type="button" class="event-action remove" aria-label="Remove event">×</button></div>'; }
function prepareTasks() {
  $$('.tasks li').forEach(task => {
    const checkbox = task.querySelector('input[type="checkbox"]');
    if (checkbox) { checkbox.title = 'Mark task as done'; checkbox.setAttribute('aria-label', 'Mark task as done'); }
    const actions = task.querySelector('.task-actions');
    if (actions) actions.outerHTML = taskActions(); else task.insertAdjacentHTML('beforeend', taskActions());
  });
}
function prepareEvents() { $$('#event-list .event').forEach(event => { const actions = event.querySelector('.event-actions'); if (actions) actions.outerHTML = eventActions(); else event.insertAdjacentHTML('beforeend', eventActions()); }); }
function updateArchiveCount() { $('#archived-tasks span').textContent = archivedTasks.length; }
function updateEventArchiveCount() { $('#archived-events span').textContent = archivedEvents.length; }
function updateTasks() { $('#task-total').textContent = $$('.tasks input:not(:checked)').length; updateNotifications(); saveState(); }
function updateDashboardStats() {
  const tuesday = $('.day-schedule[data-day="Tuesday"]');
  $('#classes-today').textContent = tuesday ? tuesday.querySelectorAll('.agenda-item').length : 0;
  $('#study-total').textContent = `${(studyMinutes / 60).toFixed(studyMinutes % 60 ? 1 : 0)}h`;
  $('#weekly-stat').textContent = `${Math.min(Math.round(studyMinutes / goalMinutes * 100), 100)}%`;
}
function updateNotifications() {
  const remainingTasks = $$('.tasks input:not(:checked)').length;
  const upcomingAssignments = $$('#assignment-list .assignment-card:not(.is-complete)').length;
  $('#notification-menu').innerHTML = `<b>Notifications</b><p>${remainingTasks ? `${remainingTasks} task${remainingTasks === 1 ? '' : 's'} still need attention.` : 'All focus-list tasks are complete.'}</p><p>${upcomingAssignments ? `${upcomingAssignments} assignment${upcomingAssignments === 1 ? '' : 's'} still need attention.` : 'No active assignments left.'}</p>`;
}
function updateGoal() {
  const percent = Math.min(Math.round(studyMinutes / goalMinutes * 100), 100);
  $('.progress-ring').style.background = `conic-gradient(#3976ec 0 ${percent}%,#e8edf5 ${percent}% 100%)`;
  $('#goal-percent').textContent = `${percent}%`;
  $('.progress-ring span').textContent = `${(studyMinutes / 60).toFixed(studyMinutes % 60 ? 1 : 0)} / ${goalMinutes / 60} hrs`;
  $('.goal-copy p').innerHTML = `You are <b>${Math.max(0, (goalMinutes - studyMinutes) / 60).toFixed(1).replace('.0', '')} hours</b> away from your weekly goal.`;
  $('#goal-hours').value = goalMinutes / 60; $('#completed-hours').value = (studyMinutes / 60).toFixed(1); saveState();
  updateDashboardStats(); updateNotifications();
}
function saveState() {
  localStorage.setItem(storageKey, JSON.stringify({
    texts: $$('[data-editable]').map(x => x.innerHTML), tasks: $$('.tasks li').map(x => x.outerHTML), archivedTasks, events: $$('#event-list .event').map(x => x.outerHTML), archivedEvents, assignments: $$('#assignment-list .assignment-card').map(x => x.outerHTML), notes: $$('#notes-list .note-card').map(x => x.outerHTML), studies: $$('#study-list .study-card').map(x => x.outerHTML), schedules: $$('.day-schedule').map(x => ({ day: x.dataset.day, html: x.innerHTML })), archivedWork, archivedStudies, studyMinutes, goalMinutes, dark: document.body.classList.contains('dark')
  }));
}
function loadState() {
  const state = JSON.parse(localStorage.getItem(storageKey) || 'null'); if (!state) return;
  state.texts?.forEach((text, index) => { if ($$('[data-editable]')[index]) $$('[data-editable]')[index].innerHTML = text; });
  if (state.tasks) taskList.innerHTML = state.tasks.join('');
  if (state.events) eventList.innerHTML = state.events.join('');
  if (state.assignments) assignmentList.innerHTML = state.assignments.join('');
  if (state.notes) notesList.innerHTML = state.notes.join('');
  if (state.studies) studyList.innerHTML = state.studies.join('');
  state.schedules?.forEach(schedule => { const target = $(`.day-schedule[data-day="${schedule.day}"]`); if (target) target.innerHTML = schedule.html; });
  archivedTasks = state.archivedTasks || []; archivedEvents = state.archivedEvents || []; archivedWork = state.archivedWork || []; archivedStudies = state.archivedStudies || []; studyMinutes = state.studyMinutes || studyMinutes; goalMinutes = state.goalMinutes || goalMinutes;
  document.body.classList.toggle('dark', Boolean(state.dark));
}
function renderArchive() {
  const list = $('#archive-list'); list.replaceChildren();
  $('#empty-archive').hidden = archivedTasks.length !== 0;
  archivedTasks.forEach((html, index) => {
    const template = document.createElement('template'); template.innerHTML = html.trim();
    const task = template.content.firstElementChild;
    const text = task?.querySelector('label')?.textContent || 'Archived task';
    const item = document.createElement('li');
    item.innerHTML = `<span>${text}</span><div><button type="button" data-restore="${index}">Restore</button><button type="button" data-delete-archive="${index}">Remove</button></div>`;
    list.append(item);
  });
  updateArchiveCount();
}
function renderEventArchive() {
  const list = $('#event-archive-list'); list.replaceChildren();
  $('#empty-event-archive').hidden = archivedEvents.length !== 0;
  archivedEvents.forEach((html, index) => {
    const template = document.createElement('template'); template.innerHTML = html.trim();
    const event = template.content.firstElementChild;
    const text = event?.querySelector('div b')?.textContent || 'Archived event';
    const item = document.createElement('li');
    item.innerHTML = `<span>${text}</span><div><button type="button" data-restore-event="${index}">Restore</button><button type="button" data-delete-event="${index}">Remove</button></div>`;
    list.append(item);
  });
  updateEventArchiveCount();
}
function renderWorkArchive() {
  const list = $('#work-archive-list'); list.replaceChildren();
  $('#empty-work-archive').hidden = archivedWork.length !== 0;
  archivedWork.forEach((record, index) => {
    const template = document.createElement('template'); template.innerHTML = record.html.trim();
    const title = template.content.querySelector('h3')?.textContent || 'Archived work';
    const item = document.createElement('li');
    item.innerHTML = `<span>${record.type === 'assignment' ? 'Assignment · ' : 'Note · '}${title}</span><div><button type="button" data-restore-work="${index}">Restore</button><button type="button" data-delete-work="${index}">Remove</button></div>`;
    list.append(item);
  });
  $$('.archived-work span').forEach(count => count.textContent = archivedWork.length);
}
function renderStudyArchive() {
  const list = $('#study-archive-list'); list.replaceChildren();
  $('#empty-study-archive').hidden = archivedStudies.length !== 0;
  archivedStudies.forEach((html, index) => { const template = document.createElement('template'); template.innerHTML = html.trim(); const title = template.content.querySelector('h3')?.textContent || 'Study session'; const item = document.createElement('li'); item.innerHTML = `<span>${title}</span><div><button type="button" data-restore-study="${index}">Restore</button><button type="button" data-delete-study="${index}">Remove</button></div>`; list.append(item); });
  $('#archived-study span').textContent = archivedStudies.length;
}
function info(kicker, title, content) { $('#info-kicker').textContent = kicker; $('#info-title').textContent = title; $('#info-content').textContent = content; $('#info-dialog').showModal(); }

editables.forEach(selector => $$(selector).forEach(el => { el.dataset.editable = 'true'; el.addEventListener('input', saveState); }));
$$('.dialog-close').forEach(button => { button.type = 'button'; button.onclick = () => button.closest('dialog').close(); });
['save-task', 'save-goal', 'save-class', 'save-assignment', 'save-note', 'save-study'].forEach(id => { const button = $(`#${id}`); if (button) button.type = 'button'; });
loadState(); prepareTasks(); prepareEvents(); updateTasks(); updateGoal(); renderArchive(); renderEventArchive(); renderWorkArchive(); renderStudyArchive();

taskList.addEventListener('change', event => { if (event.target.matches('input[type="checkbox"]')) updateTasks(); });
taskList.addEventListener('click', event => {
  const action = event.target.closest('.task-action'); if (!action) return;
  const task = action.closest('li'); if (!task) return;
  if (action.classList.contains('done')) { const checkbox = task.querySelector('input[type="checkbox"]'); checkbox.checked = true; updateTasks(); showToast('Task marked as done'); }
  if (action.classList.contains('archive')) { archivedTasks.unshift(task.outerHTML); task.remove(); renderArchive(); updateTasks(); showToast('Task moved to archive'); }
  if (action.classList.contains('remove') && confirm('Remove this task permanently?')) { task.remove(); updateTasks(); showToast('Task removed'); }
});

$('#archived-tasks').onclick = () => { renderArchive(); $('#archive-dialog').showModal(); };
$('#archive-list').addEventListener('click', event => {
  const restore = event.target.dataset.restore, remove = event.target.dataset.deleteArchive;
  if (restore !== undefined) { taskList.insertAdjacentHTML('beforeend', archivedTasks.splice(Number(restore), 1)[0]); prepareTasks(); renderArchive(); updateTasks(); showToast('Task restored to your list'); }
  if (remove !== undefined && confirm('Remove this archived task permanently?')) { archivedTasks.splice(Number(remove), 1); renderArchive(); saveState(); showToast('Archived task removed'); }
});
eventList.addEventListener('click', event => {
  const action = event.target.closest('.event-action'); if (!action) return;
  const item = action.closest('.event'); if (!item) return;
  if (action.classList.contains('done')) { item.classList.add('event-completed'); action.textContent = 'Completed'; saveState(); showToast('Event marked as done'); }
  if (action.classList.contains('archive')) { archivedEvents.unshift(item.outerHTML); item.remove(); renderEventArchive(); saveState(); showToast('Event moved to archive'); }
  if (action.classList.contains('remove') && confirm('Remove this event permanently?')) { item.remove(); saveState(); showToast('Event removed'); }
});
$('#archived-events').onclick = () => { renderEventArchive(); $('#event-archive-dialog').showModal(); };
$('#event-archive-list').addEventListener('click', event => {
  const restore = event.target.dataset.restoreEvent, remove = event.target.dataset.deleteEvent;
  if (restore !== undefined) { eventList.insertAdjacentHTML('beforeend', archivedEvents.splice(Number(restore), 1)[0]); renderEventArchive(); saveState(); showToast('Event restored'); }
  if (remove !== undefined && confirm('Remove this archived event permanently?')) { archivedEvents.splice(Number(remove), 1); renderEventArchive(); saveState(); showToast('Archived event removed'); }
});

function handleWorkAction(event) {
  const action = event.target.closest('.card-action'); if (!action) return;
  const card = action.closest('.assignment-card,.note-card'); if (!card) return;
  if (action.classList.contains('done')) { card.classList.add('is-complete'); action.textContent = 'Completed'; saveState(); showToast('Marked as done'); }
  if (action.classList.contains('archive')) { archivedWork.unshift({ type: card.classList.contains('assignment-card') ? 'assignment' : 'note', html: card.outerHTML }); card.remove(); renderWorkArchive(); saveState(); showToast('Moved to archived work'); }
  if (action.classList.contains('remove') && confirm('Remove this item permanently?')) { card.remove(); saveState(); showToast('Item removed'); }
  updateNotifications();
}
assignmentList.addEventListener('click', handleWorkAction); notesList.addEventListener('click', handleWorkAction);
$$('.archived-work').forEach(button => button.onclick = () => { renderWorkArchive(); $('#work-archive-dialog').showModal(); });
$('#work-archive-list').addEventListener('click', event => {
  const restore = event.target.dataset.restoreWork, remove = event.target.dataset.deleteWork;
  if (restore !== undefined) { const record = archivedWork.splice(Number(restore), 1)[0]; (record.type === 'assignment' ? assignmentList : notesList).insertAdjacentHTML('beforeend', record.html); renderWorkArchive(); saveState(); showToast('Archived work restored'); }
  if (remove !== undefined && confirm('Remove this archived item permanently?')) { archivedWork.splice(Number(remove), 1); renderWorkArchive(); saveState(); showToast('Archived item removed'); }
});

function showScheduleDay(day) { selectedScheduleDay = day; $$('.day-tab').forEach(button => button.classList.toggle('active', button.dataset.day === day)); $$('.day-schedule').forEach(schedule => schedule.classList.toggle('active', schedule.dataset.day === day)); const count = $(`.day-schedule[data-day="${day}"]`).querySelectorAll('.agenda-item').length; $('#schedule-day-label').textContent = day.toUpperCase(); $('#schedule-summary').textContent = count ? `${count} class${count === 1 ? '' : 'es'} planned` : 'No classes planned'; updateDashboardStats(); }
$$('.day-tab').forEach(button => button.onclick = () => showScheduleDay(button.dataset.day));
$('#add-class').onclick = () => { $('#class-day').value = selectedScheduleDay; $('#class-dialog').showModal(); };
$('#save-class').onclick = () => { const day = $('#class-day').value, name = $('#class-name').value.trim(), time = $('#class-time').value, note = $('#class-note').value.trim(); if (!name || !time) return showToast('Add a class name and time first'); const list = $(`.day-schedule[data-day="${day}"]`); list.querySelector('.empty-schedule')?.remove(); list.insertAdjacentHTML('beforeend', `<div class="agenda-item"><time>${time}</time><div><b>${name}</b><p>${note || 'No room or preparation note added'}</p></div><label class="schedule-check"><input type="checkbox" /> Done</label></div>`); $('#class-name').value = ''; $('#class-time').value = ''; $('#class-note').value = ''; $('#class-dialog').close(); showScheduleDay(day); saveState(); showToast('Class added to your schedule'); };
$('#add-assignment').onclick = () => $('#assignment-dialog').showModal();
$('#save-assignment').onclick = () => { const name = $('#assignment-name').value.trim(), subject = $('#assignment-subject').value.trim(), step = $('#assignment-step').value.trim(); if (!name || !subject || !step) return showToast('Fill in the assignment details first'); assignmentList.insertAdjacentHTML('beforeend', `<article class="panel assignment-card"><span class="tag neutral">New</span><h3>${name}</h3><p>${subject}</p><div class="assignment-footer"><span>Next: ${step}</span></div><div class="card-actions"><button class="card-action done">✓ Done</button><button class="card-action archive">Archive</button><button class="card-action remove" aria-label="Remove assignment">×</button></div></article>`); $('#assignment-name').value = ''; $('#assignment-subject').value = ''; $('#assignment-step').value = ''; $('#assignment-dialog').close(); saveState(); updateNotifications(); showToast('Assignment added'); };
$('#add-note').onclick = () => $('#note-dialog').showModal();
$('#save-note').onclick = () => { const subject = $('#note-subject').value.trim(), title = $('#note-title').value.trim(), body = $('#note-body').value.trim(); if (!subject || !title || !body) return showToast('Fill in the note details first'); notesList.insertAdjacentHTML('beforeend', `<article class="panel note-card blue-note"><span>${subject}</span><h3>${title}</h3><p>${body}</p><div class="card-actions"><button class="card-action done">✓ Done</button><button class="card-action archive">Archive</button><button class="card-action remove" aria-label="Remove note">×</button></div></article>`); $('#note-subject').value = ''; $('#note-title').value = ''; $('#note-body').value = ''; $('#note-dialog').close(); saveState(); showToast('Note saved'); };
$('#focus-timer').onclick = () => {
  const button = $('#focus-timer');
  if (focusInterval) { clearInterval(focusInterval); focusInterval = null; button.textContent = '▶ Resume focus'; showToast('Focus timer paused'); return; }
  focusInterval = setInterval(() => { focusSeconds -= 1; const minutes = Math.floor(focusSeconds / 60), seconds = String(focusSeconds % 60).padStart(2, '0'); button.textContent = `Ⅱ Pause · ${minutes}:${seconds}`; if (focusSeconds <= 0) { clearInterval(focusInterval); focusInterval = null; focusSeconds = 1500; studyMinutes = Math.min(studyMinutes + 25, goalMinutes); updateGoal(); button.textContent = '▶ Start 25 min focus'; showToast('Focus session complete — 25 minutes logged'); } }, 1000);
  button.textContent = 'Ⅱ Pause · 25:00'; showToast('Focus timer started');
};
studyList.addEventListener('change', event => { if (!event.target.matches('.study-check input')) return; const card = event.target.closest('.study-card'); card.classList.toggle('is-complete', event.target.checked); saveState(); showToast(event.target.checked ? 'Study session marked as finished' : 'Study session marked as unfinished'); });
studyList.addEventListener('click', event => { const action = event.target.closest('.study-action'); if (!action) return; const card = action.closest('.study-card'); if (action.classList.contains('archive')) { archivedStudies.unshift(card.outerHTML); card.remove(); renderStudyArchive(); saveState(); showToast('Study session archived'); } if (action.classList.contains('remove') && confirm('Remove this study session permanently?')) { card.remove(); saveState(); showToast('Study session removed'); } });
$('#add-study').onclick = () => $('#study-dialog').showModal();
$('#save-study').onclick = () => { const subject = $('#study-subject').value.trim(), title = $('#study-title').value.trim(), minutes = $('#study-minutes').value, goal = $('#study-goal').value.trim(); if (!subject || !title || !minutes || !goal) return showToast('Fill in the study session details first'); const order = String($$('#study-list .study-card').length + 1).padStart(2, '0'); studyList.insertAdjacentHTML('beforeend', `<article class="panel study-card"><span class="study-number">${order}</span><div><p class="study-meta">${subject} · ${minutes} MIN</p><h3>${title}</h3><p>${goal}</p></div><div class="study-actions"><label class="study-check"><input type="checkbox" /> Done</label><button class="study-action archive">Archive</button><button class="study-action remove" aria-label="Remove study session">×</button></div></article>`); $('#study-subject').value = ''; $('#study-title').value = ''; $('#study-minutes').value = '30'; $('#study-goal').value = ''; $('#study-dialog').close(); saveState(); showToast('Study session added'); };
$('#archived-study').onclick = () => { renderStudyArchive(); $('#study-archive-dialog').showModal(); };
$('#study-archive-list').addEventListener('click', event => { const restore = event.target.dataset.restoreStudy, remove = event.target.dataset.deleteStudy; if (restore !== undefined) { studyList.insertAdjacentHTML('beforeend', archivedStudies.splice(Number(restore), 1)[0]); renderStudyArchive(); saveState(); showToast('Study session restored'); } if (remove !== undefined && confirm('Remove this archived study session permanently?')) { archivedStudies.splice(Number(remove), 1); renderStudyArchive(); saveState(); showToast('Archived study session removed'); } });
$('#schedule-list').addEventListener('change', event => { if (!event.target.matches('.schedule-check input')) return; const item = event.target.closest('.agenda-item'); item.classList.toggle('is-finished', event.target.checked); saveState(); showToast(event.target.checked ? 'Class marked as finished' : 'Class marked as upcoming'); });

$('#add-task').onclick = () => $('#task-dialog').showModal();
$('#save-task').onclick = () => {
  const text = $('#new-task').value.trim(); if (!text) return;
  const id = `task-${Date.now()}`;
  taskList.insertAdjacentHTML('beforeend', `<li><input type="checkbox" id="${id}" title="Mark task as done"><label for="${id}">${text}</label><span class="tag today">New</span>${taskActions()}</li>`);
  $('#new-task').value = ''; updateTasks(); $('#task-dialog').close(); showToast('Task added to your focus list');
};
$('#log-study').onclick = () => { studyMinutes = Math.min(studyMinutes + 30, goalMinutes); updateGoal(); showToast('30 minutes added to your study goal'); };
$('#save-goal').onclick = () => { goalMinutes = Number($('#goal-hours').value) * 60; studyMinutes = Math.min(Number($('#completed-hours').value) * 60, goalMinutes); updateGoal(); $('#goal-dialog').close(); showToast('Study goal updated'); };
$('#theme-toggle').onclick = () => { document.body.classList.toggle('dark'); saveState(); showToast(document.body.classList.contains('dark') ? 'Dark mode enabled' : 'Light mode enabled'); };
$('#edit-mode').onclick = () => { editing = !editing; document.body.classList.toggle('editing', editing); $$('[data-editable]').forEach(el => el.contentEditable = editing); $('#edit-mode').textContent = editing ? '✓ Save changes' : '✎ Customize'; showToast(editing ? 'Edit mode is on — click text to customise it' : 'Your changes are saved'); };
$('#notifications').onclick = () => $('#notification-menu').toggleAttribute('hidden');
$('#profile-button').onclick = () => $('#profile-menu').toggleAttribute('hidden');
$('#reset-dashboard').onclick = () => { if (confirm('Reset all saved customisations for this dashboard?')) { localStorage.removeItem(storageKey); location.reload(); } };
const viewDetails = {
  home: ['TUESDAY, 15 OCTOBER', 'Good morning, Rancy <span>☀</span>', 'Here is your plan for a productive day.'],
  schedule: ['WEEKLY PLANNER', 'Your schedule', 'Classes, rooms, and preparation reminders in one place.'],
  assignments: ['WORK TO FINISH', 'Your assignments', 'Focus on the next action for each deadline.'],
  study: ['FOCUS PLAN', 'Study session', 'Choose one short task and make progress today.'],
  notes: ['QUICK NOTES', 'Your notes', 'Keep important reminders easy to return to.']
};
function showView(name, updateHash = true) {
  const selected = viewDetails[name] ? name : 'home';
  $$('.view').forEach(view => view.classList.toggle('active', view.id === `view-${selected}`));
  $$('.nav-link').forEach(button => button.classList.toggle('active', button.dataset.view === selected));
  const [kicker, title, subtitle] = viewDetails[selected];
  $('#page-kicker').textContent = kicker; $('#page-title').innerHTML = title; $('#page-subtitle').textContent = subtitle;
  if (updateHash) history.replaceState(null, '', `#${selected}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
$$('.nav-link').forEach(button => button.onclick = () => showView(button.dataset.view));
$$('[data-demo-action]').forEach(button => button.onclick = () => showToast(button.dataset.demoAction));
showView(location.hash.slice(1) || 'home', false);
$('#dashboard-search').oninput = event => {
  const query = event.target.value.trim().toLowerCase();
  const searchable = $$('.tasks li,.deadline,.class-card,.event,.agenda-item,.assignment-card,.study-card,.note-card');
  let firstMatch;
  searchable.forEach(item => { const matches = !query || item.textContent.toLowerCase().includes(query); item.hidden = !matches; if (matches && query && !firstMatch) firstMatch = item; });
  if (firstMatch) { const view = firstMatch.closest('.view'); if (view) showView(view.id.replace('view-', ''), false); const day = firstMatch.closest('.day-schedule'); if (day) showScheduleDay(day.dataset.day); }
  if (!query) $$('.view').forEach(view => { view.querySelectorAll('[hidden]').forEach(item => item.hidden = false); });
};
$$('.text-button').forEach(button => button.onclick = () => { const label = button.textContent.trim(); if (label === 'Edit goal') return $('#goal-dialog').showModal(); if (label === 'Full schedule →') return showView('schedule'); if (label === 'See all →') return showView('assignments'); if (label === 'View all →') return info('CAMPUS EVENTS', 'What is happening this week', 'Career Fair, Wellness Wednesday, and Outdoor Movie Night are coming up on campus.'); return info('ALL DEADLINES', 'Assignment planner', 'You have three upcoming deadlines. Add more assignments and organise them by course and due date.'); });
$('.next-class button').onclick = () => info('NEXT CLASS', 'Database Systems', 'Starts at 10:30 AM in Lab 2. Bring your database homework and lecture notes.');
