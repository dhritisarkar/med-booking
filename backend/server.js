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

// Future APIs to be implemented:
// POST /add-patient
// GET /doctors
// POST /add-appointment
// GET /appointments
