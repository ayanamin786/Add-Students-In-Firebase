var namee = document.getElementById("name");
var email = document.getElementById("email")
var con = document.getElementById("con");

async function addstd() {
    var studentName = namee.value.trim();
    var studentEmail = email.value.trim()
    if (studentName && studentEmail  === ""&& studentEmail === "") {
        alert("Please enter student name Or email");
        return;
    }
    try {
        await firebase.database().ref("students").push({ name: studentName , email : studentEmail });
        namee.value = "";
        email.value = "";
        getStudents();
    } catch (error) {
        console.log("Error:", error);
        alert("Student save error");
    }
}

async function getStudents() {
    try {
        var snapshot = await firebase.database().ref("students").get();
        con.innerHTML = "";

        if (!snapshot.exists()) {
            con.innerHTML = "<p>No students found</p>";
            return;
        }

        var students = snapshot.val();
        
        for (var id in students) {
            var student = students[id];
            
            var studentBox = document.createElement("div");
            studentBox.className = "student";
            
            studentBox.innerHTML = `
                <h3>${student.name}</h3>
                <h3>${student.email}</h3>
                <p>Student ID: ${id}</p>
                <div class="student-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="remove-btn">Remove</button>
                </div>
            `;
            
            var editBtn = studentBox.querySelector(".edit-btn");
            var removeBtn = studentBox.querySelector(".remove-btn");
            editBtn.addEventListener("click", editStudent.bind(null, id, student.name));
              removeBtn.addEventListener("click", removeStudent.bind(null, id, student.name));

            con.appendChild(studentBox);
        }
    } catch (error) {
        console.log("Error:", error);
        con.innerHTML = "<p>Students load nahi ho sake</p>";
    }
}

async function editStudent(id, currentName) {
    let newval = prompt("Enter New Value", currentName);
    
    if (newval === null || newval.trim() === "") return; 

    try {
        await firebase.database().ref("students/" + id).update({
            name: newval.trim()
        });
        
        alert("Student updated successfully!");
        getStudents();
    } catch (error) {
        console.log("Error updating:", error);
        alert("Failed to update student.");
    }
}

async function removeStudent(id, currentName) {
    
    try {
        await firebase.database().ref("students/" + id).remove()
        
        alert("Student updated successfully!");
        getStudents();
    } catch (error) {
        console.log("Error updating:", error);
        alert("Failed to update student.");
    }
}

async function removestd() {
    try {
        await firebase.database().ref("students").remove();
        con.innerHTML = "<p>No students found</p>";
    } catch (error) {
        console.log("Error deleting:", error);
    }
}

getStudents();
