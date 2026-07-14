CREATE DATABASE IF NOT EXISTS clinic_db1;
USE clinic_db1;

-- ==========================
-- Patient Table
-- ==========================
CREATE TABLE Patient (
                         patient_id INT AUTO_INCREMENT PRIMARY KEY,
                         name VARCHAR(100) NOT NULL,
                         gender ENUM('Male','Female','Other') NOT NULL,
                         phone VARCHAR(10) NOT NULL UNIQUE
);

-- ==========================
-- Doctor Table
-- ==========================
CREATE TABLE Doctor (
                        doctor_id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(100) NOT NULL
);

-- ==========================
-- Appointment Table
-- ==========================
CREATE TABLE Appointment (

                             appointment_id INT AUTO_INCREMENT PRIMARY KEY,

                             patient_id INT NOT NULL,
                             doctor_id INT NOT NULL,

                             appointment_date DATETIME NOT NULL,

                             CONSTRAINT fk_patient
                                 FOREIGN KEY (patient_id)
                                     REFERENCES Patient(patient_id)
                                     ON DELETE CASCADE
                                     ON UPDATE CASCADE,

                             CONSTRAINT fk_doctor
                                 FOREIGN KEY (doctor_id)
                                     REFERENCES Doctor(doctor_id)
                                     ON DELETE CASCADE
                                     ON UPDATE CASCADE,

                             CONSTRAINT unique_doctor_slot
                                 UNIQUE (doctor_id, appointment_date)
);