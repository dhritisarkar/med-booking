require("dotenv").config();

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const db = require("./db");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

/* =========================
   LOGIN
========================= */

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    const passwordBuf = Buffer.from(password || "");
    const adminPasswordBuf = Buffer.from(process.env.ADMIN_PASSWORD);

    const passwordMatches =
        passwordBuf.length === adminPasswordBuf.length &&
        crypto.timingSafeEqual(passwordBuf, adminPasswordBuf);

    if (
        username === process.env.ADMIN_USERNAME &&
        passwordMatches
    ) {

        return res.json({
            success: true,
            message: "Login successful"
        });

    }

    return res.status(401).json({
        success: false,
        message: "Invalid username or password"
    });

});

/* ===========================
   GET DOCTORS
=========================== */
app.get("/doctors", (req, res) => {

    db.query("SELECT * FROM Doctor", (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Unable to fetch doctors."
            });
        }

        res.json(result);
    });

});


/* ===========================
   GET PATIENTS
=========================== */
app.get("/patients", (req, res) => {

    const search = req.query.search || "";

    db.query(
        "SELECT * FROM Patient WHERE name LIKE ?",
        [`%${search}%`],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Unable to fetch patients."
                });
            }

            res.json(result);
        }
    );

});


/* ===========================
   GET APPOINTMENTS
=========================== */
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
        ORDER BY a.appointment_date
        `,
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Unable to fetch appointments."
                });
            }

            res.json(result);
        }
    );

});


/* ===========================
   ADD PATIENT
=========================== */
app.post("/add-patient", (req, res) => {

    const { gender } = req.body;
    const name = (req.body.name || "").trim();
    const phone = (req.body.phone || "").trim();

    if (name === "") {
        return res.status(400).json({
            success: false,
            message: "Patient name cannot be empty."
        });
    }

    if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({
            success: false,
            message: "Phone number must be exactly 10 digits."
        });
    }

    db.query(
        "INSERT INTO Patient (name, gender, phone) VALUES (?, ?, ?)",
        [name, gender, phone],
        (err) => {

            if (err) {

                console.error(err);

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        success: false,
                        message: "Phone number already exists."
                    });
                }

                return res.status(500).json({
                    success: false,
                    message: "Unable to add patient."
                });
            }

            res.status(201).json({
                success: true,
                message: "Patient added successfully."
            });

        }
    );

});


/* ===========================
   ADD DOCTOR
=========================== */
app.post("/add-doctor", (req, res) => {

    const name = (req.body.name || "").trim();

    if (name === "") {
        return res.status(400).json({
            success: false,
            message: "Doctor name cannot be empty."
        });
    }

    db.query(
        "INSERT INTO Doctor (name) VALUES (?)",
        [name],
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Unable to add doctor."
                });
            }

            res.status(201).json({
                success: true,
                message: "Doctor added successfully."
            });

        }
    );

});


/* ===========================
   BOOK APPOINTMENT
=========================== */
app.post("/add-appointment", (req, res) => {

    const { patient_id, doctor_id, appointment_date } = req.body;

    if (new Date(appointment_date) < new Date()) {
        return res.status(400).json({
            success: false,
            message: "Cannot book an appointment in the past."
        });
    }

    db.query(
        "INSERT INTO Appointment (patient_id, doctor_id, appointment_date) VALUES (?, ?, ?)",
        [patient_id, doctor_id, appointment_date],
        (err) => {

            if (err) {

                console.error(err);

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        success: false,
                        message: "This doctor already has an appointment at that time."
                    });
                }

                return res.status(500).json({
                    success: false,
                    message: "Unable to book appointment."
                });
            }

            res.status(201).json({
                success: true,
                message: "Appointment booked successfully."
            });

        }
    );

});


/* ===========================
   UPDATE DOCTOR
=========================== */
app.put("/update-doctor/:id", (req, res) => {

    const name = (req.body.name || "").trim();

    if (name === "") {
        return res.status(400).json({
            success: false,
            message: "Doctor name cannot be empty."
        });
    }

    db.query(
        "UPDATE Doctor SET name=? WHERE doctor_id=?",
        [name, req.params.id],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Unable to update doctor."
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Doctor not found."
                });
            }

            res.json({
                success: true,
                message: "Doctor updated successfully."
            });

        }
    );

});


/* ===========================
   DELETE PATIENT
=========================== */
app.delete("/delete-patient/:id", (req, res) => {

    db.query(
        "DELETE FROM Patient WHERE patient_id=?",
        [req.params.id],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Unable to delete patient."
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Patient not found."
                });
            }

            res.json({
                success: true,
                message: "Patient deleted successfully."
            });

        }
    );

});


/* ===========================
   DELETE APPOINTMENT
=========================== */
app.delete("/delete-appointment/:id", (req, res) => {

    db.query(
        "DELETE FROM Appointment WHERE appointment_id=?",
        [req.params.id],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Unable to delete appointment."
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Appointment not found."
                });
            }

            res.json({
                success: true,
                message: "Appointment deleted successfully."
            });

        }
    );

});


/* ===========================
   DELETE DOCTOR
=========================== */
app.delete("/delete-doctor/:id", (req, res) => {

    db.query(
        "DELETE FROM Doctor WHERE doctor_id=?",
        [req.params.id],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Unable to delete doctor."
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Doctor not found."
                });
            }

            res.json({
                success: true,
                message: "Doctor deleted successfully."
            });

        }
    );

});


/* ===========================
   START SERVER
=========================== */

const PORT = process.env.PORT || 3000;

/* DASHBOARD STATISTICS */

app.get("/stats", (req, res) => {

    const stats = {};

    db.query(
        "SELECT COUNT(*) AS total FROM Doctor",
        (err, doctors) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Unable to fetch stats."
                });
            }

            stats.doctors = doctors[0].total;

            db.query(
                "SELECT COUNT(*) AS total FROM Patient",
                (err, patients) => {

                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            success: false,
                            message: "Unable to fetch stats."
                        });
                    }

                    stats.patients = patients[0].total;

                    db.query(
                        "SELECT COUNT(*) AS total FROM Appointment",
                        (err, appointments) => {

                            if (err) {
                                console.error(err);
                                return res.status(500).json({
                                    success: false,
                                    message: "Unable to fetch stats."
                                });
                            }

                            stats.appointments = appointments[0].total;

                            db.query(
                                "SELECT COUNT(*) AS total FROM Appointment WHERE DATE(appointment_date)=CURDATE()",
                                (err, today) => {

                                    if (err) {
                                        console.error(err);
                                        return res.status(500).json({
                                            success: false,
                                            message: "Unable to fetch stats."
                                        });
                                    }

                                    stats.today = today[0].total;

                                    res.json(stats);

                                });

                        });

                });

        });

});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});