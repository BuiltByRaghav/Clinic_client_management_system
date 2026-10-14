// THEME RESTORE & TOGGLE
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
});

// SUBMIT APPOINTMENT
document.getElementById('appointmentForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const newAppointment = {
        id: Date.now(),
        name: document.getElementById('patientName').value.trim(),
        age: document.getElementById('patientAge').value,
        phone: document.getElementById('patientPhone').value.trim(),
        doctor: document.getElementById('doctorName').value,
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        status: 'Pending',
        notes: ''
    };

    let appointments = JSON.parse(localStorage.getItem('carepoint_appointments')) || [];
    appointments.push(newAppointment);
    localStorage.setItem('carepoint_appointments', JSON.stringify(appointments));

    alert(`Appointment successfully booked with ${newAppointment.doctor}!`);
    window.location.href = 'index.html';
});