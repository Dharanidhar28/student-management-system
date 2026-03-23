
import { apiRequest } from "./api_helper.js";
const API = "http://127.0.0.1:8000/students/";
const token = localStorage.getItem("token");

let allstudents = [];




async function loadStudents(){

const students = await apiRequest("/students/");

allstudents = students;

displayStudents(students);

document.getElementById("totalStudents").innerText = students.length;

console.log(students);
// calculate average age
let totalAge = 0;

students.forEach(student => {
totalAge += student.age;
});

const avgAge = students.length ? Math.round(totalAge / students.length) : 0;

document.getElementById("avgAge").innerText = avgAge;


}




if(!localStorage.getItem("token")){
window.location.href="login.html";
}

async function displayStudents(students){


const table = document.getElementById("studentTable");

table.innerHTML = "";

students.forEach(student => {

table.innerHTML += `

<tr>

<td>${student.id}</td>
<td>${student.name}</td>
<td>${student.email}</td>
<td>${student.age}</td>
<td>${student.course}</td>

<td>

<button class="btn btn-warning btn-sm"
onclick="editStudent(${student.id})">
Edit
</button>

<button class="btn btn-danger btn-sm"
onclick="deleteStudent(${student.id})">

Delete

</button>

</td>

</tr>
`;

});

}

async function addStudent(){


const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const age = parseInt(document.getElementById("age").value);

const course = document.getElementById("course").value;

const data = await apiRequest("/students/", {

method: "POST", 
body: JSON.stringify({ name, age, course, email })});


document.getElementById("name").value = "";
document.getElementById("age").value = "";
document.getElementById("course").value = "";
document.getElementById("email").value = "";

loadStudents();

}


async function deleteStudent(id){


await apiRequest(`/students/${id}/`, {
method: "DELETE"
});

loadStudents();

}
window.deleteStudent = deleteStudent;



function logout(){

localStorage.removeItem("token");

window.location.href="login.html";
}

async function editStudent(id){

const students = await apiRequest(`/students/${id}`);

document.getElementById("name").value = students.name;
document.getElementById("email").value = students.email;
document.getElementById("age").value = students.age;
document.getElementById("course").value = students.course;

document.getElementById("saveBtn").onclick = () => updateStudent(id);

}

async function updateStudent(id){

const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const age = parseInt(document.getElementById("age").value);
const course = document.getElementById("course").value;

await apiRequest(`/students/${id}`,{

method:"PUT",

body: JSON.stringify({
name,
email,
age,
course
})

});
const saveBtn = document.getElementById("saveBtn");
saveBtn.innerText = "Add Student";
saveBtn.onclick = addStudent;


loadStudents();

}

window.addStudent = addStudent;
window.deleteStudent = deleteStudent;
window.editStudent = editStudent;
window.updateStudent = updateStudent;


loadStudents();

