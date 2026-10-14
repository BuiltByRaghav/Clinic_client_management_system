// DOCTOR HARDCODED DATA
const doctorProfiles = {
    sarah: {
        name: "Dr. Sarah Jenkins",
        title: "Senior General Physician",
        degrees: "MBBS, MD (General Medicine)",
        exp: "10+ Years",
        attended: "3,420+",
        rating: "4.9 / 5.0",
        timing: "Mon - Fri (09:00 AM - 02:00 PM)",
        about: "Dr. Sarah specializes in internal medicine, lifestyle disorders, preventative healthcare, and long-term diagnostic treatment."
    },
    rahul: {
        name: "Dr. Rahul Patel",
        title: "Senior Pediatric Specialist",
        degrees: "MBBS, DCH (Pediatrics)",
        exp: "8+ Years",
        attended: "2,150+",
        rating: "4.8 / 5.0",
        timing: "Mon - Sat (03:00 PM - 08:00 PM)",
        about: "Dr. Rahul is dedicated to child healthcare, growth monitoring, adolescent wellness, and routine pediatric immunizations."
    }
};

// THEME TOGGLE LOGIC
document.getElementById('themeToggle').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeToggle').innerText = '☀️ Light';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById('themeToggle').innerText = '🌙 Dark';
    }
    localStorage.setItem('carepoint_theme', theme);
}

// RESTORE SAVED THEME
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('carepoint_theme') || 'light';
    setTheme(savedTheme);
    initScrollAnimations();
});

// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15 });

        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        animatedElements.forEach(el => el.classList.add('visible'));
    }
}

// MODAL OPEN / CLOSE
function openDoctorModal(docKey) {
    const doc = doctorProfiles[docKey];
    if (!doc) return;

    const contentHTML = `
        <h2 style="color: var(--primary-color); font-size: 22px;">${doc.name}</h2>
        <p style="font-weight: bold; color: var(--text-muted);">${doc.title} (${doc.degrees})</p>
        <p style="margin-top: 10px; font-size: 14px;">${doc.about}</p>
        
        <div class="modal-stats">
            <div class="stat-box">
                <div class="stat-val">${doc.attended}</div>
                <div class="stat-lbl">Patients Attended</div>
            </div>
            <div class="stat-box">
                <div class="stat-val">${doc.exp}</div>
                <div class="stat-lbl">Experience</div>
            </div>
            <div class="stat-box">
                <div class="stat-val">${doc.rating}</div>
                <div class="stat-lbl">Patient Rating</div>
            </div>
            <div class="stat-box">
                <div class="stat-val">100%</div>
                <div class="stat-lbl">Verified Specialist</div>
            </div>
        </div>

        <p style="font-size: 13px; color: var(--text-muted);"><strong>Available Hours:</strong> ${doc.timing}</p>
        <div style="margin-top: 20px; text-align: right;">
            <a href="registration.html" class="btn-primary">Book Appointment with ${doc.name.split(' ')[1]}</a>
        </div>
    `;

    document.getElementById('modalDoctorContent').innerHTML = contentHTML;
    document.getElementById('doctorModal').style.display = 'flex';
}

function closeDoctorModal() {
    document.getElementById('doctorModal').style.display = 'none';
}

// Close modal when clicking outside content
window.addEventListener('click', (e) => {
    const modal = document.getElementById('doctorModal');
    if (e.target === modal) {
        closeDoctorModal();
    }
});