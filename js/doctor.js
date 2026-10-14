// ACCOUNTS DATA
const doctorAccounts = {
    "sarah": { name: "Dr. Sarah Jenkins", pass: "jenkins123" },
    "rahul": { name: "Dr. Rahul Patel", pass: "patel123" }
};

let activeNoteAppointmentId = null;

// THEME TOGGLE
const themeBtn = document.getElementById('themeToggle');
themeBtn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    setTheme(cur === 'dark' ? 'light' : 'dark');
});

function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    themeBtn.innerText = t === 'dark' ? '☀️ Light' : '🌙 Dark';
    localStorage.setItem('carepoint_theme', t);
}

window.addEventListener('DOMContentLoaded', () => {
    setTheme(localStorage.getItem('carepoint_theme') || 'light');
    checkSession();
});

// SESSION CHECK
function checkSession() {
    const loggedDoc = localStorage.getItem('carepoint_logged_doctor');
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loggedDoc && doctorAccounts[loggedDoc]) {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        logoutBtn.style.display = 'inline-block';
        
        const docObj = doctorAccounts[loggedDoc];
        document.getElementById('doctorTitle').innerText = `${docObj.name}'s Dashboard`;
        document.getElementById('welcomeText').innerText = `Viewing appointments specifically assigned to ${docObj.name}`;
        
        loadDashboard(docObj.name);
    } else {
        loginSection.style.display = 'block';
        dashboardSection.style.display = 'none';
        logoutBtn.style.display = 'none';
    }
}

// LOGIN SUBMIT
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('username').value.trim().toLowerCase();
    const pass = document.getElementById('password').value.trim();

    if (doctorAccounts[user] && doctorAccounts[user].pass === pass) {
        document.getElementById('loginError').style.display = 'none';
        localStorage.setItem('carepoint_logged_doctor', user);
        checkSession();
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
});

function quickLogin(user, pass) {
    document.getElementById('username').value = user;
    document.getElementById('password').value = pass;
    localStorage.setItem('carepoint_logged_doctor', user);
    checkSession();
}

function logoutDoctor() {
    localStorage.removeItem('carepoint_logged_doctor');
    checkSession();
}

// DASHBOARD FILTER BY LOGGED DOCTOR
function loadDashboard(docName) {
    let appointments = JSON.parse(localStorage.getItem('carepoint_appointments')) || [];
    
    // Filter to only show assigned doctor's appointments
    const assignedApps = appointments.filter(a => a.doctor === docName);

    document.getElementById('statTotal').innerText = assignedApps.length;
    document.getElementById('statPending').innerText = assignedApps.filter(a => a.status === 'Pending').length;
    document.getElementById('statCompleted').innerText = assignedApps.filter(a => a.status === 'Completed').length;
    document.getElementById('statCancelled').innerText = assignedApps.filter(a => a.status === 'Cancelled').length;

    renderTable(assignedApps);
}

function renderTable(list) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    if (list.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 20px; color: var(--text-muted);">No appointments found for this doctor.</td></tr>`;
        return;
    }

    list.forEach(app => {
        const tr = document.createElement('tr');
        let statusClass = 'status-pending';
        if (app.status === 'Completed') statusClass = 'status-completed';
        if (app.status === 'Cancelled') statusClass = 'status-cancelled';

        tr.innerHTML = `
            <td><strong>${escapeHTML(app.name)}</strong></td>
            <td>${app.age}</td>
            <td>${escapeHTML(app.phone)}</td>
            <td>${escapeHTML(app.doctor)}</td>
            <td>${app.date}<br><small style="color:var(--text-muted);">${app.time}</small></td>
            <td><span class="status ${statusClass}">${app.status}</span></td>
            <td><span style="font-style:italic; font-size:12px; color:var(--text-muted);">${escapeHTML(app.notes || 'No notes')}</span></td>
            <td>
                <button class="action-btn btn-complete" onclick="changeStatus(${app.id}, 'Completed')">Complete</button>
                <button class="action-btn btn-cancel" onclick="changeStatus(${app.id}, 'Cancelled')">Cancel</button>
                <button class="action-btn btn-notes" onclick="openNotesModal(${app.id})">Notes</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function changeStatus(id, newStatus) {
    let appointments = JSON.parse(localStorage.getItem('carepoint_appointments')) || [];
    appointments = appointments.map(app => {
        if (app.id === id) app.status = newStatus;
        return app;
    });
    localStorage.setItem('carepoint_appointments', JSON.stringify(appointments));
    
    const loggedKey = localStorage.getItem('carepoint_logged_doctor');
    loadDashboard(doctorAccounts[loggedKey].name);
}

function filterAppointments() {
    const loggedKey = localStorage.getItem('carepoint_logged_doctor');
    if (!loggedKey) return;

    const docName = doctorAccounts[loggedKey].name;
    const searchVal = document.getElementById('searchInput').value.toLowerCase();
    const statusVal = document.getElementById('statusFilter').value;

    let appointments = JSON.parse(localStorage.getItem('carepoint_appointments')) || [];
    let assigned = appointments.filter(a => a.doctor === docName);

    const filtered = assigned.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchVal) || app.phone.includes(searchVal);
        const matchesStatus = (statusVal === 'ALL') || (app.status === statusVal);
        return matchesSearch && matchesStatus;
    });

    renderTable(filtered);
}

// NOTES MODAL LOGIC
function openNotesModal(id) {
    activeNoteAppointmentId = id;
    let appointments = JSON.parse(localStorage.getItem('carepoint_appointments')) || [];
    const target = appointments.find(a => a.id === id);

    if (target) {
        document.getElementById('modalPatientInfo').innerText = `Patient: ${target.name} | Doctor: ${target.doctor}`;
        document.getElementById('notesInput').value = target.notes || '';
        document.getElementById('notesModal').style.display = 'flex';
    }
}

function closeModal() {
    document.getElementById('notesModal').style.display = 'none';
    activeNoteAppointmentId = null;
}

function saveNotes() {
    if (!activeNoteAppointmentId) return;
    const notesVal = document.getElementById('notesInput').value.trim();
    let appointments = JSON.parse(localStorage.getItem('carepoint_appointments')) || [];

    appointments = appointments.map(app => {
        if (app.id === activeNoteAppointmentId) app.notes = notesVal;
        return app;
    });

    localStorage.setItem('carepoint_appointments', JSON.stringify(appointments));
    closeModal();
    
    const loggedKey = localStorage.getItem('carepoint_logged_doctor');
    loadDashboard(doctorAccounts[loggedKey].name);
}

// DEMO DATA SEEDING
function seedSampleData() {
    const sample = [
        { id: 201, name: "Alice Freeman", age: 32, phone: "9876543210", doctor: "Dr. Sarah Jenkins", date: "2026-10-15", time: "10:00", status: "Pending", notes: "Routine health checkup" },
        { id: 202, name: "Mark Miller", age: 45, phone: "9812345678", doctor: "Dr. Sarah Jenkins", date: "2026-10-15", time: "11:30", status: "Completed", notes: "Prescribed anti-allergy medication" },
        { id: 203, name: "Tommy Vance", age: 6, phone: "9988776655", doctor: "Dr. Rahul Patel", date: "2026-10-16", time: "16:00", status: "Pending", notes: "Child vaccination visit" }
    ];

    localStorage.setItem('carepoint_appointments', JSON.stringify(sample));
    const loggedKey = localStorage.getItem('carepoint_logged_doctor');
    loadDashboard(doctorAccounts[loggedKey].name);
    alert("Sample appointments successfully loaded!");
}

function escapeHTML(str) {
    return String(str || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}