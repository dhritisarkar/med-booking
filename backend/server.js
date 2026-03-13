const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

/* DATABASE CONNECTION */

const db = mysql.createConnection({

host: "localhost",
user: "root",
password: "StrongPassword123",
database: "clinic_db1"

})

db.connect(err => {

if(err){
console.log("Database connection failed")
return
}

console.log("Connected to MariaDB")

})

/* ================= DOCTORS ================= */

app.get("/doctors",(req,res)=>{

const sql = "SELECT * FROM Doctor"

db.query(sql,(err,result)=>{

if(err){
console.log(err)
res.status(500).send("Error fetching doctors")
return
}

res.json(result)

})

})

app.post("/add-doctor",(req,res)=>{

const {name} = req.body

const sql = "INSERT INTO Doctor (name) VALUES (?)"

db.query(sql,[name],(err,result)=>{

if(err){
console.log(err)
res.status(500).send("Error adding doctor")
return
}

res.send("Doctor added successfully")

})

})

/* ================= PATIENTS ================= */

app.get("/patients",(req,res)=>{

const sql = "SELECT * FROM Patient"

db.query(sql,(err,result)=>{

if(err){
console.log(err)
res.status(500).send("Error fetching patients")
return
}

res.json(result)

})

})

app.post("/add-patient",(req,res)=>{

const {name,gender,phone} = req.body

const sql = "INSERT INTO Patient (name,gender,phone) VALUES (?,?,?)"

db.query(sql,[name,gender,phone],(err,result)=>{

if(err){
console.log(err)
res.status(500).send("Error adding patient")
return
}

res.send("Patient added successfully")

})

})

app.delete("/delete-patient/:id",(req,res)=>{

const id = req.params.id

const deleteAppointments = "DELETE FROM Appointment WHERE patient_id=?"

db.query(deleteAppointments,[id],()=>{

const deletePatient = "DELETE FROM Patient WHERE patient_id=?"

db.query(deletePatient,[id],(err,result)=>{

if(err){
console.log(err)
res.status(500).send("Error deleting patient")
return
}

res.send("Patient deleted")

})

})

})

/* ================= APPOINTMENTS ================= */

app.get("/appointments",(req,res)=>{

const sql = `
SELECT
Appointment.appointment_id,
Patient.name AS patient_name,
Doctor.name AS doctor_name,
Appointment.appointment_date
FROM Appointment
JOIN Patient ON Appointment.patient_id = Patient.patient_id
JOIN Doctor ON Appointment.doctor_id = Doctor.doctor_id
`

db.query(sql,(err,result)=>{

if(err){
console.log(err)
res.status(500).send("Error fetching appointments")
return
}

res.json(result)

})

})

app.post("/add-appointment",(req,res)=>{

const {patient_id,doctor_id,appointment_date} = req.body

const sql = `
INSERT INTO Appointment (patient_id,doctor_id,appointment_date)
VALUES (?,?,?)
`

db.query(sql,[patient_id,doctor_id,appointment_date],(err,result)=>{

if(err){
console.log(err)
res.status(500).send("Error booking appointment")
return
}

res.send("Appointment booked")

})

})

app.delete("/delete-appointment/:id",(req,res)=>{

const id = req.params.id

const sql = "DELETE FROM Appointment WHERE appointment_id=?"

db.query(sql,[id],(err,result)=>{

if(err){
console.log(err)
res.status(500).send("Error deleting appointment")
return
}

res.send("Appointment deleted")

})

})

/* ================= SERVER ================= */

app.listen(3000,()=>{

console.log("Server running on http://localhost:3000")

})