document.addEventListener("DOMContentLoaded", function () {
    var addEmployeeButton = document.getElementById("btn-add-employee");
    var backdrop = document.getElementById("backdrop");
    var modal = document.getElementById("employee-modal");
    var closeButton = document.getElementById("close-btn");
    var cancelButton = document.getElementById("cancel-button");
    var employeeSelect = document.getElementById("employee-filter");

    // Ensure modal and backdrop are hidden on page load
    if (modal) modal.style.display = "none";
    if (backdrop) backdrop.style.display = "none";

    function showModal() {
        modal.style.display = "block";
        backdrop.style.display = "block";
    }

    function closeModal() {
        modal.style.display = "none";
        backdrop.style.display = "none";
    }

    // Event Listeners
    if (addEmployeeButton) addEmployeeButton.addEventListener("click", showModal);
    if (closeButton) closeButton.addEventListener("click", closeModal);
    if (cancelButton) cancelButton.addEventListener("click", closeModal);
    if (backdrop) backdrop.addEventListener("click", closeModal);

    // Fetch and Load Employees
    fetch("bknd/employees.json")
        .then(response => response.json())
        .then(employees => {
            console.log("Employees loaded:", employees);

            // Populate dropdown with employees
            employeeSelect.innerHTML = '<option value="">ყველა თანამშრომელი</option>';
            employees.forEach(emp => {
                let option = document.createElement("option");
                option.value = emp.id;
                option.textContent = `${emp.name} ${emp.surname}`;
                employeeSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error loading employees:", error));

    // Function to Create Task Cards
    function createTaskCard(task) {
        const card = document.createElement("div");
        card.classList.add("card");

        // Apply dynamic department color as border
        card.style.border = `2px solid ${task.department.color}`;

        // Create card content
        card.innerHTML = `
            <a href="task-detail.html?id=${task.id}" class="card-link">
                <div class="card-header">
                    <!-- Department Badge -->
                    <div class="category-badge" style="background-color:${task.department.color};">
                        ${task.department.name.split(" ")[0]}  <!-- First word of department -->
                    </div>
                    <!-- Priority Badge -->
                    <div class="difficulty-badge" style="background-color:${task.priority.icon ? task.department.color : '#ccc'};">
                        <img src="${task.priority.icon}" alt="priority icon" class="difficulty-icon">
                        ${task.priority.name}
                    </div>
                </div>

                <div class="card-content">
                    <h4 class="card-title">${task.name}</h4>
                    <p class="card-description">
                        ${task.description.length > 100 ? task.description.slice(0, 100) + "..." : task.description}
                    </p>
                </div>

                <!-- Publish Date (Deadline) in Top-Right Corner -->
                <span class="publish-date">${new Date(task.due_date).toLocaleDateString()}</span>

                <div class="card-footer">
                    <img src="${task.employee.avatar}" alt="employee avatar" class="avatar">
                </div>

                <!-- Comments Icon (Bottom Right Corner) -->
                <img src="img/Comments.png" alt="comments icon" class="comment-icon">
            </a>
        `;

        return card;
    }

    // Fetch and Load Tasks
    function loadTasks() {
        fetch("bknd/tasks.json")
            .then(response => response.json())
            .then(tasks => {
                console.log("Tasks loaded:", tasks);

                // Clear existing task cards before appending new ones
                document.getElementById("Must-start").innerHTML = "";
                document.getElementById("in-progress").innerHTML = "";
                document.getElementById("ready-to-test").innerHTML = "";
                document.getElementById("finished").innerHTML = "";

                // Get selected employee
                const selectedEmployee = employeeSelect.value;

                // Filter tasks if an employee is selected
                const filteredTasks = selectedEmployee
                    ? tasks.filter(task => task.employee.id == selectedEmployee)
                    : tasks;

                // Append tasks to the correct sections
                filteredTasks.forEach(task => {
                    const card = createTaskCard(task);
                    let section;
                    switch (task.status.name) {
                        case "დასაწყები":
                            section = document.getElementById("Must-start");
                            break;
                        case "პროგრესში":
                            section = document.getElementById("in-progress");
                            break;
                        case "მზად ტესტირებისთვის":
                            section = document.getElementById("ready-to-test");
                            break;
                        case "დასრულებული":
                            section = document.getElementById("finished");
                            break;
                    }

                    if (section) {
                        section.appendChild(card);
                    }
                });
            })
            .catch(error => console.error("Error loading tasks:", error));
    }

    // Load tasks initially
    loadTasks();

    // Filter Tasks When Employee Selection Changes
    employeeSelect.addEventListener("change", loadTasks);
});
