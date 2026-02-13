# Medical Appointment Booking System 🏥

This project is a Medical Appointment Booking System developed as part of a DBMS course project.  
The objective of this project is to understand relational database design, foreign key relationships, and backend API development using a real-world use case.

---

## Project Overview

The system manages:

- Patient records
- Doctor information
- Appointment scheduling with time slots
- Relational mapping between patients and doctors

It demonstrates how a backend server interacts with a relational database and how frontend components communicate with backend APIs.

---

## Technologies Used

- Node.js
- Express.js
- MariaDB (MySQL)
- HTML (Frontend)
- Git and GitHub

---

## Database Design

The system follows a relational database model with three main entities:

### 1️⃣ Patient
Stores patient information such as:
- Patient ID (Primary Key)
- Name
- Gender
- Phone Number

### 2️⃣ Doctor
Stores doctor details:
- Doctor ID (Primary Key)
- Name

### 3️⃣ Appointment
Connects patients and doctors using foreign keys:
- Appointment ID (Primary Key)
- Patient ID (Foreign Key → Patient)
- Doctor ID (Foreign Key → Doctor)
- Appointment Date & Time (DATETIME)

This structure ensures:

- Referential integrity
- Elimination of redundancy
- Proper relationship management using foreign keys

---

## Features Implemented

- Add new patients
- View all patients (tabular format)
- View all doctors
- Book appointments with fixed time slots
- View all appointments with patient and doctor names
- SQL JOIN queries to fetch relational data
- Basic frontend validation
- Backend and database connectivity established

Appointments are stored using the `DATETIME` data type to support structured scheduling with specific time slots.

---

## API Endpoints Implemented

- `GET /doctors` → Retrieve all doctors
- `GET /patients` → Retrieve all patients
- `GET /appointments` → Retrieve appointment details using JOIN
- `POST /add-patient` → Add a new patient
- `POST /add-appointment` → Book a new appointment

---

## Current Status

- Database schema fully defined
- Foreign key relationships implemented
- JOIN queries implemented
- Backend APIs functional
- Frontend integrated with backend
- Tabular display of patients and appointments
- Structured appointment scheduling with time slots

The system currently supports core CRUD operations required for appointment management.

---

## Future Enhancements 🚧

Possible improvements include:

- Delete and update operations
- Advanced validations
- Conflict checking for time slots
- Improved UI styling
- Extended reporting features

---

## Contributors

- Dhriti Sarkar
- Heer Patel
