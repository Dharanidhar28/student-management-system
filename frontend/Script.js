import { apiRequest } from "./api_helper.js";
const API = "http://127.0.0.1:8000/students/";
const token = localStorage.getItem("token");

let allstudents = [];

let currentPage = 1;
const limit = 10;

async function loadStudents(page = 1) {
	try {

		document.getElementById("loadingSpinner").style.display = "block";
		currentPage = page;
		const skip = (currentPage - 1) * limit;
		const students = await apiRequest(`/students/?skip=${skip}&limit=${limit}`);
		allstudents = students;
		
		displayStudents(students.students);

	    
	
		document.getElementById("totalStudents").innerText = students.total;
		// calculate average age
		let totalAge = 0;

		students.students.forEach((student) => {
			totalAge += student.age;
		});
		const avgAge = students.students.length ? Math.round(totalAge / students.students.length) : 0;
		document.getElementById("avgAge").innerText = avgAge;
		
		renderPagination()
	
	} catch (error) {
		console.error("Error loading students:", error);
		alert("Failed to load students. Please try again later.");
	}
	// Hide loading spinner after data is loaded or if there's an error
	document.getElementById("loadingSpinner").style.display = "none";
}

if (!localStorage.getItem("token")) {
	window.location.href = "login.html";
}

function renderPagination() {

	const pagination = document.getElementById("pagination");

	pagination.innerHTML = "";

	let totalStudents = parseInt(document.getElementById("totalStudents").innerText) || 0;

	let totalPages = Math.ceil(totalStudents / limit);

	for (let i = 1; i <= totalPages; i++) {

		pagination.innerHTML += `
		
		<li class="page-item ${currentPage === i ? "active" : ""}">
		
		<button class="page-link" onclick="loadStudents(${i})">
		${i}
		</button>
		
		</li>
		
		
		`;
}
}

async function displayStudents(students) {
	try {
		const table = document.getElementById("studentTable");

		table.innerHTML = "";

		students.forEach((student) => {
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
	} catch (error) {
		console.error("Error displaying students:", error);
		alert("Failed to display students. Please try again later.");
	}
}

async function addStudent() {
	try {
		const name = document.getElementById("name").value;
		const email = document.getElementById("email").value;
		const age = parseInt(document.getElementById("age").value);

		const course = document.getElementById("course").value;

		const data = await apiRequest("/students/", {
			method: "POST",
			body: JSON.stringify({ name, age, course, email }),
		});

		showToast("Student added successfully");

		loadStudents();
	} catch (error) {
		console.error("Error adding student:", error);
		alert("Failed to add student. Please try again later.");
		return;
	}
}

function searchStudents() {
	const keyword = document.getElementById("searchInput").value.toLowerCase();

	const filteredStudents = allstudents.filter((student) =>
		student.name.toLowerCase().includes(keyword),
	);

	displayStudents(filteredStudents);
}

function sortStudents(field) {
	let sortedStudents = [...allstudents];

	sortedStudents.sort((a, b) => {
		if (a[field] < b[field]) return -1;
		if (a[field] > b[field]) return 1;
		return 0;
	});

	displayStudents(sortedStudents);
}

function openAddStudentModal() {
	document.getElementById("name").value = "";
	document.getElementById("email").value = "";
	document.getElementById("age").value = "";
	document.getElementById("course").value = "";

	const modal = bootstrap.Modal.getOrCreateInstance(
		document.getElementById("addModal"),
	);
	modal.show();
}

async function deleteStudent(id) {
	const confirmDelete = window.confirm(
		"Are you sure you want to delete this student?",
	);

	if (!confirmDelete) {
		return;
	}

	try {
		await apiRequest(`/students/${id}/`, {
			method: "DELETE",
		});
	} catch (error) {
		console.error("Error deleting student:", error);
		alert("Failed to delete student. Please try again later.");
		return;
	}
	showToast("Student deleted successfully");

	loadStudents();
}
window.deleteStudent = deleteStudent;

async function editStudent(id) {
	try {
		const students = await apiRequest(`/students/${id}`);

		document.getElementById("editName").value = students.name;
		document.getElementById("editEmail").value = students.email;
		document.getElementById("editAge").value = students.age;
		document.getElementById("editCourse").value = students.course;

		const updateBtn = document.getElementById("updateBtn");
		updateBtn.innerText = "Update Student";
		updateBtn.onclick = () => updateStudent(id);
		const modal = new bootstrap.Modal(document.getElementById("editModal"));
		modal.show();
	} catch (error) {
		console.error("Error editing student:", error);
		alert("Failed to edit student. Please try again later.");
	}
}

async function updateStudent(id) {
	try {
		const name = document.getElementById("editName").value;
		const email = document.getElementById("editEmail").value;
		const age = parseInt(document.getElementById("editAge").value);
		const course = document.getElementById("editCourse").value;

		await apiRequest(`/students/${id}`, {
			method: "PUT",

			body: JSON.stringify({
				name,
				email,
				age,
				course,
			}),
		});

		const modal = bootstrap.Modal.getInstance(
			document.getElementById("editModal"),
		);
		modal.hide();
	} catch (error) {
		console.error("Error updating student:", error);
		alert("Failed to update student. Please try again later.");
		return;
	}

	showToast("Student updated successfully");
	loadStudents();
}

function logout() {
	localStorage.removeItem("token");

	window.location.href = "login.html";
}

function showToast(message) {

	const toastBody = document.getElementById("toastBody");
	toastBody.innerText = message;

	const toastElement = document.getElementById("toastMessage");

	const toast = new bootstrap.Toast(toastElement);

	toast.show();
}

window.loadStudents = loadStudents;
window.addStudent = addStudent;
window.editStudent = editStudent;
window.updateStudent = updateStudent;
window.logout = logout;
window.openAddStudentModal = openAddStudentModal;
window.searchStudents = searchStudents;
window.sortStudents = sortStudents;
window.showToast = showToast;
window.renderPagination = renderPagination;


loadStudents();
