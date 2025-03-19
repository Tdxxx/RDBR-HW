document.addEventListener("DOMContentLoaded", function () {
    // Get the task ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');

    if (taskId) {
        // Fetch the task details from the API using the task ID
        const apiUrl = `https://momentum.redberryinternship.ge/api/tasks/${taskId}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(task => {
                // Populate the task details in the HTML
                document.getElementById("task-name").textContent = task.name;
                document.getElementById("task-status").textContent = task.status.name;
                document.getElementById("task-description").textContent = task.description;
                document.getElementById("task-due-date").textContent = task.due_date;
                document.getElementById("employee-name").textContent = `${task.employee.name} ${task.employee.surname}`;
                document.getElementById("employee-avatar").src = task.employee.avatar;
            })
            .catch(error => console.error('Error fetching task details:', error));
    }
});
