// API Configuration
const API_BASE_URL = '/api';
let currentUser = null;
let authToken = null;
let selectedCalendarId = null;
let calendars = [];

// Authentication Functions
function showLogin() {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('login-form').classList.add('active');
}

function showRegister() {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('register-form').classList.add('active');
}

async function login(email, password) {
    const response = await apiCall('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
    
    authToken = response.sessionToken;
    currentUser = response;
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showMainApp();
}

async function register(name, email, password, timezone) {
    await apiCall('/users/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, timezone })
    });
    
    // Auto-login after registration
    await login(email, password);
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    showAuthSection();
}

function showMainApp() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    document.getElementById('user-name').textContent = currentUser.name;
    loadCalendars();
}

function showAuthSection() {
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('main-app').classList.add('hidden');
}

// Utility Functions
function showMessage(message, type = 'success') {
    const messageArea = document.getElementById('message-area');
    messageArea.innerHTML = `<div class="${type}">${message}</div>`;
    setTimeout(() => {
        messageArea.innerHTML = '';
    }, 3000);
}

function formatDateTime(dateTimeString) {
    return new Date(dateTimeString).toLocaleString();
}

// Enhanced API call with authentication
async function apiCall(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        if (response.status === 401) {
            logout();
            throw new Error('Authentication required');
        }
        
        if (!response.ok) {
            let errorMessage;
            try {
                const error = await response.json();
                errorMessage = error.message || `HTTP error! status: ${response.status}`;
            } catch {
                errorMessage = `HTTP error! status: ${response.status}`;
            }
            throw new Error(errorMessage);
        }
        
        return response.status === 204 ? null : await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        showMessage(`Error: ${error.message}`, 'error');
        throw error;
    }
}

// Calendar Functions
async function loadCalendars() {
    try {
        calendars = await apiCall(`/calendars/user/${currentUser.userId}`);
        renderCalendars();
    } catch (error) {
        document.getElementById('calendar-list').innerHTML = 
            '<li class="error">Failed to load calendars</li>';
    }
}

function renderCalendars() {
    const calendarList = document.getElementById('calendar-list');
    if (calendars.length === 0) {
        calendarList.innerHTML = '<li>No calendars found</li>';
        return;
    }

    calendarList.innerHTML = calendars.map(calendar => 
        `<li class="calendar-item" data-calendar-id="${calendar.id}" 
             style="border-left-color: ${calendar.color}">
            ${calendar.name}
        </li>`
    ).join('');

    // Add click handlers
    document.querySelectorAll('.calendar-item').forEach(item => {
        item.addEventListener('click', () => selectCalendar(item.dataset.calendarId));
    });
}

async function createCalendar(name, color) {
    const calendar = await apiCall('/calendars', {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            color: color,
            ownerId: currentUser.userId
        })
    });
    
    calendars.push(calendar);
    renderCalendars();
    showMessage('Calendar created successfully!');
}

// Event Functions
async function selectCalendar(calendarId) {
    selectedCalendarId = calendarId;
    
    // Update UI
    document.querySelectorAll('.calendar-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-calendar-id="${calendarId}"]`).classList.add('active');
    
    await loadEvents(calendarId);
}

async function loadEvents(calendarId) {
    try {
        const events = await apiCall(`/calendars/${calendarId}/events`);
        renderEvents(events);
    } catch (error) {
        document.getElementById('event-list').innerHTML = 
            '<div class="error">Failed to load events</div>';
    }
}

function renderEvents(events) {
    const eventList = document.getElementById('event-list');
    if (events.length === 0) {
        eventList.innerHTML = '<div>No events found for this calendar</div>';
        return;
    }

    eventList.innerHTML = events.map(event => 
        `<div class="event-item">
            <div class="event-title">${event.title}</div>
            <div class="event-time">
                ${formatDateTime(event.startTime)} - ${formatDateTime(event.endTime)}
            </div>
            ${event.description ? `<div>${event.description}</div>` : ''}
        </div>`
    ).join('');
}

async function createEvent(title, description, startTime, endTime) {
    if (!selectedCalendarId) {
        showMessage('Please select a calendar first', 'error');
        return;
    }

    const event = await apiCall('/events', {
        method: 'POST',
        body: JSON.stringify({
            title: title,
            description: description,
            startTime: startTime,
            endTime: endTime,
            calendarId: selectedCalendarId
        })
    });
    
    await loadEvents(selectedCalendarId);
    showMessage('Event created successfully!');
}

// Event Listeners
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        await login(email, password);
    } catch (error) {
        showMessage('Login failed. Please check your credentials.', 'error');
    }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const timezone = document.getElementById('register-timezone').value;
    
    try {
        await register(name, email, password, timezone);
        showMessage('Registration successful! Welcome to SimpleCal!', 'success');
    } catch (error) {
        showMessage('Registration failed. Please try again.', 'error');
    }
});

document.getElementById('calendar-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('calendar-name').value;
    const color = document.getElementById('calendar-color').value;
    
    await createCalendar(name, color);
    
    // Reset form
    e.target.reset();
    document.getElementById('calendar-color').value = '#2196F3';
});

document.getElementById('event-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('event-title').value;
    const description = document.getElementById('event-description').value;
    const startTime = document.getElementById('event-start').value;
    const endTime = document.getElementById('event-end').value;
    
    await createEvent(title, description, startTime, endTime);
    
    // Reset form
    e.target.reset();
});

// Check for existing authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = JSON.parse(savedUser);
        showMainApp();
    } else {
        showAuthSection();
    }
});
