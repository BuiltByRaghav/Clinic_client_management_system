# CarePoint Clinic — Local Clinic Management System 🏥

A lightweight, modern, and fully self-contained **Local Clinic Management System** web application developed using vanilla web technologies. Built with a sleek **Liquid Glass UI (Glassmorphism)**, real-time `localStorage` data persistence, multi-doctor portal authentication, and responsive theme toggling.

---

## 📌 Project Overview

**CarePoint Clinic** provides an end-to-end workflow for both patients and medical staff:
1. **Patients** can explore clinic services, review specialist doctor profiles and consultation statistics, and book appointments online.
2. **Doctors** can log into their dedicated portal to manage patient appointments, track metrics, update booking statuses, and record clinical diagnosis notes.

> **Academic Context**: Developed as a 2nd-year Engineering Web Development Project using pure vanilla web standards without external libraries, backends, or frameworks.

---

## 🗂️ Project File Structure

```text
clinic-management/
│
├── index.html          # Patient Landing Page
├── registration.html   # Patient Appointment Booking Form
├── doctor.html        # Doctor Login & Portal Dashboard
│
├── css/
│   ├── style.css       # Landing page styles & Liquid Glass UI system
│   ├── registration.css# Appointment registration styling
│   └── doctor.css      # Doctor portal & dashboard table styling
│
└── js/
    ├── index.js        # Landing page animations, modal & smooth scroll logic
    ├── registration.js # Appointment form handling & localStorage saving
    └── doctor.js       # Doctor auth, session management, table filters & notes
