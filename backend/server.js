const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"StrongPassword123",
    database:"clinic_db1"
});

db.connect(err=>{
    if(err) throw err;
    console.log("Database connected");
});

/* GET ROUTES */
app.get("/doctors",(req,res)=>{
    db.query("SELECT * FROM Doctor",(err,result)=>res.json(result));
});

app.get("/patients",(req,res)=>{
    const search = req.query.search || "";
    db.query(
        "SELECT * FROM Patient WHERE name LIKE ?",
        [`%${search}%`],
        (err,result)=>res.json(result)
    );
});

app.get("/appointments",(req,res)=>{
    db.query(`
        SELECT a.appointment_id,
               p.name AS patient_name,
               d.name AS doctor_name,
               a.appointment_date
        FROM Appointment a
        JOIN Patient p ON a.patient_id=p.patient_id
        JOIN Doctor d ON a.doctor_id=d.doctor_id
    `,(err,result)=>res.json(result));
});

/* ADD */
app.post("/add-patient",(req,res)=>{
    const {name,gender,phone}=req.body;
    db.query("INSERT INTO Patient (name,gender,phone) VALUES (?,?,?)",
    [name,gender,phone],()=>res.send("Added"));
});

app.post("/add-doctor",(req,res)=>{
    db.query("INSERT INTO Doctor (name) VALUES (?)",
    [req.body.name],()=>res.send("Added"));
});

/* CONFLICT PREVENTION */
app.post("/add-appointment",(req,res)=>{

    const {patient_id,doctor_id,appointment_date}=req.body;

    db.query(
        "SELECT * FROM Appointment WHERE doctor_id=? AND appointment_date=?",
        [doctor_id,appointment_date],
        (err,result)=>{

            if(result.length>0){
                return res.status(400).send("Conflict");
            }

            db.query(
                "INSERT INTO Appointment (patient_id,doctor_id,appointment_date) VALUES (?,?,?)",
                [patient_id,doctor_id,appointment_date],
                ()=>res.send("Added")
            );
        }
    );
});

/* UPDATE */
app.put("/update-doctor/:id",(req,res)=>{
    db.query("UPDATE Doctor SET name=? WHERE doctor_id=?",
    [req.body.name,req.params.id],
    ()=>res.send("Updated"));
});

/* DELETE PATIENT */
app.delete("/delete-patient/:id",(req,res)=>{
    const id=req.params.id;

    db.query("DELETE FROM Appointment WHERE patient_id=?", [id], ()=>{
        db.query("DELETE FROM Patient WHERE patient_id=?", [id],
        ()=>res.send("Deleted"));
    });
});

/* DELETE APPOINTMENT */
app.delete("/delete-appointment/:id",(req,res)=>{
    db.query("DELETE FROM Appointment WHERE appointment_id=?",
    [req.params.id],()=>res.send("Deleted"));
});

/* DELETE DOCTOR WITH CONSTRAINT */
app.delete("/delete-doctor/:id", (req, res) => {

    const id = parseInt(req.params.id);

    console.log("DELETE DOCTOR CALLED:", id);

    // First delete appointments
    db.query("DELETE FROM Appointment WHERE doctor_id = ?", [id], (err) => {

        if (err) {
            console.error("ERROR deleting appointments:", err);
            return res.status(500).send("Failed deleting appointments");
        }

        console.log("Appointments deleted (if any)");

        // Then delete doctor
        db.query("DELETE FROM Doctor WHERE doctor_id = ?", [id], (err, result) => {

            if (err) {
                console.error("ERROR deleting doctor:", err);
                return res.status(500).send("Failed deleting doctor");
            }

            console.log("Doctor delete result:", result);

            if (result.affectedRows === 0) {
                return res.status(404).send("Doctor not found");
            }

            res.send("Doctor deleted successfully");
        });

    });
});

app.listen(3000,()=>console.log("Server running"));