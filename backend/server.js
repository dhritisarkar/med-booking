const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ================= DATABASE CONNECTION =================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "StrongPassword123",   // ← change if needed
    database: "clinic_db1"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

// ================= GET DOCTORS =================
app.get("/doctors", (req, res) => {
    db.query("SELECT * FROM Doctor", (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
});

// ================= GET PATIENTS =================
app.get("/patients", (req, res) => {
    db.query("SELECT * FROM Patient", (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
});

// ================= GET APPOINTMENTS (WITH JOIN) =================
app.get("/appointments", (req, res) => {

    const sql = `
        SELECT
            a.appointment_id,
            p.name AS patient_name,
            d.name AS doctor_name,
            a.appointment_date
        FROM Appointment a
        JOIN Patient p ON a.patient_id = p.patient_id
        JOIN Doctor d ON a.doctor_id = d.doctor_id
    `;

    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
});

// ================= ADD PATIENT =================
app.post("/add-patient", (req, res) => {

    const { name, gender, phone } = req.body;

    const sql = "INSERT INTO Patient (name, gender, phone) VALUES (?, ?, ?)";

    db.query(sql, [name, gender, phone], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send("Patient added successfully");
        }
    });
});

// ================= ADD APPOINTMENT =================
app.post("/add-appointment", (req, res) => {

    const { patient_id, doctor_id, appointment_date } = req.body;

    const sql = `
        INSERT INTO Appointment (patient_id, doctor_id, appointment_date)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [patient_id, doctor_id, appointment_date], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send("Appointment booked successfully");
        }
    });
});

// ================= DELETE APPOINTMENT =================
app.delete("/delete-appointment/:id", (req, res) => {

    const appointmentId = req.params.id;

    const sql = "DELETE FROM Appointment WHERE appointment_id = ?";

    db.query(sql, [appointmentId], (err, result) => {
        if (err) {
            res.status(500).send("Error deleting appointment");
        } else {
            res.send("Appointment deleted successfully");
        }
    });
});

// ================= DELETE PATIENT =================
app.delete("/delete-patient/:id", (req, res) => {

    const patientId = req.params.id;

    const sql = "DELETE FROM Patient WHERE patient_id = ?";

    db.query(sql, [patientId], (err, result) => {
        if (err) {
            res.status(500).send("Error deleting patient");
        } else {
            res.send("Patient and related appointments deleted successfully");
        }
    });
});

// ================= START SERVER =================
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});