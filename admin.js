


const USERS_KEY = 'pcshs_admin_users';
const SESSION_KEY = 'pcshs_admin_session';

function getUsers() {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) return JSON.parse(stored);
    
    const defaults = [
        { id: 1, username: 'admin', password: 'pcshs2025', role: 'admin', lastLogin: 'Never' }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
    return defaults;
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function doLogin(e) {
    e.preventDefault();
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    const err = document.getElementById('loginError');
    const btn = document.getElementById('loginBtn');

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in…';
    btn.disabled = true;

    setTimeout(() => {
        const users = getUsers();
        const found = users.find(u => u.username === user && u.password === pass);

        if (found) {
            found.lastLogin = new Date().toLocaleString();
            saveUsers(users);
            localStorage.setItem(SESSION_KEY, JSON.stringify(found));
            err.textContent = '';
            launchAdmin(found);
        } else {
            err.textContent = 'Invalid username or password.';
            btn.innerHTML = '<span>Sign In</span> <i class="fas fa-arrow-right"></i>';
            btn.disabled = false;
        }
    }, 800);
}

function togglePass() {
    const input = document.getElementById('loginPass');
    const icon = document.getElementById('eyeIcon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function doLogout() {
    localStorage.removeItem(SESSION_KEY);
    document.getElementById('adminApp').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').textContent = '';
    document.getElementById('loginBtn').innerHTML = '<span>Sign In</span> <i class="fas fa-arrow-right"></i>';
    document.getElementById('loginBtn').disabled = false;
}

function launchAdmin(user) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminApp').style.display = 'flex';
    document.getElementById('adminName').textContent = user.username;
    document.getElementById('adminAvatar').textContent = user.username[0].toUpperCase();
    document.getElementById('tbAvatar').textContent = user.username[0].toUpperCase();
    refreshDashboard();
    renderNews(); renderEvents(); renderResearch(); renderAwards(); renderUsers(); loadAlertForm();
    renderApplications(); renderContacts(); renderClubs(); renderAchievers();
}


window.addEventListener('DOMContentLoaded', () => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
        launchAdmin(JSON.parse(session));
    }
});


function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.body.classList.toggle('collapsed');
}

function showPanel(name, linkEl) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('panel-' + name);
    if (panel) panel.classList.add('active');

    document.querySelectorAll('.s-link').forEach(l => l.classList.remove('active'));
    if (linkEl) linkEl.classList.add('active');

    const labels = {
        dashboard: 'Dashboard', news: 'News & Announcements', events: 'Events',
        research: 'Research', awards: 'Awards Ticker', alert: 'Alert Banner', users: 'User Accounts',
        clubs: 'Clubs & Orgs', achievers: 'Achievers', contacts: 'Contacts Inbox', applications: 'Applications Inbox'
    };
    document.getElementById('breadcrumb').textContent = labels[name] || name;

    if (name === 'dashboard') refreshDashboard();
    else if (name === 'applications') renderApplications();
    else if (name === 'contacts') renderContacts();
    else if (name === 'clubs') renderClubs();
    else if (name === 'achievers') renderAchievers();
    else if (name === 'news') renderNews();
}


function showToast(msg, type = 'default') {
    const toast = document.getElementById('adminToast');
    toast.textContent = msg;
    toast.className = 'admin-toast ' + type;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}


function logActivity(msg) {
    const logs = JSON.parse(localStorage.getItem('pcshs_activity') || '[]');
    logs.unshift({ msg, time: new Date().toLocaleTimeString() });
    if (logs.length > 20) logs.pop();
    localStorage.setItem('pcshs_activity', JSON.stringify(logs));
    renderActivity();
}

function renderActivity() {
    const feed = document.getElementById('activityFeed');
    if (!feed) return;
    const logs = JSON.parse(localStorage.getItem('pcshs_activity') || '[]');
    if (!logs.length) {
        feed.innerHTML = '<p class="empty-msg">No recent activity.</p>';
        return;
    }
    feed.innerHTML = logs.slice(0, 6).map(l => `
    <div class="activity-item">
      <i class="fas fa-circle-dot"></i>
      <div><div>${l.msg}</div><div class="act-time">${l.time}</div></div>
    </div>
  `).join('');
}


function refreshDashboard() {
    const news = JSON.parse(localStorage.getItem('pcshs_news') || '[]');
    const events = JSON.parse(localStorage.getItem('pcshs_events') || '[]');
    const research = JSON.parse(localStorage.getItem('pcshs_research') || '[]');
    const awards = JSON.parse(localStorage.getItem('pcshs_awards') || '[]');

    animCount('stat-news', news.length);
    animCount('stat-events', events.length);
    animCount('stat-research', research.length);
    animCount('stat-awards', awards.length);
    renderActivity();
}

function animCount(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let n = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const t = setInterval(() => {
        n = Math.min(n + step, target);
        el.textContent = n;
        if (n >= target) clearInterval(t);
    }, 30);
}




