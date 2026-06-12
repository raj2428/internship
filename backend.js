// To-Do List Application Logic
// Handles CRUD operations, local storage synchronization, filtering, sorting, searching, and UI rendering.

document.addEventListener('DOMContentLoaded', () => {
  // Elements Selection
  const todoForm = document.getElementById('todo-form');
  const todoTitleInput = document.getElementById('todo-title');
  const todoDescInput = document.getElementById('todo-desc');
  const todoPrioritySelect = document.getElementById('todo-priority');
  const todoDueInput = document.getElementById('todo-due');
  const todoSearchInput = document.getElementById('todo-search');
  const todoList = document.getElementById('todo-list');
  const todoEmptyState = document.getElementById('todo-empty-state');
  const todoSortSelect = document.getElementById('todo-sort-select');
  const todoClearCompletedBtn = document.getElementById('todo-clear-completed');
  
  const statsActiveEl = document.getElementById('todo-stats-active');
  const statsCompletedEl = document.getElementById('todo-stats-completed');
  const statsPctEl = document.getElementById('todo-stats-pct');

  // Verify all essential elements exist before executing
  if (!todoList || !todoForm) return;

  // Application State
  let tasks = [];
  let currentFilter = 'all';
  let currentSearch = '';
  let currentSort = 'createdAt-desc';
  let editingTaskId = null;

  // Priority Values Map for Sorting
  const PRIORITY_VALUES = {
    low: 1,
    medium: 2,
    high: 3
  };

  // Load tasks from LocalStorage
  function loadTasks() {
    try {
      const storedTasks = localStorage.getItem('todo-tasks');
      tasks = storedTasks ? JSON.parse(storedTasks) : [];
      
      // Ensure existing tasks have all required fields (migration safety)
      tasks = tasks.map(task => ({
        id: task.id || crypto.randomUUID(),
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate || '',
        completed: !!task.completed,
        createdAt: task.createdAt || Date.now()
      }));
    } catch (e) {
      console.error('Failed to load tasks from local storage:', e);
      tasks = [];
    }
  }

  // Save tasks to LocalStorage
  function saveTasks() {
    try {
      localStorage.setItem('todo-tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to local storage:', e);
    }
  }

  // Add a new task
  function addTask(title, description, priority, dueDate) {
    const newTask = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      completed: false,
      createdAt: Date.now()
    };
    tasks.push(newTask);
    saveTasks();
    updateStats();
    renderTasks();
  }

  // Edit/Update task
  function updateTask(id, title, description, priority, dueDate) {
    tasks = tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          title: title.trim(),
          description: description.trim(),
          priority,
          dueDate
        };
      }
      return task;
    });
    saveTasks();
    renderTasks();
  }

  // Toggle task completion
  function toggleTaskCompletion(id) {
    tasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    saveTasks();
    updateStats();
    renderTasks();
  }

  // Delete task with slide-out animation
  function deleteTask(id) {
    const taskElement = todoList.querySelector(`[data-task-id="${id}"]`);
    if (taskElement) {
      taskElement.classList.add('deleting');
      // Wait for animation to finish before removing from state and re-rendering
      taskElement.addEventListener('animationend', () => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        updateStats();
        renderTasks();
      });
    } else {
      tasks = tasks.filter(task => task.id !== id);
      saveTasks();
      updateStats();
      renderTasks();
    }
  }

  // Check if date is overdue
  function isOverdue(dueDate, completed) {
    if (!dueDate || completed) return false;
    // Set both dates to midnight to only compare calendar days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }

  // Format date nicely (e.g. "Jun 15, 2026")
  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateStr;
    }
  }

  // Update statistics dashboards
  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (statsActiveEl) statsActiveEl.textContent = active;
    if (statsCompletedEl) statsCompletedEl.textContent = completed;
    if (statsPctEl) statsPctEl.textContent = `${pct}%`;

    // Show/hide clear completed button
    if (todoClearCompletedBtn) {
      todoClearCompletedBtn.style.display = completed > 0 ? 'inline-block' : 'none';
    }
  }

  // Filter and sort tasks array
  function getFilteredAndSortedTasks() {
    // 1. Filtering
    let result = tasks.filter(task => {
      // Filter tab
      if (currentFilter === 'active' && task.completed) return false;
      if (currentFilter === 'completed' && !task.completed) return false;

      // Search query
      if (currentSearch) {
        const query = currentSearch.toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(query);
        const descMatch = task.description.toLowerCase().includes(query);
        return titleMatch || descMatch;
      }
      return true;
    });

    // 2. Sorting
    result.sort((a, b) => {
      const [field, direction] = currentSort.split('-');
      const isAsc = direction === 'asc';

      if (field === 'createdAt') {
        return isAsc ? a.createdAt - b.createdAt : b.createdAt - a.createdAt;
      }

      if (field === 'dueDate') {
        // Handle empty due dates (push to bottom)
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return isAsc
          ? new Date(a.dueDate) - new Date(b.dueDate)
          : new Date(b.dueDate) - new Date(a.dueDate);
      }

      if (field === 'priority') {
        const aVal = PRIORITY_VALUES[a.priority] || 0;
        const bVal = PRIORITY_VALUES[b.priority] || 0;
        return isAsc ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return result;
  }

  // Render list items dynamically
  function renderTasks() {
    const listTasks = getFilteredAndSortedTasks();
    
    // Clear list
    todoList.innerHTML = '';

    // Show empty state if appropriate
    if (listTasks.length === 0) {
      todoEmptyState.style.display = 'flex';
      
      // Customize empty state message if filtering/searching
      const titleEl = todoEmptyState.querySelector('.todo-empty-title');
      const descEl = todoEmptyState.querySelector('.todo-empty-desc');
      if (currentSearch || currentFilter !== 'all') {
        titleEl.textContent = 'No tasks found';
        descEl.textContent = 'Try resetting your search query or filters.';
      } else {
        titleEl.textContent = 'All caught up!';
        descEl.textContent = 'Create a new task to get started.';
      }
      return;
    }

    todoEmptyState.style.display = 'none';

    listTasks.forEach(task => {
      const todoItem = document.createElement('div');
      todoItem.className = `todo-item ${task.completed ? 'completed' : ''}`;
      todoItem.setAttribute('role', 'listitem');
      todoItem.setAttribute('data-task-id', task.id);

      // Check if task is currently being edited
      if (editingTaskId === task.id) {
        todoItem.innerHTML = `
          <form class="todo-edit-form" novalidate>
            <div class="form-group" style="margin-bottom: 0.75rem;">
              <label class="form-label" for="edit-title-${task.id}">Task Title<span class="required" style="color:var(--color-brand); font-weight:bold;">*</span></label>
              <input type="text" id="edit-title-${task.id}" class="form-control edit-title-input" value="${escapeHTML(task.title)}" required />
            </div>
            
            <div class="form-group" style="margin-bottom: 0.75rem;">
              <label class="form-label" for="edit-desc-${task.id}">Description</label>
              <textarea id="edit-desc-${task.id}" class="form-control edit-desc-input" rows="2" placeholder="Task description...">${escapeHTML(task.description)}</textarea>
            </div>
            
            <div class="form-grid" style="grid-template-columns: 1fr 1fr; gap: 0.75rem; display: grid; margin-bottom: 0.75rem;">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="edit-priority-${task.id}">Priority</label>
                <select id="edit-priority-${task.id}" class="form-control edit-priority-select" style="background: var(--bg-surface-alt); height: auto;">
                  <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                  <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                  <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                </select>
              </div>
              
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="edit-due-${task.id}">Due Date</label>
                <input type="date" id="edit-due-${task.id}" class="form-control edit-due-input" style="background: var(--bg-surface-alt); line-height: normal;" value="${task.dueDate || ''}" />
              </div>
            </div>
            
            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
              <button type="submit" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.8rem;">Save</button>
              <button type="button" class="btn btn-outline edit-cancel-btn" style="padding: 0.5rem 1rem; font-size: 0.8rem;">Cancel</button>
            </div>
          </form>
        `;
      } else {
        // Standard View Mode
        const taskOverdue = isOverdue(task.dueDate, task.completed);
        const formattedDate = formatDate(task.dueDate);
        
        todoItem.innerHTML = `
          <div class="todo-checkbox-wrapper">
            <input type="checkbox" class="todo-cb-input" id="cb-${task.id}" ${task.completed ? 'checked' : ''} aria-checked="${task.completed}" aria-label="Toggle task status" />
            <span class="todo-cb-custom"></span>
          </div>
          
          <div class="todo-item-content">
            <div class="todo-item-title">${escapeHTML(task.title)}</div>
            ${task.description ? `<div class="todo-item-desc">${escapeHTML(task.description)}</div>` : ''}
            
            <div class="todo-meta">
              <span class="todo-badge todo-badge-prio-${task.priority}">
                ${task.priority} Priority
              </span>
              ${task.dueDate ? `
                <span class="todo-badge todo-badge-due ${taskOverdue ? 'overdue' : ''}">
                  ${taskOverdue ? '⚠️ Overdue: ' : '📅 Due: '}${formattedDate}
                </span>
              ` : ''}
            </div>
          </div>
          
          <div class="todo-item-actions">
            <button type="button" class="todo-btn-icon edit-btn" aria-label="Edit task">
              ✏️
            </button>
            <button type="button" class="todo-btn-icon delete delete-btn" aria-label="Delete task">
              🗑️
            </button>
          </div>
        `;
      }

      todoList.appendChild(todoItem);
    });
  }

  // Utility: Escape HTML strings to prevent XSS
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- EVENT HANDLERS ---

  // 1. Submit Form (Create Task)
  todoForm.addEventListener('submit', e => {
    e.preventDefault();

    const title = todoTitleInput.value.trim();
    const description = todoDescInput.value.trim();
    const priority = todoPrioritySelect.value;
    const dueDate = todoDueInput.value;

    // Perform validation
    if (!title) {
      todoTitleInput.classList.add('error');
      todoTitleInput.focus();
      return;
    }

    todoTitleInput.classList.remove('error');

    // Add task and reset form
    addTask(title, description, priority, dueDate);
    todoForm.reset();
  });

  // 2. Event Delegation for Task Item controls (Toggle, Edit, Cancel, Save, Delete)
  todoList.addEventListener('change', e => {
    // Checkbox toggle
    if (e.target.classList.contains('todo-cb-input')) {
      const taskItem = e.target.closest('.todo-item');
      if (taskItem) {
        const taskId = taskItem.getAttribute('data-task-id');
        toggleTaskCompletion(taskId);
      }
    }
  });

  todoList.addEventListener('click', e => {
    const taskItem = e.target.closest('.todo-item');
    if (!taskItem) return;
    const taskId = taskItem.getAttribute('data-task-id');

    // Click on Edit button
    if (e.target.closest('.edit-btn')) {
      editingTaskId = taskId;
      renderTasks();
      // Focus on the title input of the edit form
      const editInput = taskItem.querySelector('.edit-title-input');
      if (editInput) editInput.focus();
      return;
    }

    // Click on Cancel Edit button
    if (e.target.closest('.edit-cancel-btn')) {
      editingTaskId = null;
      renderTasks();
      return;
    }

    // Click on Delete button
    if (e.target.closest('.delete-btn')) {
      deleteTask(taskId);
      return;
    }
  });

  // Handle Edit Form Submission inline
  todoList.addEventListener('submit', e => {
    if (e.target.classList.contains('todo-edit-form')) {
      e.preventDefault();
      const taskItem = e.target.closest('.todo-item');
      if (!taskItem) return;
      const taskId = taskItem.getAttribute('data-task-id');

      const titleInput = e.target.querySelector('.edit-title-input');
      const descInput = e.target.querySelector('.edit-desc-input');
      const prioritySelect = e.target.querySelector('.edit-priority-select');
      const dueInput = e.target.querySelector('.edit-due-input');

      const title = titleInput.value.trim();
      const desc = descInput.value.trim();
      const priority = prioritySelect.value;
      const dueDate = dueInput.value;

      if (!title) {
        titleInput.classList.add('error');
        titleInput.focus();
        return;
      }

      editingTaskId = null;
      updateTask(taskId, title, desc, priority, dueDate);
    }
  });

  // 3. Filters handling (Tabs)
  const filterButtons = document.querySelectorAll('.todo-filters .filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      // Update current filter and re-render
      currentFilter = btn.getAttribute('data-filter');
      renderTasks();

      // Update screen reader live region
      const liveRegion = document.getElementById('live-region');
      if (liveRegion) {
        liveRegion.textContent = `Filtered tasks by: ${btn.textContent}`;
      }
    });
  });

  // 4. Sort handling
  if (todoSortSelect) {
    todoSortSelect.addEventListener('change', e => {
      currentSort = e.target.value;
      renderTasks();
    });
  }

  // 5. Search input handling
  if (todoSearchInput) {
    todoSearchInput.addEventListener('input', e => {
      currentSearch = e.target.value.trim();
      renderTasks();
    });
  }

  // 6. Clear completed tasks
  if (todoClearCompletedBtn) {
    todoClearCompletedBtn.addEventListener('click', () => {
      // Find all completed tasks
      const completedTaskIds = tasks.filter(t => t.completed).map(t => t.id);
      
      // Animate deletion for visible items
      let animationCount = 0;
      completedTaskIds.forEach(id => {
        const itemEl = todoList.querySelector(`[data-task-id="${id}"]`);
        if (itemEl) {
          animationCount++;
          itemEl.classList.add('deleting');
          itemEl.addEventListener('animationend', onAnimated);
        }
      });

      // If no elements were animated, delete directly
      if (animationCount === 0) {
        performClear();
      }

      function onAnimated() {
        animationCount--;
        if (animationCount === 0) {
          performClear();
        }
      }

      function performClear() {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        updateStats();
        renderTasks();
      }
    });
  }

  // Initial Bootstrapping
  loadTasks();
  updateStats();
  renderTasks();
});
