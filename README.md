# EduDash | Management Suite

A specialized internal platform (PWA) designed to bridge the gap between educational administration and teaching staff. TutorFlow transforms chaotic school operations into a streamlined, digital workflow.

## 🌟 The Vision
The core mission of TutorFlow is to maximize operational efficiency by centralizing room allocation, scheduling, and automated reporting. By replacing fragmented communication (like WhatsApp or paper logs), we ensure a "single source of truth" for the entire institution.

## 🛠 Tech Stack
* **Design:** Figma
* **Frontend:** React.js + SASS (SCSS)
* **Backend:** Node.js
* **Database & Auth:** Supabase (PostgreSQL)
* **Hosting:** Vercel
* **Approach:** Mobile-First, Progressive Web App (PWA)

---

## 📅 Roadmap & Progress

### ✅ Phase 1: Strategy & Logic (Completed)
We’ve laid the groundwork by defining the business core:
* **Conflict Resolution:** Engineered the logic to eliminate room double-bookings.
* **User Intent Mapping:** Tailored the UI for Tutors (quick 10-second lesson confirmation) and Admins (high-level scheduling & payroll).
* **Information Architecture:** mapped the entire secure system flow, from dashboard notifications to financial summaries.
* **Efficiency KPIs:** Set clear targets for reducing "Admin Time" and reaching a zero-error rate in scheduling.

### 🚧 Phase 2: System Architecture (In Progress)
Currently building the technical skeleton:
* Designing the **ERD (Entity Relationship Diagram)** for Supabase.
* Drafting the **API Documentation** and system endpoints.
* Prototyping high-fidelity interfaces in **Figma**.

### 🚀 Phase 3: Core Development (Upcoming)
* Implementing live database models.
* Integrating the React frontend with the Supabase/Node.js backend.
* Deploying the automated payroll and reporting engine.

---

## 💡 Key Features (User Experience)
* **10-Second Check-ins:** Tutors can confirm lesson completion with a single tap on their mobile device.
* **Visual Building Map:** Color-coded room management for instant navigation within the facility.
* **Availability Engine:** A dedicated module for teachers to declare their working hours, which the system then uses to suggest the best schedule.
* **Automated Payroll:** One-click report generation for administrators to process monthly payouts based on verified attendance.
