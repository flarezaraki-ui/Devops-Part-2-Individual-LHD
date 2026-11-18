
async function loadTasks() {
    // Find the task display area in index.html
    const tasksDisplay = document.getElementById('TasksDisplay');

    try {
        // Request the existing tasks from the backend
        const response = await fetch('/tasks');

        if (!response.ok) {
            throw new Error("Failed to retrieve tasks");
        }

        // Convert the response into a JavaScript array
        const tasks = await response.json();

        // Clear the task display before adding the latest tasks
        tasksDisplay.replaceChildren();

        // Display a message if there are no tasks
        if (tasks.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');

            cell.textContent = "No tasks available";
            row.appendChild(cell);
            tasksDisplay.appendChild(row);
            return;
        }
        
        // Display each task with its Edit and Delete buttons
        tasks.forEach(task => {
            const row = document.createElement('tr');
            const cell = document.createElement('td');

            // Container for task information
            const taskInfo = document.createElement('div');
            taskInfo.className = 'task-info';

            const title = document.createElement('strong');
            title.textContent = task.title;

            const deadline = document.createElement('p');
            deadline.textContent = `Deadline: ${task.deadline}`;

            taskInfo.appendChild(title);
            taskInfo.appendChild(deadline);

            // Container for the Edit and Delete buttons
            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';

            // Edit button for Dixon's Update Task feature
            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.textContent = 'Edit';
            editButton.className = 'btn-edit';
            editButton.dataset.taskId = task.id;

            editButton.addEventListener('click', () => {
                window.location.href = `editTask.html?id=${task.id}`;
            });

            // Delete button for Harold's Delete Task feature
            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'btn-delete';
            deleteButton.dataset.taskId = task.id;

            taskActions.appendChild(editButton);
            taskActions.appendChild(deleteButton);

            // Add task information and buttons into the task card
            cell.appendChild(taskInfo);
            cell.appendChild(taskActions);
            row.appendChild(cell);

            tasksDisplay.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading tasks:", error);
        tasksDisplay.textContent = "Unable to load tasks";
    }
}

// Allow other feature files to refresh the task list later
window.loadTasks = loadTasks;

// Automatically retrieve tasks when the Home Screen loads
document.addEventListener('DOMContentLoaded', loadTasks);