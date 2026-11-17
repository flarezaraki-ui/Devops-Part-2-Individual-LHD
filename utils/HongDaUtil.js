const { Task } = require('../models/Task');
const fs = require('fs').promises;
const path = require('path');
const RESOURCES_FILE = path.join('utils', 'tasks.json');
const TEMPLATE_FILE = path.join('utils', 'tasks_template.json');
async function addTask(req, res) {
    try {
        const { title, subject, deadline, description } = req.body;
        const newTask = new Task(title, subject, "uncomplete", deadline, description);
        let tasks = [];
        try {
            // Try reading the existing tasks.json
            const data = await fs.readFile(RESOURCES_FILE, 'utf8');
            tasks = JSON.parse(data);
            check_task = tasks.find(dup => dup.title === newTask.title)
            if(check_task){
                return res.status(409).json({message: "Task already exists!"});
            }
        } catch (err) {
            if (err.code === 'ENOENT') {
                //if cannot find tasks.json, create it from the template, ENONT means file not found
                // If tasks.json doesn't exist, create it from the template
                const templateData = await fs.readFile(TEMPLATE_FILE, 'utf8');
                tasks = JSON.parse(templateData);
            } else {
                throw err;
            }
        }
        // Add new task and save to file
        tasks.push(newTask);
        await fs.writeFile(RESOURCES_FILE, JSON.stringify(tasks, null, 2),'utf8');
        return res.status(201).json(tasks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}
module.exports = { addTask };