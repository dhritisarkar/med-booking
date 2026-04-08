const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "StrongPassword123",
    database: "clinic_db1"
});

db.connect(err => {
    if (err) console.log(err);
    else console.log("Connected to MySQL");
});

// ================= GET =================

app.get("/patients", (req, res) => {
    const search = req.query.search || "";

    const sql = `
        SELECT * FROM Patient
        WHERE name LIKE ? OR phone LIKE ?
    `;

    db.query(sql, [`%${search}%`, `%${search}%`], (err, result) => {
        if (err) res.status(500).send(err);
        else res.json(result);
    });
});

app.get("/doctors", (req, res) => {
    db.query("SELECT * FROM Doctor", (err, result) => {
        if (err) res.status(500).send(err);
        else res.json(result);
    });
});

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
        if (err) res.status(500).send(err);
        else res.json(result);
    });
});

// ================= ADD =================

app.post("/add-patient", (req, res) => {
    const { name, gender, phone } = req.body;

    db.query(
        "INSERT INTO Patient (name, gender, phone) VALUES (?, ?, ?)",
        [name, gender, phone],
        err => err ? res.status(500).send(err) : res.send("Added")
    );
});

app.post("/add-doctor", (req, res) => {
    const { name } = req.body;

    db.query(
        "INSERT INTO Doctor (name) VALUES (?)",
        [name],
        err => err ? res.status(500).send(err) : res.send("Added")
    );
});

app.post("/add-appointment", (req, res) => {
    const { patient_id, doctor_id, appointment_date } = req.body;

    db.query(
        "INSERT INTO Appointment (patient_id, doctor_id, appointment_date) VALUES (?, ?, ?)",
        [patient_id, doctor_id, appointment_date],
        err => err ? res.status(500).send(err) : res.send("Added")
    );
});

// ================= UPDATE =================

app.put("/update-patient/:id", (req, res) => {
    const { name, gender, phone } = req.body;
    const id = req.params.id;

    db.query(
        "UPDATE Patient SET name=?, gender=?, phone=? WHERE patient_id=?",
        [name, gender, phone, id],
        err => err ? res.status(500).send(err) : res.send("Updated")
    );
});

app.put("/update-doctor/:id", (req, res) => {
    const { name } = req.body;
    const id = req.params.id;

    db.query(
        "UPDATE Doctor SET name=? WHERE doctor_id=?",
        [name, id],
        err => err ? res.status(500).send(err) : res.send("Updated")
    );
});

// ================= DELETE =================

app.delete("/delete-patient/:id", (req, res) => {
    db.query(
        "DELETE FROM Patient WHERE patient_id=?",
        [req.params.id],
        err => err ? res.status(500).send(err) : res.send("Deleted")
    );
});

app.delete("/delete-appointment/:id", (req, res) => {
    db.query(
        "DELETE FROM Appointment WHERE appointment_id=?",
        [req.params.id],
        err => err ? res.status(500).send(err) : res.send("Deleted")
    );
});


// ================= START =================

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});