function addTask() {
    console.log("Adding task...");
    var response = "";
    // Create an object to hold form data
    var jsonData = new Object();
    jsonData.title = document.getElementById("title").value;
    jsonData.subject = document.getElementById("subject").value;
    jsonData.description = document.getElementById("description").value;
    jsonData.deadline = document.getElementById("deadline").value;
    // Validate required fields (all must be filled in)
    if (jsonData.title == "" || jsonData.subject == "" || jsonData.description == "" || jsonData.deadline == "") {
        alert('All fields are required!');
        return; // Stop execution if validation fails
    }
    // Configure the request to POST data to /add-task
    var request = new XMLHttpRequest();
    request.open("POST", "/add-task", true);
    request.setRequestHeader('Content-Type', 'application/json');
    // Define what happens when the server responds
    request.onload = function () {
        response = JSON.parse(request.responseText); // Parse JSON response
        console.log(response)
        // If no error message is returned → success
        if (response.message == undefined) {
            alert('Added Task: ' + jsonData.title + '!');
            // Clear form fields after success
            document.getElementById("title").value = "";
            document.getElementById("subject").value = "";
            document.getElementById("description").value = "";
            document.getElementById("deadline").value = "";
            window.location.href = "/index.html"; // Redirect to index page
            
        } else {
            if (response.message == "Task already exists!") {
                alert('Task already exists!');
            } else {
                alert('Unable to add task!');
            }
        }
    };
    request.onerror = function () {
        alert('Could not connect to the server. Please ensure the server is running!');
    };
    // Send the request with JSON-formatted data
    request.send(JSON.stringify(jsonData));
}