document.addEventListener('DOMContentLoaded', () => {

    // Get the Delete Task popup and its buttons
    const deleteDialog = document.getElementById('deleteTaskDialog');
    const cancelButton = document.getElementById('cancelDeleteButton');
    const confirmButton = document.getElementById('confirmDeleteButton');
    const tasksDisplay = document.getElementById('TasksDisplay');

    // Detect when a Delete button is clicked on any task
    tasksDisplay.addEventListener('click', async (event) => {
        const deleteButton = event.target.closest('.btn-delete');

        // Ignore clicks that are not on Delete buttons
        if (!deleteButton) {
            return;
        }

        // Retrieve the selected task's ID from its Delete button
        const taskId = deleteButton.dataset.taskId;

        if (!taskId || !/^\d{16}$/.test(taskId)) {
            alert('Invalid task ID');
            return;
        }

        try {
            // Retrieve the latest task list from the backend
            const response = await fetch('/tasks');

            if (!response.ok) {
                throw new Error('Unable to retrieve tasks');
            }

            const tasks = await response.json();

            if (!Array.isArray(tasks)) {
                throw new Error('Invalid task data');
            }

            // Find the task selected by the user
            const selectedTask = tasks.find(task => task.id === taskId);

            if (!selectedTask) {
                alert('Task not found');
                return;
            }

            // Display the selected task's details in the popup
            document.getElementById('deleteTaskTitle').textContent =
                selectedTask.title;
            document.getElementById('deleteTaskSubject').textContent =
                selectedTask.subject;
            document.getElementById('deleteTaskStatus').textContent =
                selectedTask.status;
            document.getElementById('deleteTaskDeadline').textContent =
                selectedTask.deadline;
            document.getElementById('deleteTaskDescription').textContent =
                selectedTask.description;

            // Store the selected task ID for the DELETE request
            deleteDialog.dataset.taskId = taskId;

            deleteDialog.showModal();

        } catch (error) {
            console.error('Error opening Delete Task popup:', error);
            alert('Unable to load task details. Please try again.');
        }
    });

    // Close the popup when the user clicks Cancel
    cancelButton.addEventListener('click', () => {
        deleteDialog.close();
    });

    // Confirm deletion of the selected task
    confirmButton.addEventListener('click', async () => {

        // Retrieve and validate the selected task ID
        const taskId = deleteDialog.dataset.taskId;

        if (!taskId || !/^\d{16}$/.test(taskId)) {
            alert('Invalid or missing task ID');
            return;
        }

        // Prevent multiple deletion requests from repeated clicks
        confirmButton.disabled = true;

        try {
            const response = await fetch(`/tasks/${taskId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            // Display the error returned by the backend
            if (!response.ok) {
                alert(result.message || 'Unable to delete task');
                return;
            }

            // Close the popup after successful deletion
            deleteDialog.close();

            // Refresh the task list without reloading the page
            await window.loadTasks();

            // Inform the user that deletion was successful
            alert(result.message);

        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Unable to delete task. Please try again.');

        } finally {
            // Re-enable the button after the request finishes
            confirmButton.disabled = false;
        }
    });

    // Clear the selected task ID whenever the popup closes
    deleteDialog.addEventListener('close', () => {
        delete deleteDialog.dataset.taskId;
    });

});