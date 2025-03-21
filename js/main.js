document.addEventListener("DOMContentLoaded", function () {
    const addEmployeeButton = document.getElementById("btn-add-employee");
    const backdrop = document.getElementById("backdrop");
    const modal = document.getElementById("employee-modal");
    const closeButton = document.getElementById("close-btn");
    const cancelButton = document.getElementById("cancel-button");
    const employeeSelect = document.getElementById("employee-filter");
    const departmentSelect = document.getElementById("department-filter");
    const prioritySelect = document.getElementById("priority-filter");

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

    if (addEmployeeButton) addEmployeeButton.addEventListener("click", showModal);
    if (closeButton) closeButton.addEventListener("click", closeModal);
    if (cancelButton) cancelButton.addEventListener("click", closeModal);
    if (backdrop) backdrop.addEventListener("click", closeModal);

    // Load employees
    fetch("bknd/employees.json")
        .then(response => response.json())
        .then(employees => {
            if (Array.isArray(employees)) {
                employeeSelect.innerHTML = '<option value="">ყველა თანამშრომელი</option>';
                employees.forEach(emp => {
                    let option = document.createElement("option");
                    option.value = emp.id;
                    option.textContent = `${emp.name} ${emp.surname}`;
                    employeeSelect.appendChild(option);
                });
            }
        })
        .catch(error => console.error("Error loading employees:", error));

    // Load departments
    fetch("bknd/Departments.json")
        .then(response => response.json())
        .then(departments => {
            if (Array.isArray(departments)) {
                departmentSelect.innerHTML = '<option value="">დეპარტამენტი</option>';
                departments.forEach(department => {
                    let option = document.createElement("option");
                    option.value = department.id;
                    option.textContent = department.name;
                    departmentSelect.appendChild(option);
                });
            }
        })
        .catch(error => console.error("Error loading departments:", error));

    function createTaskCard(task) {
        const card = document.createElement("div");
        card.classList.add("card");

        // Map task status to corresponding section header class
        const sectionMapping = {
            "დასაწყები": "section-header1",
            "პროგრესში": "section-header2",
            "მზად ტესტირებისთვის": "section-header3",
            "დასრულებული": "section-header4"
        };

        let sectionClass = sectionMapping[task.status.name] || "";
        const sectionHeader = document.querySelector(`.${sectionClass}`);
        const sectionHeaderColor = sectionHeader ? window.getComputedStyle(sectionHeader).backgroundColor : "#ccc";

        card.style.border = `2px solid ${sectionHeaderColor}`;

        card.innerHTML = `
            <a href="task-detail.html?id=${task.id}" class="card-link">
                <div class="card-header">
                    <div class="difficulty-badge" style="border: 2px solid ${sectionHeaderColor};">
                        ${task.priority.icon ? `<img src="${task.priority.icon}" alt="priority icon" class="difficulty-icon">` : ""}
                        ${task.priority.name}
                    </div>
                    <div class="category-badge ${task.department.name.toLowerCase().split(" ")[0]}">
                        ${task.department.name.split(" ")[0]}
                    </div>
                </div>
                <div class="card-content">
                    <h4 class="card-title">${task.name}</h4>
                    <p class="card-description">
                        ${task.description.length > 100 ? task.description.slice(0, 100) + "..." : task.description}
                    </p>
                </div>
                <span class="publish-date">${new Date(task.due_date).toLocaleDateString()}</span>
                <div class="card-footer">
                    <img src="${task.employee.avatar}" alt="employee avatar" class="avatar">
                </div>
                <img src="img/Comments.png" alt="comments icon" class="comment-icon">
            </a>
        `;

        return card;
    }

    function loadTasks() {
        fetch("bknd/tasks.json")
            .then(response => response.json())
            .then(tasks => {
                if (!Array.isArray(tasks)) return;

                document.getElementById("Must-start").innerHTML = "";
                document.getElementById("in-progress").innerHTML = "";
                document.getElementById("ready-to-test").innerHTML = "";
                document.getElementById("finished").innerHTML = "";

                const selectedEmployee = employeeSelect.value;
                const selectedDepartment = departmentSelect.value;
                const selectedPriority = prioritySelect.value;

                const filteredTasks = tasks.filter(task => {
                    let employeeMatch = selectedEmployee ? task.employee.id == selectedEmployee : true;
                    let departmentMatch = selectedDepartment ? task.department.id == selectedDepartment : true;
                    let priorityMatch = selectedPriority ? task.priority.name === selectedPriority : true;
                    return employeeMatch && departmentMatch && priorityMatch;
                });

                filteredTasks.forEach(task => {
                    const card = createTaskCard(task);
                    let sectionId = {
                        "დასაწყები": "Must-start",
                        "პროგრესში": "in-progress",
                        "მზად ტესტირებისთვის": "ready-to-test",
                        "დასრულებული": "finished"
                    }[task.status.name];

                    if (sectionId) {
                        document.getElementById(sectionId).appendChild(card);
                    }
                });
            })
            .catch(error => console.error("Error loading tasks:", error));
    }

    loadTasks();

    employeeSelect.addEventListener("change", loadTasks);
    departmentSelect.addEventListener("change", loadTasks);
    prioritySelect.addEventListener("change", loadTasks);
});


document.addEventListener("DOMContentLoaded", function () {
    const avatarPreview = document.getElementById("avatar-preview");
    const avatarInput = document.getElementById("avatar-input");

    if (avatarPreview && avatarInput) {
        // When the avatar is clicked, trigger the file input
        avatarPreview.addEventListener("click", () => {
            avatarInput.click();
        });

        // When a file is selected, update the preview image
        avatarInput.addEventListener("change", (event) => {
            const file = event.target.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    avatarPreview.src = e.target.result; // Update the image preview
                };
                reader.readAsDataURL(file); // Convert to base64 for preview
            }
        });
    }
});