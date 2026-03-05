# EduDash Management System

A professional, internal School Management System (SMS) designed for private tutors and educational centers. [cite_start]This platform optimizes operational efficiency by centralizing room scheduling, attendance tracking, and payroll automation[cite: 4, 7].

## 🚀 Project Status: Sprint 1 Completed
The project is being developed in a sprint-based approach to ensure high-quality delivery and business alignment.

### ✅ Completed: Sprint 1 (Foundation & Specification)
In this phase, we defined the core business logic and system requirements:
* [cite_start]**Business Goal**: Eliminating "double-booking" of rooms and replacing manual reporting with a standardized digital system[cite: 6, 7].
* [cite_start]**User Personas**: Tailored experiences for **Tutors** (mobile-first lesson confirmation) and **Administrators** (global schedule management and payroll reporting)[cite: 10, 14].
* [cite_start]**Architecture Planning**: Defined the Information Architecture (IA) and a secure sitemap including dashboards, schedules, and financial summaries[cite: 43, 46, 47].
* [cite_start]**Core Requirements**: Implementation of a conflict-resolution algorithm to block overlapping room assignments and a module for tutor availability declarations[cite: 62, 64].

### 🛠️ In Progress: Sprint 2 (Architecture & System Design)
We are currently setting up the technical foundation:
* Designing the system architecture and data models (ERD).
* Configuring the repository and project scaffolding.
* Designing the UI/UX in **Figma**.

### ⏳ Upcoming: Sprint 3 (Core Implementation)
* Database implementation and API endpoint development.
* Building the frontend interface and integrating it with the backend.
* Deploying the key business logic for lesson realization.

---

## 💻 Tech Stack
The application is built using modern, scalable technologies:

* **Design**: Figma
* **Frontend**: React.js, HTML5, CSS3, SASS (SCSS)
* **Backend**: Node.js
* **Database & Auth**: Supabase
* **Hosting & Deployment**: Vercel
* **Language**: JavaScript

---

## 📱 How it Works (Product Concept)
[cite_start]The application operates as a **Progressive Web App (PWA)** to ensure a mobile-first experience for tutors working on the go[cite: 67, 68].

1.  [cite_start]**For Administrators**: Access a "bird's eye view" of all rooms and teachers to organize the schedule without conflicts[cite: 15, 50]. [cite_start]At the end of the month, the system generates automated reports for teacher payouts[cite: 16, 53].
2.  [cite_start]**For Tutors**: A clean dashboard shows their daily schedule and assigned rooms[cite: 11, 46]. [cite_start]With "one-tap" actions, they can confirm attendance in 10 seconds to ensure accurate payment[cite: 12, 56].
3.  [cite_start]**Efficiency**: Features include color-coded rooms for faster navigation and automated push notifications for daily reminders[cite: 55, 57].