function getNews() { return JSON.parse(localStorage.getItem('pcshs_news') || '[]'); }
function saveNewsData(data) {
    localStorage.setItem('pcshs_news', JSON.stringify(data));
    
    localStorage.setItem('pcshs_news_updated', Date.now().toString());
}

function renderNews() {
    const tbody = document.getElementById('newsTableBody');
    const news = getNews();
    if (!news.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-row">No news articles yet. Add one!</td></tr>';
        return;
    }
    tbody.innerHTML = news.map(n => `
    <tr>
      <td><strong>${n.title}</strong></td>
      <td><span class="tag tag-blue">${n.category}</span></td>
      <td>${n.date}</td>
      <td>${n.featured ? '<span class="tag tag-gold">Featured</span>' : '—'}</td>
      <td>
        <div class="tbl-actions">
          <button class="btn-edit" onclick="editNews('${n.id}')" title="Edit"><i class="fas fa-pen"></i></button>
          <button class="btn-del" onclick="deleteItem('news','${n.id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openNewsModal(id) {
    clearForm(['newsTitle', 'newsSummary', 'newsContent', 'newsImg', 'newsDate', 'newsEditId']);
    document.getElementById('newsFeatured').checked = false;
    document.getElementById('newsCat').value = 'Achievement';
    document.getElementById('newsModalTitle').textContent = 'Add News Article';
    openModal('newsModal');
}

function editNews(id) {
    const item = getNews().find(n => n.id === id);
    if (!item) return;
    document.getElementById('newsEditId').value = id;
    document.getElementById('newsTitle').value = item.title;
    document.getElementById('newsCat').value = item.category;
    document.getElementById('newsDate').value = item.date;
    document.getElementById('newsSummary').value = item.summary;
    document.getElementById('newsContent').value = item.content || '';
    document.getElementById('newsImg').value = item.img || '';
    document.getElementById('newsFeatured').checked = item.featured || false;
    document.getElementById('newsModalTitle').textContent = 'Edit Article';
    openModal('newsModal');
}

function saveNews(e) {
    e.preventDefault();
    const news = getNews();
    const editId = document.getElementById('newsEditId').value;
    const item = {
        id: editId || 'n_' + Date.now(),
        title: document.getElementById('newsTitle').value.trim(),
        category: document.getElementById('newsCat').value,
        date: document.getElementById('newsDate').value,
        summary: document.getElementById('newsSummary').value.trim(),
        content: document.getElementById('newsContent').value.trim(),
        img: document.getElementById('newsImg').value.trim(),
        featured: document.getElementById('newsFeatured').checked,
    };

    if (editId) {
        const idx = news.findIndex(n => n.id === editId);
        if (idx > -1) news[idx] = item;
        logActivity(`Updated news: "${item.title}"`);
    } else {
        news.unshift(item);
        logActivity(`Added news: "${item.title}"`);
    }

    saveNewsData(news);
    renderNews();
    closeModal('newsModal');
    showToast('News article saved!', 'success');
}




function getEvents() { return JSON.parse(localStorage.getItem('pcshs_events') || '[]'); }
function saveEventsData(data) {
    localStorage.setItem('pcshs_events', JSON.stringify(data));
    localStorage.setItem('pcshs_events_updated', Date.now().toString());
}

function renderEvents() {
    const tbody = document.getElementById('eventsTableBody');
    const events = getEvents();
    if (!events.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-row">No events yet. Add one!</td></tr>';
        return;
    }
    tbody.innerHTML = events.map(ev => `
    <tr>
      <td><strong>${ev.title}</strong></td>
      <td><span class="tag tag-blue">${ev.month}</span></td>
      <td>${ev.day}</td>
      <td>${ev.location}</td>
      <td>${ev.time}</td>
      <td>
        <div class="tbl-actions">
          <button class="btn-edit" onclick="editEvent('${ev.id}')" title="Edit"><i class="fas fa-pen"></i></button>
          <button class="btn-del"  onclick="deleteItem('events','${ev.id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openEventModal() {
    clearForm(['eventTitle', 'eventDay', 'eventLocation', 'eventTime', 'eventEditId']);
    document.getElementById('eventMonth').value = 'MAR';
    document.getElementById('eventModalTitle').textContent = 'Add Event';
    openModal('eventModal');
}

function editEvent(id) {
    const item = getEvents().find(e => e.id === id);
    if (!item) return;
    document.getElementById('eventEditId').value = id;
    document.getElementById('eventTitle').value = item.title;
    document.getElementById('eventMonth').value = item.month;
    document.getElementById('eventDay').value = item.day;
    document.getElementById('eventLocation').value = item.location;
    document.getElementById('eventTime').value = item.time;
    document.getElementById('eventModalTitle').textContent = 'Edit Event';
    openModal('eventModal');
}

function saveEvent(e) {
    e.preventDefault();
    const events = getEvents();
    const editId = document.getElementById('eventEditId').value;
    const item = {
        id: editId || 'ev_' + Date.now(),
        title: document.getElementById('eventTitle').value.trim(),
        month: document.getElementById('eventMonth').value,
        day: document.getElementById('eventDay').value,
        location: document.getElementById('eventLocation').value.trim(),
        time: document.getElementById('eventTime').value.trim(),
    };

    if (editId) {
        const idx = events.findIndex(ev => ev.id === editId);
        if (idx > -1) events[idx] = item;
        logActivity(`Updated event: "${item.title}"`);
    } else {
        events.push(item);
        logActivity(`Added event: "${item.title}"`);
    }

    saveEventsData(events);
    renderEvents();
    closeModal('eventModal');
    showToast('Event saved!', 'success');
}




function getResearch() { return JSON.parse(localStorage.getItem('pcshs_research') || '[]'); }
function saveResearchData(data) {
    localStorage.setItem('pcshs_research', JSON.stringify(data));
    localStorage.setItem('pcshs_research_updated', Date.now().toString());
}

function renderResearch() {
    const tbody = document.getElementById('researchTableBody');
    const items = getResearch();
    if (!items.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-row">No research items yet. Add one!</td></tr>';
        return;
    }
    tbody.innerHTML = items.map(r => `
    <tr>
      <td><strong>${r.title}</strong></td>
      <td><span class="tag tag-purple">${r.topic}</span></td>
      <td>${r.grade}</td>
      <td>${r.award || '—'}</td>
      <td>
        <div class="tbl-actions">
          <button class="btn-edit" onclick="editResearch('${r.id}')" title="Edit"><i class="fas fa-pen"></i></button>
          <button class="btn-del"  onclick="deleteItem('research','${r.id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openResearchModal() {
    clearForm(['researchTitle', 'researchGrade', 'researchDesc', 'researchAward', 'researchImg', 'researchEditId']);
    document.getElementById('researchTopic').value = 'Biology';
    document.getElementById('researchModalTitle').textContent = 'Add Research Item';
    openModal('researchModal');
}

function editResearch(id) {
    const item = getResearch().find(r => r.id === id);
    if (!item) return;
    document.getElementById('researchEditId').value = id;
    document.getElementById('researchTitle').value = item.title;
    document.getElementById('researchTopic').value = item.topic;
    document.getElementById('researchGrade').value = item.grade;
    document.getElementById('researchDesc').value = item.desc;
    document.getElementById('researchAward').value = item.award || '';
    document.getElementById('researchImg').value = item.img || '';
    document.getElementById('researchModalTitle').textContent = 'Edit Research';
    openModal('researchModal');
}

function saveResearch(e) {
    e.preventDefault();
    const items = getResearch();
    const editId = document.getElementById('researchEditId').value;
    const item = {
        id: editId || 'r_' + Date.now(),
        title: document.getElementById('researchTitle').value.trim(),
        topic: document.getElementById('researchTopic').value,
        grade: document.getElementById('researchGrade').value.trim(),
        desc: document.getElementById('researchDesc').value.trim(),
        award: document.getElementById('researchAward').value.trim(),
        img: document.getElementById('researchImg').value.trim(),
    };

    if (editId) {
        const idx = items.findIndex(r => r.id === editId);
        if (idx > -1) items[idx] = item;
        logActivity(`Updated research: "${item.title}"`);
    } else {
        items.unshift(item);
        logActivity(`Added research: "${item.title}"`);
    }

    saveResearchData(items);
    renderResearch();
    closeModal('researchModal');
    showToast('Research item saved!', 'success');
}




function getAwards() { return JSON.parse(localStorage.getItem('pcshs_awards') || '[]'); }
function saveAwardsData(data) {
    localStorage.setItem('pcshs_awards', JSON.stringify(data));
    localStorage.setItem('pcshs_awards_updated', Date.now().toString());
}

function renderAwards() {
    const tbody = document.getElementById('awardsTableBody');
    const items = getAwards();
    if (!items.length) {
        tbody.innerHTML = '<tr><td colspan="3" class="empty-row">No awards yet. Add one!</td></tr>';
        return;
    }
    tbody.innerHTML = items.map((a, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${a.text}</td>
      <td>
        <div class="tbl-actions">
          <button class="btn-edit" onclick="editAward('${a.id}')" title="Edit"><i class="fas fa-pen"></i></button>
          <button class="btn-del"  onclick="deleteItem('awards','${a.id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openAwardModal() {
    document.getElementById('awardText').value = '';
    document.getElementById('awardEditId').value = '';
    document.getElementById('awardModalTitle').textContent = 'Add Award';
    openModal('awardModal');
}

function editAward(id) {
    const item = getAwards().find(a => a.id === id);
    if (!item) return;
    document.getElementById('awardEditId').value = id;
    document.getElementById('awardText').value = item.text;
    document.getElementById('awardModalTitle').textContent = 'Edit Award';
    openModal('awardModal');
}

function saveAward(e) {
    e.preventDefault();
    const items = getAwards();
    const editId = document.getElementById('awardEditId').value;
    const item = { id: editId || 'a_' + Date.now(), text: document.getElementById('awardText').value.trim() };

    if (editId) {
        const idx = items.findIndex(a => a.id === editId);
        if (idx > -1) items[idx] = item;
        logActivity(`Updated award: "${item.text.substring(0, 40)}"`);
    } else {
        items.push(item);
        logActivity(`Added award: "${item.text.substring(0, 40)}"`);
    }

    saveAwardsData(items);
    renderAwards();
    closeModal('awardModal');
    showToast('Award saved!', 'success');
}




function loadAlertForm() {
    const data = JSON.parse(localStorage.getItem('pcshs_alert') || '{}');
    document.getElementById('alertMsg').value = data.msg || 'Enrollment for S.Y. 2025–2026 is now open.';
    document.getElementById('alertLinkText').value = data.linkText || 'Apply online here.';
    document.getElementById('alertLinkUrl').value = data.linkUrl || '#admissions';
    document.getElementById('alertVisible').checked = data.visible !== false;

    const enrollActive = localStorage.getItem('pcshs_enrollment_active');
    if (document.getElementById('enrollmentActive')) {
        document.getElementById('enrollmentActive').checked = enrollActive !== 'false';
    }
}

function saveAlert() {
    const data = {
        msg: document.getElementById('alertMsg').value.trim(),
        linkText: document.getElementById('alertLinkText').value.trim(),
        linkUrl: document.getElementById('alertLinkUrl').value.trim(),
        visible: document.getElementById('alertVisible').checked,
    };
    localStorage.setItem('pcshs_alert', JSON.stringify(data));
    localStorage.setItem('pcshs_alert_updated', Date.now().toString());

    if (document.getElementById('enrollmentActive')) {
        localStorage.setItem('pcshs_enrollment_active', document.getElementById('enrollmentActive').checked ? 'true' : 'false');
    }

    logActivity('Updated general settings');
    showToast('Settings saved!', 'success');
}




function renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    const users = getUsers();
    tbody.innerHTML = users.map(u => `
    <tr>
      <td><strong>${u.username}</strong></td>
      <td><span class="tag ${u.role === 'admin' ? 'tag-blue' : 'tag-purple'}">${u.role}</span></td>
      <td>${u.lastLogin || 'Never'}</td>
      <td>
        <div class="tbl-actions">
          ${u.username !== 'admin' ? `<button class="btn-del" onclick="deleteUser(${u.id})" title="Delete"><i class="fas fa-trash"></i></button>` : '<span style="color:#ccc;font-size:.8rem">Protected</span>'}
        </div>
      </td>
    </tr>
  `).join('');
}

function addUser() {
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('newRole').value;

    if (!username || !password) { showToast('Fill in username and password.', 'error'); return; }
    const users = getUsers();
    if (users.find(u => u.username === username)) { showToast('Username already exists.', 'error'); return; }

    users.push({ id: Date.now(), username, password, role, lastLogin: 'Never' });
    saveUsers(users);
    renderUsers();
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    logActivity(`Added user: "${username}" (${role})`);
    showToast('User added!', 'success');
}

function deleteUser(id) {
    confirmDelete(() => {
        const users = getUsers().filter(u => u.id !== id);
        saveUsers(users);
        renderUsers();
        logActivity('Deleted a user account');
        showToast('User deleted.', 'default');
    });
}




function deleteItem(type, id) {
    confirmDelete(() => {
        let data, key, updated;
        if (type === 'news') { data = getNews().filter(n => n.id !== id); key = 'pcshs_news'; updated = 'pcshs_news_updated'; saveNewsData(data); renderNews(); }
        if (type === 'events') { data = getEvents().filter(e => e.id !== id); key = 'pcshs_events'; updated = 'pcshs_events_updated'; saveEventsData(data); renderEvents(); }
        if (type === 'research') { data = getResearch().filter(r => r.id !== id); key = 'pcshs_research'; updated = 'pcshs_research_updated'; saveResearchData(data); renderResearch(); }
        if (type === 'awards') { data = getAwards().filter(a => a.id !== id); key = 'pcshs_awards'; updated = 'pcshs_awards_updated'; saveAwardsData(data); renderAwards(); }
        logActivity(`Deleted ${type} item`);
        showToast('Item deleted.', 'default');
        refreshDashboard();
    });
}




let _pendingDeleteFn = null;

function confirmDelete(fn) {
    _pendingDeleteFn = fn;
    openModal('confirmModal');
    document.getElementById('confirmDeleteBtn').onclick = () => {
        closeModal('confirmModal');
        if (_pendingDeleteFn) _pendingDeleteFn();
        _pendingDeleteFn = null;
    };
}

function openModal(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}


document.querySelectorAll('.modal-bg').forEach(bg => {
    bg.addEventListener('click', e => {
        if (e.target === bg) closeModal(bg.id);
    });
});


document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-bg.open').forEach(m => closeModal(m.id));
    }
});


function clearForm(ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

console.log('PCSHS Admin Panel loaded.');




async function renderApplications() {
    const tbody = document.getElementById('applicationsTableBody');
    if (!tbody) return;

    let apps = [];
    try {
        if (window.DB) {
            apps = await window.DB.getAll('applications');
        } else {
            const parsed = JSON.parse(localStorage.getItem('pcshs_applications'));
            apps = Array.isArray(parsed) ? parsed : [];
        }
    } catch (e) {
        apps = [];
    }
    if (!Array.isArray(apps)) apps = [];

    
    const searchVal = (document.getElementById('appSearch')?.value || '').toLowerCase();
    const statusVal = document.getElementById('appFilterStatus')?.value || '';

    let filteredApps = apps.filter(a => {
        const name = (a.fullName || a.name || '').toLowerCase();
        const email = (a.parentEmail || a.email || '').toLowerCase();
        const ref = (a.refNumber || a.id || '').toLowerCase();
        const st = (a.status || 'received').replace('pending', 'received');
        
        const matchesSearch = name.includes(searchVal) || email.includes(searchVal) || ref.includes(searchVal);
        const matchesStatus = statusVal === '' || st === statusVal;
        return matchesSearch && matchesStatus;
    });

    updateAppsBadge(filteredApps.length);
    if (!filteredApps.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-row">No applications found matching your criteria.</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredApps.map((a) => {
        const name = a.fullName || a.name || '—';
        const email = a.parentEmail || a.email || '—';
        const school = a.school || '—';
        const gwa = a.gwa || '—';
        const track = a.track || a.type || '—';
        const submitted = a.submittedAt || a.submitted || a._at || '—';
        const ref = a.refNumber || a.id || '—';
        const status = a.status || 'received';
        
        let statusColor = 'tag-blue';
        if(status === 'accepted') statusColor = 'tag-green';
        else if(status === 'rejected') statusColor = 'tag-red';
        else if(status === 'exam' || status === 'entrance_exam_scheduled') statusColor = 'tag-purple';
        else if(status === 'interview' || status === 'interview_scheduled') statusColor = 'tag-gold';
        
        let displayStatus = status.replace(/_/g, ' ');
        if(displayStatus === 'pending') displayStatus = 'received';
        displayStatus = displayStatus.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        return `
    <tr>
      <td><strong>${name}</strong><br><small style="color:#8A8EA8">${ref}</small></td>
      <td>${school}</td>
      <td><span class="tag tag-blue">${gwa}</span></td>
      <td><span class="tag tag-purple">${track}</span></td>
      <td>${email}</td>
      <td><span class="tag ${statusColor}">${displayStatus}</span></td>
      <td style="font-size:.78rem;color:#6B7280">${typeof submitted === 'string' ? submitted.slice(0, 16).replace('T', ' ') : submitted}</td>
      <td>
        <div class="tbl-actions">
          <button class="btn-edit" onclick="openAppReview('${ref}')" title="Review Application"><i class="fas fa-ellipsis-v"></i></button>
        </div>
      </td>
    </tr>
  `;
    }).join('');
}


async function openAppReview(refNumber) {
    let app = null;
    try {
        if(window.DB) {
            app = await window.DB.findOne('applications', 'refNumber', refNumber);
        } else {
            const apps = JSON.parse(localStorage.getItem('pcshs_applications') || '[]');
            app = apps.find(a => a.refNumber === refNumber || a.id === refNumber);
        }
    } catch(e) {}
    if(!app) return;

    document.getElementById('revRefNumber').value = refNumber;
    document.getElementById('revName').textContent = app.fullName || app.name || '—';
    document.getElementById('revSchool').textContent = app.school || '—';
    document.getElementById('revGwa').textContent = app.gwa || '—';
    document.getElementById('revTrack').textContent = app.track || app.type || '—';
    
    let st = app.status || 'received';
    if(st === 'pending') st = 'received';
    document.getElementById('revStatus').value = st;
    document.getElementById('revExamDate').value = app.examDate || '';
    document.getElementById('revInterviewDate').value = app.interviewDate || '';
    document.getElementById('revNote').value = app.statusNote || '';
    
    toggleRevFields();
    openModal('appReviewModal');
}

function toggleRevFields() {
    const st = document.getElementById('revStatus').value;
    document.getElementById('revExamDateWrap').style.display = st === 'exam' ? 'block' : 'none';
    document.getElementById('revInterviewDateWrap').style.display = st === 'interview' ? 'block' : 'none';
}

async function saveAppReview(e) {
    e.preventDefault();
    const refNumber = document.getElementById('revRefNumber').value;
    const st = document.getElementById('revStatus').value;
    const examDate = document.getElementById('revExamDate').value.trim();
    const interviewDate = document.getElementById('revInterviewDate').value.trim();
    const note = document.getElementById('revNote').value.trim();

    try {
        if (window.DB) {
            const app = await window.DB.findOne('applications', 'refNumber', refNumber);
            if(app) {
                app.status = st;
                if(st === 'exam') app.examDate = examDate;
                if(st === 'interview') app.interviewDate = interviewDate;
                app.statusNote = note;
                await window.DB.save('applications', app);
            }
        } else {
            const apps = JSON.parse(localStorage.getItem('pcshs_applications') || '[]');
            const idx = apps.findIndex(a => a.refNumber === refNumber || a.id === refNumber);
            if(idx > -1) {
                apps[idx].status = st;
                if(st === 'exam') apps[idx].examDate = examDate;
                if(st === 'interview') apps[idx].interviewDate = interviewDate;
                apps[idx].statusNote = note;
                localStorage.setItem('pcshs_applications', JSON.stringify(apps));
            }
        }
        
                
        if (typeof emailjs !== 'undefined') {
            try {
                
                let displayStatus = st.replace(/_/g, ' ');
                if(displayStatus === 'pending') displayStatus = 'received';
                displayStatus = displayStatus.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

                let applicantEmail = '';
                if (window.DB) {
                    const applicant = await window.DB.findOne('applications', 'refNumber', refNumber) || {};
                    applicantEmail = applicant.parentEmail || applicant.email || '';
                } 
                if (!applicantEmail) {
                    const apps = JSON.parse(localStorage.getItem('pcshs_applications') || '[]');
                    const applicant = apps.find(a => a.refNumber === refNumber || a.id === refNumber) || {};
                    applicantEmail = applicant.parentEmail || applicant.email || '';
                }

                
                let templateId = null;
                if (st === 'accepted') {
                    templateId = 'template_mf1ayxf';
                } else if (st === 'rejected') {
                    templateId = 'template_17a9qwg';
                }

                if (templateId) {
                    if (!applicantEmail) {
                        console.error("Cannot send EmailJS: Recipient address is empty.");
                        showToast("Failed to send email: Applicant email missing from Database", "error");
                    } else {
                        
                        console.log(`Sending EmailJS to ${applicantEmail} via template: ${templateId}`);
                        
                        emailjs.send("service_t55gxns", templateId, {
                            to_name: document.getElementById('revName').textContent,
                            to_email: applicantEmail,
                            email: applicantEmail,
                            recipient: applicantEmail,
                            parent_email: applicantEmail,
                            status: displayStatus,
                            note: note,
                            exam_date: examDate,
                            interview_date: interviewDate,
                            ref_number: refNumber
                        }).then(function(response) {
                            console.log('Email sent successfully!', response.status, response.text);
                            showToast("Email dispatched to applicant successfully!", "success");
                        }, function(error) {
                            console.error('Failed to send email...', error);
                            showToast("EmailJS Error: Check console or EmailJS Dashboard.", "error");
                        });
                    }
                } else {
                    console.log(`No EmailJS template configured yet for status: ${st}`);
                }
                
            } catch (emailErr) {
                console.warn('EmailJS error:', emailErr);
            }
        }

        showToast('Application updated successfully!', 'success');
        logActivity(`Updated application status for ${refNumber}`);
        closeModal('appReviewModal');
        renderApplications();
    } catch(err) {
        showToast('Error updating application.', 'error');
    }
}


async function exportApplicationsCSV() {
    let apps = [];
    try {
        if (window.DB) { apps = await window.DB.getAll('applications'); }
        else { apps = JSON.parse(localStorage.getItem('pcshs_applications') || '[]'); }
    } catch(e) {}
    if (!apps || apps.length === 0) {
        showToast('No applications to export.', 'error');
        return;
    }

    const headers = ['Ref Number', 'Full Name', 'Type', 'GWA', 'Track', 'School', 'Parent Email', 'Status', 'Submitted At'];
    const rows = apps.map(a => [
        a.refNumber || '',
        a.fullName || a.name || '',
        a.type || '',
        a.gwa || '',
        a.track || '',
        a.school || '',
        a.parentEmail || '',
        a.status || 'received',
        a.submittedAt || ''
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(r => r.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(",")).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PCSHS_Applications_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    logActivity('Exported applications to CSV');
}

function updateAppsBadge(count) {
    const badge = document.getElementById('appsBadge');
    if (!badge) return;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
}

function clearApplications() {
    confirmDelete(() => {
        localStorage.removeItem('pcshs_applications');
        renderApplications();
        showToast('All applications cleared.', 'default');
        logActivity('Cleared all applications');
    });
}


const _origLaunch = launchAdmin;
window.launchAdmin = function (user) {
    _origLaunch(user);
    renderApplications();
};


const _origShowPanel = showPanel;
window.showPanel = function (name, linkEl) {
    _origShowPanel(name, linkEl);
    if (name === 'applications') renderApplications();
    const labels = {
        dashboard: 'Dashboard', news: 'News & Announcements', events: 'Events',
        research: 'Research', awards: 'Awards Ticker', alert: 'Alert Banner',
        users: 'User Accounts', applications: 'Applications Inbox'
    };
    document.getElementById('breadcrumb').textContent = labels[name] || name;
};


setInterval(async () => {
    try {
        let apps = [], contacts = [];
        if (window.DB) {
            apps = await window.DB.getAll('applications');
            contacts = await window.DB.getAll('contacts');
        } else {
            const pApps = JSON.parse(localStorage.getItem('pcshs_applications'));
            apps = Array.isArray(pApps) ? pApps : [];
            const pContacts = JSON.parse(localStorage.getItem('pcshs_contacts'));
            contacts = Array.isArray(pContacts) ? pContacts : [];
        }
        if (!Array.isArray(apps)) apps = [];
        if (!Array.isArray(contacts)) contacts = [];

        updateAppsBadge(apps.length);
        updateContactsBadge(contacts.length);
    } catch (e) { }
}, 5000);




function getContacts() { return JSON.parse(localStorage.getItem('pcshs_contacts') || '[]'); }

function updateContactsBadge(count) {
    const badge = document.getElementById('contactsBadge');
    if (!badge) return;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
}

async function renderContacts() {
    const tbody = document.getElementById('contactsTableBody');
    if (!tbody) return;
    let items = [];
    try {
        if (window.DB) {
            items = await window.DB.getAll('contacts');
        } else {
            items = JSON.parse(localStorage.getItem('pcshs_contacts') || '[]');
        }
    } catch (e) {
        items = JSON.parse(localStorage.getItem('pcshs_contacts') || '[]');
    }
    updateContactsBadge(items.length);
    if (!items.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-row">No messages yet.</td></tr>';
        return;
    }
    tbody.innerHTML = items.map((c, i) => `
    <tr>
      <td><strong>${c.name || '—'}</strong></td>
      <td>${c.email || '—'}</td>
      <td><span class="tag tag-purple">${c.type || '—'}</span></td>
      <td>${c.subject || '—'}</td>
      <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.message || '—'}</td>
      <td style="font-size:.78rem;color:#6B7280">${c.date ? new Date(c.date).toLocaleDateString() : '—'}</td>
      <td>
        <div class="tbl-actions">
          <button class="btn-del" onclick="deleteContact('${c.id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function deleteContact(id) {
    confirmDelete(() => {
        const items = getContacts().filter(c => String(c.id) !== String(id));
        localStorage.setItem('pcshs_contacts', JSON.stringify(items));
        renderContacts();
        logActivity('Deleted a contact message');
        showToast('Message deleted.', 'default');
    });
}

function clearContacts() {
    confirmDelete(() => {
        localStorage.removeItem('pcshs_contacts');
        renderContacts();
        showToast('All messages cleared.', 'default');
        logActivity('Cleared all contact messages');
    });
}




function getClubs() { return JSON.parse(localStorage.getItem('pcshs_clubs') || '[]'); }
function saveClubsData(data) {
    localStorage.setItem('pcshs_clubs', JSON.stringify(data));
    localStorage.setItem('pcshs_clubs_updated', Date.now().toString());
}

function renderClubs() {
    const tbody = document.getElementById('clubsTableBody');
    if (!tbody) return;
    const items = getClubs();
    if (!items.length) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-row">No clubs added yet.</td></tr>';
        return;
    }
    tbody.innerHTML = items.map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td><span class="tag ${c.type === 'academic' ? 'tag-blue' : c.type === 'sslg' ? 'tag-purple' : 'tag-gold'}">${c.type}</span></td>
      <td>${c.adviser || '—'}</td>
      <td>
        <div class="tbl-actions">
          <button class="btn-edit" onclick="editClub('${c.id}')" title="Edit"><i class="fas fa-pen"></i></button>
          <button class="btn-del" onclick="deleteItem('clubs','${c.id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openClubModal() {
    clearForm(['clubName', 'clubDesc', 'clubAdviser', 'clubOfficers', 'clubEditId']);
    document.getElementById('clubType').value = 'academic';
    document.getElementById('clubModalTitle').textContent = 'Add Club';
    openModal('clubModal');
}

