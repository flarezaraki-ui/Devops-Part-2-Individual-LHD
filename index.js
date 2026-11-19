var express = require('express');
var bodyParser = require("body-parser");
var app = express();
const fs = require('fs').promises;
const path = require('path');
const PORT = process.env.PORT || 5050
var startPage = "index.html";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

const { addTask } = require('./utils/HongDaUtil');
app.post('/add-task', addTask);
const { editTasks } = require('./utils/DixonNgUtil');
app.put('/edit-tasks/:id', editTasks);
const { deleteTask } = require('./utils/HaroldGohUtils');
app.delete('/tasks/:id', deleteTask);
// Return an error if a DELETE request is sent without a task ID
app.delete('/tasks', (req, res) => {
    return res.status(400).json({
        message: "Invalid or missing task ID"
    });
});
// Shared READ functionality to retrieve all existing tasks
app.get('/tasks', async (req, res) => {
    try {
        // Locate and read the tasks.json file
        const filePath = path.join(__dirname, 'utils', 'tasks.json');
        const data = await fs.readFile(filePath, 'utf8');

        // Convert JSON data into a JavaScript array
        const tasks = JSON.parse(data);

        // Check that the JSON contains an array
        if (!Array.isArray(tasks)) {
            return res.status(500).json({
                message: "Invalid tasks data"
            });
        }

        // Return all tasks to the frontend
        return res.status(200).json(tasks);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Unable to retrieve tasks"
        });
    }
});

app.get('/tasks/:id', async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'utils', 'tasks.json');
        const data = await fs.readFile(filePath, 'utf8');
        const tasks = JSON.parse(data);

        if (!Array.isArray(tasks)) {
            return res.status(500).json({
                message: "Missing Tasks data"
            });
        }
        
        const task = tasks.find((t) => String(t.id) === req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not a thing"
            });
        }
        return res.status(200).json(task)
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to retrieve the task"
        });
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
})
server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address == "::" ? 'localhost' : address.address}:${address.port}`;
    console.log(`Project hosted on: ${baseUrl}`);
});
module.exports = { app, server }