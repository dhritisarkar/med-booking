# Medical Appointment Booking System 🏥

This project is a Medical Appointment Booking System developed as part of a DBMS course project.
The goal of the project is to demonstrate how relational databases can be used to manage real-world systems such as hospital appointment scheduling.

The system allows administrators to manage patients, doctors, and appointments, while ensuring proper relational integrity using foreign key constraints.

---

## Project Overview

The system manages:

- Patient registration & management
- Doctor records management
- Appointment scheduling between patients and doctors
- Relational mapping between database entities
- Display of structured data through a web interface

It demonstrates how a backend server interacts with a relational database and how frontend components communicate with backend APIs.

---

## Technologies Used

- Node.js: Backend runtime environment
- Express.js: Web server framework for API creation
- MariaDB (MySQL): Relational database managemnet system
- HTML + CSS: Frontened interface
- Git and GitHub: Version control and project collaboration
- JavaScript (Fetch API: Communication with backend APIs

---

## Database Design

The system follows a relational database model with three main entities:

### 1️⃣ Patient
Stores patient information such as:
- Patient ID (Primary Key, Auto Increment)
- Name
- Gender
- Phone Number

### 2️⃣ Doctor
Stores doctor details:
- Doctor ID (Primary Key, Auto Increment)
- Name
Doctors can be dynamically added to the system by the administrator

### 3️⃣ Appointment
Connects patients and doctors using foreign keys:
- Appointment ID (Primary Key. Auto Increment)
- Patient ID (Foreign Key → Patient)
- Doctor ID (Foreign Key → Doctor)
- Appointment Date & Time (DATETIME)

This table creates a many-to-one relationship between appointments and both patients and doctors

This structure ensures:

- Referential integrity
- Elimination of redundancy
- Proper relationship management using foreign keys

---

## Features Implemented

The system currently supports the following features:
1) Patient Management
- Add new patients
- Automatically generated patient IDs
- Display all patients in a table
- Delete a patient with confirmation warning

When a patient is deleted, all assosciated appointments are also removed to maintain database consistency

2) Doctor Management:
- Add new doctors
- View all doctors in a dedicated table
- Doctors are automically available for appointmet booking

3) Appointment Management:
- Book appointments for patients
- Select doctors from a dropdown list
- Choose predefined time slots
- Store appointment date and time usinh DATETIME
- View all appointments in a table
- Delete appointments when required

Appointments display the following:
- Appointment ID
- Patient Name
- Doctor Name
- Date and Time
This information is retreived using SQLJOIN queries.

---

## API Endpoints Implemented

- `GET /doctors` → Retrieve all doctors
- `GET /patients` → Retrieve all patients
- `GET /appointments` → Retrieve appointment details using JOIN
- `POST /add-patient` → Add a new patient
- `POST /add-appointment` → Book a new appointment
- `POST /add-doctor` → Adds a new doctor to the system
- `DELETE /delete-patient/:id` → Delete a patient and their realted appointments
- `DELETE /delete-appointment/:id` → Delete an appointment

---

## User Interface

The system includes a simple web interface designed for clarity and usability.

Key UI features include:
- Structured tables for doctors, pateints and appointments
- Dropdown selection for doctors
- Fixed appointment time slots
- Confirmation alerts for delete operations
- Clean hospital-style UI with a professional baby-blue theme

The UI commicates with the backened using the JavaScript Fetch API

---

## Current Status

The system currently supports the core functionality required for appointment management.

Implememted componenets include:
- Database schema design
- Foreign key relationships
- SQLJOIN queries
- Backend API development
- Frontend integration
- Doctor management
- Patient management
- Appointment scheduling
- Delete operations with relational consistency
- Improved UI design

The application demonstrates full interaction between frontend, backend and database layers

---

## Future Enhancements 🚧

Possible improvements include:

- Patient search functionality
- Editing patient and doctor records
- Authentication for administrators

---

## Contributors

- Dhriti Sarkar
- Heer Patel