function editClub(id) {
    const item = getClubs().find(c => c.id === id);
    if (!item) return;
    document.getElementById('clubEditId').value = id;
    document.getElementById('clubName').value = item.name;
    document.getElementById('clubType').value = item.type;
    document.getElementById('clubDesc').value = item.desc;
    document.getElementById('clubAdviser').value = item.adviser || '';
    document.getElementById('clubOfficers').value = item.officers || '';
    document.getElementById('clubModalTitle').textContent = 'Edit Club';
    openModal('clubModal');
}

function saveClub(e) {
    e.preventDefault();
    const items = getClubs();
    const editId = document.getElementById('clubEditId').value;
    const item = {
        id: editId || 'cl_' + Date.now(),
        name: document.getElementById('clubName').value.trim(),
        type: document.getElementById('clubType').value,
        desc: document.getElementById('clubDesc').value.trim(),
        adviser: document.getElementById('clubAdviser').value.trim(),
        officers: document.getElementById('clubOfficers').value.trim(),
    };
    if (editId) {
        const idx = items.findIndex(c => c.id === editId);
        if (idx > -1) items[idx] = item;
        logActivity(`Updated club: "${item.name}"`);
    } else {
        items.push(item);
        logActivity(`Added club: "${item.name}"`);
    }
    saveClubsData(items);
    renderClubs();
    closeModal('clubModal');
    showToast('Club saved!', 'success');
}




