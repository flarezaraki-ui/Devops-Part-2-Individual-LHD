const params = new URLSearchParams(window.location.search);
const taskId = params.get("id");

async function loadTask() {
    if (!taskId) {
        alert("No task selected");
        window.location.href="index.html";
        return;
    }

    try {
        const response = await fetch("/tasks/" + taskId);
        if (!response.ok) throw new Error("Failed to load task")
        const task = await response.json();

        document.getElementById("title").value = task.title;
        document.getElementById('subject').value = task.subject;
        document.getElementById('status').value = task.status;
        document.getElementById('deadline').value = task.deadline;
        document.getElementById('description').value = task.description
    } catch (error) {
        console.error(error);
        alert("Couldnt load task!");
    }
}

function updateTasks(event) {
    event.preventDefault();

    const jsonData = {
        title: document.getElementById('title').value,
        subject: document.getElementById('subject').value,
        status: document.getElementById('status').value,
        deadline: document.getElementById('deadline').value,
        description: document.getElementById('description').value
    };
    
    if (jsonData.title == "" || jsonData.subject == "" || jsonData.status == "" || jsonData.deadline == "" || jsonData.description == "") {
        alert("All fields are required.");
        return;
    }

    var request = new XMLHttpRequest();
    request.open("PUT", "/edit-tasks/" + taskId, true);
    request.setRequestHeader("Content-type", "application/json");

    request.onload = function() {
        let response;
        try {
            response = JSON.parse(request.responseText);
        } catch (e) {
            alert("Unexpected response from the server");
            return;
        }
        if (request.status === 200 && response.message === "Task Updated!") {
            alert("Edited Task: " + jsonData.title + "!");
            window.location.href="index.html";
        } else {
            alert("Couldnt edit task");
        }
    };

    request.onerror = function () {
        alert("NEtwork error")
    };
    request.send(JSON.stringify(jsonData));
};

document.querySelector('.task-form').addEventListener("submit", updateTasks);
loadTask();
