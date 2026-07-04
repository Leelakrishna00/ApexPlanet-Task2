document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. CONTACT FORM VALIDATION
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const userNameInput = document.getElementById('user-name');
    const userEmailInput = document.getElementById('user-email');
    const messageInput = document.getElementById('message');
    
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const formStatus = document.getElementById('form-status');

    // Email validation helper pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation handler
    function validateForm(e) {
        let isValid = true;

        // Reset errors
        resetError(userNameInput, nameError);
        resetError(userEmailInput, emailError);
        resetError(messageInput, messageError);
        formStatus.style.display = 'none';

        // Check Name
        if (!userNameInput.value.trim()) {
            showError(userNameInput, nameError, 'Name is required');
            isValid = false;
        }

        // Check Email
        const emailVal = userEmailInput.value.trim();
        if (!emailVal) {
            showError(userEmailInput, emailError, 'Email address is required');
            isValid = false;
        } else if (!emailRegex.test(emailVal)) {
            showError(userEmailInput, emailError, 'Please enter a valid email format');
            isValid = false;
        }

        // Check Message
        if (!messageInput.value.trim()) {
            showError(messageInput, messageError, 'System message is required');
            isValid = false;
        }

        return isValid;
    }

    function showError(input, errorSpan, message) {
        input.classList.add('error-input');
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
    }

    function resetError(input, errorSpan) {
        input.classList.remove('error-input');
        errorSpan.style.display = 'none';
    }

    // Input event listeners for real-time validation clearing
    userNameInput.addEventListener('input', () => {
        if (userNameInput.value.trim()) resetError(userNameInput, nameError);
    });
    userEmailInput.addEventListener('input', () => {
        const emailVal = userEmailInput.value.trim();
        if (emailVal && emailRegex.test(emailVal)) resetError(userEmailInput, emailError);
    });
    messageInput.addEventListener('input', () => {
        if (messageInput.value.trim()) resetError(messageInput, messageError);
    });

    // Form submit listener
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateForm()) {
                console.log('Form validated successfully. Sending data...');
                console.log({
                    name: userNameInput.value.trim(),
                    email: userEmailInput.value.trim(),
                    message: messageInput.value.trim(),
                    timestamp: new Date().toISOString()
                });

                // Display success banner
                formStatus.textContent = '✓ Connection request submitted successfully!';
                formStatus.className = 'status-alert status-success';
                formStatus.style.display = 'block';

                // Clear input fields
                contactForm.reset();
            } else {
                console.warn('Form validation failed.');
            }
        });
    }


    // ==========================================
    // 2. DYNAMIC TO-DO TASK MANAGER
    // ==========================================
    const todoInput = document.getElementById('todo-input');
    const todoPriority = document.getElementById('todo-priority');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const taskEmptyState = document.getElementById('task-empty-state');

    // In-memory tasks state
    let tasks = [
        { id: 1, text: 'Initialize primary system configurations', priority: 'high', completed: true },
        { id: 2, text: 'Audit network security channels', priority: 'medium', completed: false },
        { id: 3, text: 'Clean local browser visual caching', priority: 'low', completed: false }
    ];

    // Render task items
    function renderTasks() {
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            taskEmptyState.style.display = 'block';
            return;
        }

        taskEmptyState.style.display = 'none';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.setAttribute('data-id', task.id);

            li.innerHTML = `
                <div class="task-info">
                    <div class="task-checkbox"></div>
                    <span class="task-text">${escapeHTML(task.text)}</span>
                </div>
                <div class="task-meta">
                    <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                    <button class="delete-btn" aria-label="Delete task">
                        &times;
                    </button>
                </div>
            `;

            // Toggle complete trigger
            li.querySelector('.task-info').addEventListener('click', () => {
                toggleTask(task.id);
            });

            // Delete task trigger
            li.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTask(task.id);
            });

            taskList.appendChild(li);
        });
    }

    // Add task handler
    function addTask() {
        const text = todoInput.value.trim();
        const priority = todoPriority.value;

        if (!text) {
            todoInput.classList.add('error-input');
            setTimeout(() => todoInput.classList.remove('error-input'), 1000);
            return;
        }

        const newTask = {
            id: Date.now(),
            text: text,
            priority: priority,
            completed: false
        };

        tasks.push(newTask);
        todoInput.value = '';
        renderTasks();
    }

    // Toggle task state
    function toggleTask(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        renderTasks();
    }

    // Delete task state
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    }

    // Event listeners
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', addTask);
    }
    if (todoInput) {
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });
    }


    // ==========================================
    // 3. DYNAMIC IMAGE GALLERY
    // ==========================================
    const galleryUrl = document.getElementById('gallery-url');
    const galleryTitle = document.getElementById('gallery-title');
    const addImageBtn = document.getElementById('add-image-btn');
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryFile = document.getElementById('gallery-file');
    const uploadBtn = document.getElementById('upload-btn');
    const galleryStatus = document.getElementById('gallery-status');

    // Helper functions for gallery status notifications
    function showGalleryStatus(message, type = 'error') {
        if (!galleryStatus) return;
        galleryStatus.textContent = message;
        galleryStatus.className = `status-alert ${type === 'success' ? 'status-success' : 'status-error'}`;
        galleryStatus.style.display = 'block';
    }

    function clearGalleryStatus() {
        if (galleryStatus) {
            galleryStatus.style.display = 'none';
        }
    }

    // Default Images (using fully valid, high-resolution Unsplash URLs)
    let galleryItems = [
        {
            id: 1,
            url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
            title: 'Digital Workspace',
            date: 'June 2026'
        },
        {
            id: 2,
            url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
            title: 'Core Mainframe',
            date: 'June 2026'
        },
        {
            id: 3,
            url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
            title: 'Synthesis Lab',
            date: 'June 2026'
        }
    ];

    // Render Gallery
    function renderGallery() {
        galleryGrid.innerHTML = '';

        galleryItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'gallery-item';
            
            card.innerHTML = `
                <img src="${escapeHTML(item.url)}" alt="${escapeHTML(item.title)}" class="gallery-image" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=600&q=80';">
                <div class="gallery-overlay">
                    <p class="gallery-caption">${escapeHTML(item.title)}</p>
                    <div class="gallery-actions">
                        <span class="gallery-date">${item.date}</span>
                        <button class="delete-btn" aria-label="Delete image">Delete</button>
                    </div>
                </div>
            `;

            // Delete Image Trigger
            card.querySelector('.delete-btn').addEventListener('click', () => {
                deleteImage(item.id);
            });

            galleryGrid.appendChild(card);
        });
    }

    // Add Image Handler
    function addImage() {
        const url = galleryUrl.value.trim();
        const title = galleryTitle.value.trim();

        clearGalleryStatus();

        if (!url || !title) {
            if (!url) galleryUrl.classList.add('error-input');
            if (!title) galleryTitle.classList.add('error-input');
            
            setTimeout(() => {
                galleryUrl.classList.remove('error-input');
                galleryTitle.classList.remove('error-input');
            }, 1000);
            showGalleryStatus('Please provide both a valid image source (URL or file) and a caption.');
            return;
        }

        // Check for local file path injection (which browsers block due to security settings)
        if (url.startsWith('file:') || url.match(/^[a-zA-Z]:\\/) || url.startsWith('\\\\')) {
            showGalleryStatus('⚠️ Security Notice: Web browsers block direct access to local file paths (like C:\\path). Please click "Upload File" to load local files safely.');
            galleryUrl.classList.add('error-input');
            setTimeout(() => galleryUrl.classList.remove('error-input'), 2000);
            return;
        }

        const newItem = {
            id: Date.now(),
            url: url,
            title: title,
            date: 'Just Now'
        };

        galleryItems.push(newItem);
        
        // Reset inputs
        galleryUrl.value = '';
        galleryTitle.value = '';

        renderGallery();
    }

    // Delete Image Handler
    function deleteImage(id) {
        galleryItems = galleryItems.filter(item => item.id !== id);
        renderGallery();
    }

    if (addImageBtn) {
        addImageBtn.addEventListener('click', addImage);
    }

    // Clear alerts when users interact with fields
    if (galleryUrl) {
        galleryUrl.addEventListener('input', () => {
            clearGalleryStatus();
        });
    }
    if (galleryTitle) {
        galleryTitle.addEventListener('input', () => {
            clearGalleryStatus();
        });
    }

    if (uploadBtn && galleryFile) {
        uploadBtn.addEventListener('click', () => {
            galleryFile.click();
        });

        galleryFile.addEventListener('change', (e) => {
            clearGalleryStatus();
            const file = e.target.files[0];
            if (file) {
                // If title is empty, pre-fill with file name
                if (!galleryTitle.value.trim()) {
                    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                    galleryTitle.value = nameWithoutExt;
                }
                
                // Read file as base64 URL
                const reader = new FileReader();
                reader.onload = (event) => {
                    galleryUrl.value = event.target.result; // This is the base64 string
                    
                    // Visual feedback
                    const originalText = uploadBtn.textContent;
                    uploadBtn.textContent = '✓ Loaded';
                    uploadBtn.style.color = 'var(--success-color)';
                    setTimeout(() => {
                        uploadBtn.textContent = originalText;
                        uploadBtn.style.color = '';
                    }, 2000);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Helper functions
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // Initial Renders
    renderTasks();
    renderGallery();
});