function getAchievers() { return JSON.parse(localStorage.getItem('pcshs_achievers') || '[]'); }
function saveAchieversData(data) {
    localStorage.setItem('pcshs_achievers', JSON.stringify(data));
    localStorage.setItem('pcshs_achievers_updated', Date.now().toString());
}

function renderAchievers() {
    const tbody = document.getElementById('achieversTableBody');
    if (!tbody) return;
    const items = getAchievers();
    if (!items.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-row">No achievements added yet.</td></tr>';
        return;
    }
    tbody.innerHTML = items.map(a => `
    <tr>
      <td><strong>${a.title}</strong></td>
      <td><span class="tag tag-blue">${a.cat}</span></td>
      <td>${a.location || '—'}</td>
      <td>${a.date}</td>
      <td>
        <div class="tbl-actions">
          <button class="btn-edit" onclick="editAchiever('${a.id}')" title="Edit"><i class="fas fa-pen"></i></button>
          <button class="btn-del" onclick="deleteItem('achievers','${a.id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openAchieverModal() {
    clearForm(['achTitle', 'achDate', 'achLocation', 'achDesc', 'achAwardees', 'achAdviser', 'achieverEditId']);
    document.getElementById('achCat').value = 'math';
    document.getElementById('achieverModalTitle').textContent = 'Add Achievement';
    openModal('achieverModal');
}

function editAchiever(id) {
    const item = getAchievers().find(a => a.id === id);
    if (!item) return;
    document.getElementById('achieverEditId').value = id;
    document.getElementById('achTitle').value = item.title;
    document.getElementById('achCat').value = item.cat;
    document.getElementById('achDate').value = item.date;
    document.getElementById('achLocation').value = item.location || '';
    document.getElementById('achDesc').value = item.desc;
    document.getElementById('achAwardees').value = item.awardees || '';
    document.getElementById('achAdviser').value = item.adviser || '';
    document.getElementById('achieverModalTitle').textContent = 'Edit Achievement';
    openModal('achieverModal');
}

function saveAchiever(e) {
    e.preventDefault();
    const items = getAchievers();
    const editId = document.getElementById('achieverEditId').value;
    const item = {
        id: editId || 'ac_' + Date.now(),
        title: document.getElementById('achTitle').value.trim(),
        cat: document.getElementById('achCat').value,
        date: document.getElementById('achDate').value.trim(),
        location: document.getElementById('achLocation').value.trim(),
        desc: document.getElementById('achDesc').value.trim(),
        awardees: document.getElementById('achAwardees').value.trim(),
        adviser: document.getElementById('achAdviser').value.trim(),
    };
    if (editId) {
        const idx = items.findIndex(a => a.id === editId);
        if (idx > -1) items[idx] = item;
        logActivity(`Updated achievement: "${item.title}"`);
    } else {
        items.unshift(item);
        logActivity(`Added achievement: "${item.title}"`);
    }
    saveAchieversData(items);
    renderAchievers();
    closeModal('achieverModal');
    showToast('Achievement saved!', 'success');
}


const _origDeleteItem = deleteItem;
window.deleteItem = function (type, id) {
    if (type === 'clubs') {
        confirmDelete(() => {
            const items = getClubs().filter(c => c.id !== id);
            saveClubsData(items);
            renderClubs();
            logActivity('Deleted club');
            showToast('Club deleted.', 'default');
        });
        return;
    }
    if (type === 'achievers') {
        confirmDelete(() => {
            const items = getAchievers().filter(a => a.id !== id);
            saveAchieversData(items);
            renderAchievers();
            logActivity('Deleted achievement');
            showToast('Achievement deleted.', 'default');
        });
        return;
    }
    _origDeleteItem(type, id);
};


const _origShowPanel2 = window.showPanel;
window.showPanel = function (name, linkEl) {
    _origShowPanel2(name, linkEl);
    if (name === 'contacts') renderContacts();
    if (name === 'clubs') renderClubs();
    if (name === 'achievers') renderAchievers();
    const labels = {
        dashboard: 'Dashboard', news: 'News & Announcements', events: 'Events',
        research: 'Research', awards: 'Awards Ticker', alert: 'Alert Banner',
        users: 'User Accounts', applications: 'Applications Inbox',
        contacts: 'Contacts Inbox', clubs: 'Clubs & Organizations', achievers: 'Pascian Achievers'
    };
    document.getElementById('breadcrumb').textContent = labels[name] || name;
};


const _origLaunch2 = window.launchAdmin;
window.launchAdmin = function (user) {
    _origLaunch2(user);
    renderContacts();
    renderClubs();
    renderAchievers();
};

