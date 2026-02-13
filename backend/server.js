const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Get all patients
app.get("/patients", (req, res) => {
  const sql = "SELECT * FROM Patient";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(results);
    }
  });
});


// Add a new patient
app.post("/add-patient", (req, res) => {
  const { name, gender, phone } = req.body;

  const sql = "INSERT INTO Patient (name, gender, phone) VALUES (?, ?, ?)";
  db.query(sql, [name, gender, phone], (err) => {
    if (err) {
      res.status(500).json({ error: "Failed to add patient" });
    } else {
      res.json({ message: "Patient added successfully" });
    }
  });
});


// Get all doctors
app.get("/doctors", (req, res) => {
  const sql = "SELECT * FROM Doctor";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(results);
    }
  });
});

// Add new appointment
app.post("/add-appointment", (req, res) => {
  const { patient_id, doctor_id, appointment_date } = req.body;

  const sql = "INSERT INTO Appointment (patient_id, doctor_id, appointment_date) VALUES (?, ?, ?)";
  
  db.query(sql, [patient_id, doctor_id, appointment_date], (err) => {
    if (err) {
      res.status(500).json({ error: "Failed to create appointment" });
    } else {
      res.json({ message: "Appointment created successfully" });
    }
  });
});


// Get all appointments with patient and doctor names
app.get("/appointments", (req, res) => {
  const sql = `
    SELECT 
      Appointment.appointment_id,
      Patient.name AS patient_name,
      Doctor.name AS doctor_name,
      Appointment.appointment_date
    FROM Appointment
    JOIN Patient ON Appointment.patient_id = Patient.patient_id
    JOIN Doctor ON Appointment.doctor_id = Doctor.doctor_id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(results);
    }
  });
});
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

app.get('/', (req, res) => {
    res.send("Med Booking Backend Running");
});

// Upcoming work:
// - Appointment creation
// - Appointment listing with joins
// - Frontend integration
