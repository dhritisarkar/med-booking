
function logout(){
        localStorage.removeItem("loggedIn");
        window.location.href="login.html";
    }

function showToast(message, type = "success"){

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.className = "";

    toast.classList.add(type);

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    },3000);

}
function showSection(sectionId, button){

    // Hide all sections
    document.querySelectorAll(".section-card").forEach(section=>{
        section.style.display = "none";
    });

    // Remove active button styling
    document.querySelectorAll(".tab-btn").forEach(btn=>{
        btn.classList.remove("active");
    });

    // Show selected section
    document.getElementById(sectionId).style.display = "block";

    // Highlight selected tab
    button.classList.add("active");
}
    // LOAD DOCTORS
    async function loadDoctors(){
        const res = await fetch(API_BASE_URL +"/doctors");
        const data = await res.json();

        doctorTable.innerHTML="";
        doctorId.innerHTML="";

        data.forEach(d=>{
            doctorTable.innerHTML+=`
            <tr>
            <td>${d.doctor_id}</td>
            <td>${d.name}</td>
            <td>
                <button onclick="editDoctor(${d.doctor_id},'${d.name}')">Edit</button>
                <button class="delete-btn" onclick="deleteDoctor(${d.doctor_id})">Delete</button>
            </td>
            </tr>`;

            doctorId.innerHTML+=`<option value="${d.doctor_id}">${d.name}</option>`;
        });
    }

    // LOAD PATIENTS
    async function loadPatients(){
        const search = document.getElementById("search").value;

        const res = await fetch(`${API_BASE_URL}/patients?search=${search}`);
        const data = await res.json();

        patientTable.innerHTML="";
        patientId.innerHTML="";

        data.forEach((p,i)=>{
            patientTable.innerHTML+=`
            <tr>
            <td>${i+1}</td>
            <td>${p.name}</td>
            <td>${p.gender}</td>
            <td>${p.phone}</td>
            <td>
            <button class="delete-btn" onclick="deletePatient(${p.patient_id})">Delete</button>
            </td>
            </tr>`;

            patientId.innerHTML+=`<option value="${p.patient_id}">${p.name}</option>`;
        });
    }

    // LOAD APPOINTMENTS
    async function loadAppointments(){
        const res = await fetch(API_BASE_URL +"/appointments");
        const data = await res.json();

        appointmentTable.innerHTML="";

        data.forEach(a=>{
            appointmentTable.innerHTML+=`
            <tr>
            <td>${a.appointment_id}</td>
            <td>${a.patient_name}</td>
            <td>${a.doctor_name}</td>
            <td>${new Date(a.appointment_date).toLocaleString()}</td>
            <td>
                <button class="delete-btn" onclick="deleteAppointment(${a.appointment_id})">Delete</button>
            </td>
            </tr>`;
        });
    }

    // ADD PATIENT
    async function addPatient(){
        if(!/^\d{10}$/.test(patientPhone.value)){
            showToast("Invalid phone number","error");
            return;
        }

        await fetch(API_BASE_URL +"/add-patient",{
            method:"POST",
            headers:{ "Content-Type":"application/json"},
            body:JSON.stringify({
                name:patientName.value,
                gender:patientGender.value,
                phone:patientPhone.value
            })
        });

        loadPatients();
        loadStats();
    }

    // ADD DOCTOR
    async function addDoctor(){
        const name = doctorName.value.trim();

        if(name === ""){
            showToast("Doctor name cannot be empty","error");
            return;
        }
        await fetch(API_BASE_URL +"/add-doctor",{
            method:"POST",
            headers:{ "Content-Type":"application/json"},
            body: JSON.stringify({ name })
        });
        loadDoctors();
        loadStats();
    }

    // EDIT DOCTOR
    function editDoctor(id,name){
        const newName = prompt("Enter new doctor name:", name);

        if(!newName || newName.trim()===""){

            showToast("Doctor name cannot be empty","error");
            return;
        }

        fetch(`${API_BASE_URL}/update-doctor/${id}`,{
            method:"PUT",
            headers:{ "Content-Type":"application/json"},
            body:JSON.stringify({name:newName})
        }).then(loadDoctors);
    }

    // DELETE DOCTOR
    function deleteDoctor(id){
        if(!confirm("Delete this doctor?")) return;

        fetch(`${API_BASE_URL}/delete-doctor/${id}`,{method:"DELETE"})
        .then(res=>{
            if(!res.ok){

                showToast("Cannot delete doctor with existing appointments","error");
            }
            loadDoctors();
            loadStats();
        });
    }

    // BOOK APPOINTMENT
    async function bookAppointment(){

        if(!date.value || !time.value){

            showToast("Please select date and time","warning");
            return;
        }

        const appointment_date = date.value + " " + time.value;


        const res = await fetch(`${API_BASE_URL}/add-appointment`,{
            method:"POST",
            headers:{ "Content-Type":"application/json"},
            body:JSON.stringify({
                patient_id:patientId.value,
                doctor_id:doctorId.value,
                appointment_date
            })
        });

        if(!res.ok){
            showToast("Time slot already booked","warning");
            return;
        }

        loadAppointments();
        loadStats();
    }

    // DELETE PATIENT
    function deletePatient(id){
        if(!confirm("WARNING!\nDeleting this patient removes appointments.")) return;

        fetch(`${API_BASE_URL}/delete-patient/${id}`,{method:"DELETE"})
        .then(()=>{
            loadPatients();
            loadAppointments();
        });
    }

    // DELETE APPOINTMENT
    function deleteAppointment(id){
        fetch(`${API_BASE_URL}/delete-appointment/${id}`,{method:"DELETE"})
        .then(loadAppointments);
    }
 async function loadStats(){

     const res = await fetch(API_BASE_URL + "/stats");

     const data = await res.json();

     document.getElementById("doctorCount").textContent = data.doctors;

     document.getElementById("patientCount").textContent = data.patients;

     document.getElementById("appointmentCount").textContent = data.appointments;

     document.getElementById("todayCount").textContent =
         data.today;

     document.getElementById("todayDate").textContent =
         new Date().toLocaleDateString();

 }
    // INIT
    loadStats();
    loadDoctors();
    loadPatients();
    loadAppointments();
    document.getElementById("patients").style.display = "none";
    document.getElementById("appointments").style.display = "none";