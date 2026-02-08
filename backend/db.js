const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "clinic_user",
  password: "clinic123",
  database: "clinic_db"
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to database");
  }
});

module.exports = db;
