# Clinic Management System

A full-stack Clinic Management System built using **Node.js, Express.js, MariaDB, HTML, CSS, and JavaScript**.

The application provides a simple administrative interface for managing doctors, patients, and appointments while demonstrating the use of relational databases, RESTful APIs, and frontend-backend integration.

---

## Features

### Doctor Management
- Add new doctors
- Edit doctor details
- Delete doctors
- Input validation for doctor names
- Automatic dashboard updates

### Patient Management
- Add new patients
- Delete patients
- Real-time patient search
- Phone number validation
- Automatic cascading deletion of related appointments

### Appointment Management
- Book appointments
- Doctor and patient dropdown selection
- Fixed appointment time slots
- Prevent duplicate appointment bookings
- Delete appointments
- Display appointments using SQL JOIN queries

### Dashboard
- Total Doctors
- Total Patients
- Total Appointments
- Today's Date
- Today's Appointment Count

### Authentication
Login page with client-side session state (localStorage). Note: this is a demo-appropriate implementation — a production version would use server-side sessions or JWT with httpOnly cookies.

### User Experience
- Responsive dashboard layout
- Tab-based navigation
- Toast notifications
- Confirmation dialogs before deletion
- Clean hospital-inspired user interface

---

# Technologies Used

| Layer | Technology |
|--------|------------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | MariaDB (MySQL) |
| API Communication | Fetch API |
| Version Control | Git & GitHub |

---

# Project Structure

```text
Clinic-Management-System/

backend/
frontend/
database/
diagrams/
docs/
screenshots/

README.md
```

---

# Database Design

The database follows a relational model consisting of three entities.

## Patient

- patient_id (Primary Key)
- name
- gender
- phone

## Doctor

- doctor_id (Primary Key)
- name

## Appointment

- appointment_id (Primary Key)
- patient_id (Foreign Key)
- doctor_id (Foreign Key)
- appointment_date

The Appointment table establishes the relationship between doctors and patients while maintaining referential integrity using foreign keys.

---

# REST API Endpoints

| Method | Endpoint | Description |
|----------|----------|-------------|
| POST | /login | Administrator Login |
| GET | /doctors | Retrieve all doctors |
| GET | /patients | Retrieve all patients |
| GET | /appointments | Retrieve all appointments |
| GET | /stats | Dashboard statistics |
| POST | /add-doctor | Add a doctor |
| POST | /add-patient | Add a patient |
| POST | /add-appointment | Book an appointment |
| PUT | /update-doctor/:id | Update doctor |
| DELETE | /delete-doctor/:id | Delete doctor |
| DELETE | /delete-patient/:id | Delete patient |
| DELETE | /delete-appointment/:id | Delete appointment |

---

# User Interface

The frontend provides a clean administrative dashboard for managing clinic operations.

Key interface features include:

- Dashboard statistics cards
- Doctor management panel
- Patient management panel
- Appointment scheduling panel
- Real-time patient search
- Dropdown-based appointment booking
- Toast notifications
- Delete confirmation dialogs
- Responsive card-based layout

Frontend components communicate with the backend using the JavaScript Fetch API.

---

# Architecture

The overall system architecture is available in:

```
diagrams/architecture.png
```

---

# Entity Relationship Diagram

The database schema is documented in:

```
diagrams/er_diagram.png
```

---

# Screenshots

Representative screenshots of the application are available in the **screenshots/** directory.

Included screenshots:

- Login Page
- Dashboard
- Doctor Management
- Patient Management
- Appointment Management

---

# Installation

Clone the repository:

```bash
git clone https://github.com/dhritisarkar/med-booking.git
```

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file using `.env.example`.

Start the server:

```bash
node server.js
```

Open `frontend/login.html` in your browser.

---

# Future Enhancements

Potential improvements include:

- Role-Based Access Control (RBAC)
- Appointment editing
- Doctor specialization support
- Patient history management
- Email/SMS appointment reminders
- Calendar integration
- Advanced dashboard analytics
- Docker deployment
- Unit and integration testing

---

# Documentation

Additional project documentation is available in:

```
docs/Project_Report.pdf
```

---

# Contributors

- Dhriti Sarkar
- Heer Patel

---

# License

This project is released under the MIT License.
