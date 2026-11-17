const fs = require('fs').promises;
const path = require('path');

// Define the location of the JSON file that stores all tasks
const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Backend function to handle Delete Task requests
async function deleteTask(req, res) {
    try {
        // Retrieve the task ID from the URL parameter
        const taskId = req.params.id;

        // Validate that the task ID exists and contains exactly 16 digits
        if (!taskId || !/^\d{16}$/.test(taskId)) {
            // Return an error if the task ID is missing or invalid
            return res.status(400).json({
                message: "Invalid or missing task ID"
            });
        }

        // Read the existing tasks from tasks.json
        const data = await fs.readFile(TASKS_FILE, 'utf8');
        const tasks = JSON.parse(data);

        // Ensure the JSON file contains an array of tasks
        if (!Array.isArray(tasks)) {
            throw new Error("Invalid tasks.json format");
        }

        // Find the task that matches the ID provided
        const task = tasks.find(task => task.id === taskId);

        // Return an error if the task does not exist
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }
        
        // Remove the selected task from the array
        const updatedTasks = tasks.filter(task => task.id !== taskId);

        // Save the updated task list back into tasks.json
        await fs.writeFile(
            TASKS_FILE,
            JSON.stringify(updatedTasks, null, 2),
            'utf8'
        );

        // Return a success response after the task is deleted
        return res.status(200).json({
            message: "Task deleted successfully",
            deletedTask: task
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = { deleteTask };