document.addEventListener("DOMContentLoaded", function () {
  const taskId = new URLSearchParams(window.location.search).get("id");
  const taskDetailContainer = document.getElementById("task-detail-container");

  if (!taskId) {
    taskDetailContainer.innerHTML = "<p>Task ID not found!</p>";
    return;
  }

  // Fetch the task data from the backend
  fetch("bknd/tasks.json")
    .then((response) => response.json())
    .then((tasks) => {
      const task = tasks.find((t) => t.id == taskId);

      if (!task) {
        taskDetailContainer.innerHTML = "<p>Task not found!</p>";
        return;
      }

      // Update the page title dynamically based on the task name
      document.title = `${task.name} - Task Detail`;

      // Map task status to corresponding section header class
      const sectionMapping = {
        დასაწყები: "section-header1",
        პროგრესში: "section-header2",
        "მზად ტესტირებისთვის": "section-header3",
        დასრულებული: "section-header4",
      };

      const sectionClass = sectionMapping[task.status.name] || "";

      // Set task details
      taskDetailContainer.innerHTML = `
                <div class="task-detail-card">
                    <div class="task-header">
                        <div class="priority-badge" style="border: 2px solid ${sectionClass}">
                            ${
                              task.priority.icon
                                ? `<img src="${task.priority.icon}" alt="priority icon" class="priority-icon">`
                                : ""
                            }
                            ${task.priority.name}
                        </div>
                        <div class="task-category">
                            ${task.department.name}
                        </div>
                    </div>

                    <div class="task-content">
                        <h3 class="task-title">${task.name}</h3>
                        <p class="task-description">${task.description}</p>
                    </div>
                    

                    <div class="task-assignee">
                        

<div class="task-info-container">
    <h2 id="TD">დავალების დეტალები</h2>

    <!-- Status Section -->
    <div class="task-info-row">
        <img src="./img/pie-chart.png" alt="piechart" class="icon">
        <h4>სტატუსი</h4>
        <div class="filter-content">
            <select id="priority-filter">
                <option value="">პრიორიტეტი</option>
                <option value="დაბალი">დაბალი</option>
                <option value="საშუალო">საშუალო</option>
                <option value="მაღალი">მაღალი</option>
            </select>
        </div>
    </div>

    <!-- Due Date Section -->
    <div class="task-info-row">
        <img src="./img/calendar.png" alt="cal" class="icon">
        <h4>დამთავრების თარიღი</h4>
        <p class="task-due-date">${new Date(
          task.due_date
        ).toLocaleDateString()}</p>
    </div>

    <!-- Assignee Information Section -->
    <div class="task-info-row">
        <img src="./img/progile.png" alt="pro-icon" class="icon">
        <h4>პასუხისმგებელი თანამშრომელი</h4>
        <div class="task-assignee">
            <img src="${
              task.employee.avatar
            }" alt="Employee Avatar" class="avatar">
            <span class="assignee-name">${task.employee.name} ${
        task.employee.surname
      }</span>
        </div>
    </div>
</div>
</div>
</div>
                        </div>
                    </div>
                </div>
            `;
    })
    .catch((error) => {
      console.error("Error loading task:", error);
      taskDetailContainer.innerHTML = "<p>Error loading task details.</p>";
    });
});
