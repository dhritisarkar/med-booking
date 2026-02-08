const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

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

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
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

// Upcoming work:
// - Doctor APIs
// - Appointment creation
// - Appointment listing with joins
// - Frontend integration
