const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = require("./db");

/* ===========================
   GET ROUTES
=========================== */

app.get("/doctors", (req, res) => {

    db.query("SELECT * FROM Doctor", (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json(result);

    });

});

app.get("/patients", (req, res) => {

    const search = req.query.search || "";

    db.query(
        "SELECT * FROM Patient WHERE name LIKE ?",
        [`%${search}%`],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
            }

            res.json(result);

        }
    );

});

app.get("/appointments", (req, res) => {

    db.query(
        `
        SELECT
            a.appointment_id,
            p.name AS patient_name,
            d.name AS doctor_name,
            a.appointment_date
        FROM Appointment a
        JOIN Patient p
            ON a.patient_id = p.patient_id
        JOIN Doctor d
            ON a.doctor_id = d.doctor_id
        `,
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
            }

            res.json(result);

        }
    );

});

/* ===========================
   ADD ROUTES
=========================== */

app.post("/add-patient", (req, res) => {

    const { name, gender, phone } = req.body;

    db.query(
        "INSERT INTO Patient (name, gender, phone) VALUES (?, ?, ?)",
        [name, gender, phone],
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Failed to add patient");
            }

            res.send("Patient added successfully");

        }
    );

});

app.post("/add-doctor", (req, res) => {

    db.query(
        "INSERT INTO Doctor (name) VALUES (?)",
        [req.body.name],
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Failed to add doctor");
            }

            res.send("Doctor added successfully");

        }
    );

});

/* ===========================
   APPOINTMENT CONFLICT CHECK
=========================== */

app.post("/add-appointment", (req, res) => {

    const {
        patient_id,
        doctor_id,
        appointment_date
    } = req.body;

    db.query(
        "SELECT * FROM Appointment WHERE doctor_id = ? AND appointment_date = ?",
        [doctor_id, appointment_date],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Database error");
            }

            if (result.length > 0) {
                return res.status(400).send("Conflict");
            }

            db.query(
                "INSERT INTO Appointment (patient_id, doctor_id, appointment_date) VALUES (?, ?, ?)",
                [patient_id, doctor_id, appointment_date],
                (err) => {

                    if (err) {
                        console.error(err);
                        return res.status(500).send("Failed to create appointment");
                    }

                    res.send("Appointment added successfully");

                }
            );

        }
    );

});

/* ===========================
   UPDATE
=========================== */

app.put("/update-doctor/:id", (req, res) => {

    db.query(
        "UPDATE Doctor SET name = ? WHERE doctor_id = ?",
        [req.body.name, req.params.id],
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Update failed");
            }

            res.send("Doctor updated successfully");

        }
    );

});

/* ===========================
   DELETE PATIENT
=========================== */

app.delete("/delete-patient/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM Appointment WHERE patient_id = ?",
        [id],
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Failed deleting appointments");
            }

            db.query(
                "DELETE FROM Patient WHERE patient_id = ?",
                [id],
                (err) => {

                    if (err) {
                        console.error(err);
                        return res.status(500).send("Failed deleting patient");
                    }

                    res.send("Patient deleted successfully");

                }
            );

        }
    );

});

/* ===========================
   DELETE APPOINTMENT
=========================== */

app.delete("/delete-appointment/:id", (req, res) => {

    db.query(
        "DELETE FROM Appointment WHERE appointment_id = ?",
        [req.params.id],
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Delete failed");
            }

            res.send("Appointment deleted successfully");

        }
    );

});

/* ===========================
   DELETE DOCTOR
=========================== */

app.delete("/delete-doctor/:id", (req, res) => {

    const id = parseInt(req.params.id);

    db.query(
        "DELETE FROM Appointment WHERE doctor_id = ?",
        [id],
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Failed deleting appointments");
            }

            db.query(
                "DELETE FROM Doctor WHERE doctor_id = ?",
                [id],
                (err, result) => {

                    if (err) {
                        console.error(err);
                        return res.status(500).send("Failed deleting doctor");
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).send("Doctor not found");
                    }

                    res.send("Doctor deleted successfully");

                }
            );

        }
    );

});

/* ===========================
   START SERVER
=========================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});