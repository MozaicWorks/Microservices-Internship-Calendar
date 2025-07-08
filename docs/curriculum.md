# Microservices Learning Program - Calendar Application

## Program Overview

**Duration:** 6 weeks  
**Time Commitment:** 2 days per week  
**Learning Style:** Self-paced with weekly mentor interactions (starting week 4)  
**Target Audience:** Junior developers with basic Java syntax knowledge  
**Goal:** Build foundational understanding of microservices architecture through hands-on development

## Learning Approach

This program follows a **progressive complexity method** where you'll:
1. Build a monolithic calendar application (Weeks 1-2)
2. Gradually decompose it into microservices (Weeks 3-6)
3. Experience the evolution from monolith to distributed system
4. Learn through practical implementation rather than theory alone

## Project: SimpleCal - A Calendar Management System

You'll build a simplified calendar application similar to Google Calendar with these core features:
- User registration and authentication
- Create, edit, and delete events
- Calendar views (daily, weekly, monthly)
- Event sharing and permissions
- Notification system for reminders

---

## Week 1: Java Foundation & Monolithic Setup

### Learning Objectives
- Strengthen Java fundamentals for enterprise development
- Set up a Spring Boot application from scratch
- Understand basic web service concepts
- Build core calendar functionality

### Topics Covered
- Java collections, streams, and exception handling
- Spring Boot basics and auto-configuration
- REST API fundamentals
- JPA and database operations
- Basic authentication with Spring Security

### Required Reading
- **"Spring Boot in Action"** (Craig Walls) - Chapters 1-3
- **Oracle Java Tutorial** - Collections and Streams sections
- **"RESTful Web Services"** (Richardson & Ruby) - Chapter 1
- **Spring Boot Reference Documentation** - Getting Started guide

### Practical Exercise: Build Monolithic Calendar

**Day 1: Project Setup and User Management**
- Create Spring Boot project using Spring Initializr
- Set up H2 database for development
- Create User entity and repository
- Implement basic user registration and login
- Create REST endpoints for user management

**Day 2: Calendar and Event Management + Simple UI**
- Create Calendar and Event entities
- Implement JPA relationships between User, Calendar, and Event
- Build REST endpoints for calendar operations
- Create simple HTML/JavaScript frontend to interact with the monolithic API
- Test the complete application (backend + frontend)

### Complete REST API Specification

#### User Management APIs
```http
# Register new user
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securePassword123",
  "timezone": "America/New_York"
}

Response: 201 Created
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "timezone": "America/New_York",
  "createdAt": "2024-01-15T10:00:00Z"
}

# User login
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "userId": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "sessionToken": "jwt_token_here"
}

# Get user profile
GET /api/users/{userId}
Authorization: Bearer {sessionToken}

Response: 200 OK
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "timezone": "America/New_York",
  "createdAt": "2024-01-15T10:00:00Z"
}

# Update user profile
PUT /api/users/{userId}
Content-Type: application/json
Authorization: Bearer {sessionToken}

{
  "name": "John Smith",
  "timezone": "Europe/London"
}

Response: 200 OK
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Smith",
  "timezone": "Europe/London",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

#### Calendar Management APIs
```http
# Get user's calendars
GET /api/calendars/user/{userId}
Authorization: Bearer {sessionToken}

Response: 200 OK
[
  {
    "id": 1,
    "name": "Work Calendar",
    "color": "#FF5733",
    "ownerId": 1,
    "createdAt": "2024-01-15T10:00:00Z"
  },
  {
    "id": 2,
    "name": "Personal Calendar",
    "color": "#2196F3",
    "ownerId": 1,
    "createdAt": "2024-01-15T10:05:00Z"
  }
]

# Create new calendar
POST /api/calendars
Content-Type: application/json
Authorization: Bearer {sessionToken}

{
  "name": "Work Calendar",
  "color": "#FF5733",
  "ownerId": 1
}

Response: 201 Created
{
  "id": 1,
  "name": "Work Calendar",
  "color": "#FF5733",
  "ownerId": 1,
  "createdAt": "2024-01-15T10:00:00Z"
}

# Get specific calendar
GET /api/calendars/{calendarId}
Authorization: Bearer {sessionToken}

Response: 200 OK
{
  "id": 1,
  "name": "Work Calendar",
  "color": "#FF5733",
  "ownerId": 1,
  "createdAt": "2024-01-15T10:00:00Z"
}

# Update calendar
PUT /api/calendars/{calendarId}
Content-Type: application/json
Authorization: Bearer {sessionToken}

{
  "name": "Updated Work Calendar",
  "color": "#4CAF50"
}

Response: 200 OK
{
  "id": 1,
  "name": "Updated Work Calendar",
  "color": "#4CAF50",
  "ownerId": 1,
  "updatedAt": "2024-01-15T11:00:00Z"
}

# Delete calendar
DELETE /api/calendars/{calendarId}
Authorization: Bearer {sessionToken}

Response: 204 No Content
```

#### Event Management APIs
```http
# Get events for a calendar
GET /api/calendars/{calendarId}/events
Authorization: Bearer {sessionToken}
Query Parameters:
  - start (optional): ISO date string (2024-01-15)
  - end (optional): ISO date string (2024-01-22)

Response: 200 OK
[
  {
    "id": 1,
    "title": "Team Meeting",
    "description": "Weekly team sync",
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T11:00:00Z",
    "calendarId": 1,
    "createdAt": "2024-01-15T09:00:00Z"
  },
  {
    "id": 2,
    "title": "Lunch with Client",
    "description": "Discuss project requirements",
    "startTime": "2024-01-15T12:00:00Z",
    "endTime": "2024-01-15T13:00:00Z",
    "calendarId": 1,
    "createdAt": "2024-01-15T09:05:00Z"
  }
]

# Create new event
POST /api/events
Content-Type: application/json
Authorization: Bearer {sessionToken}

{
  "title": "Team Meeting",
  "description": "Weekly team sync",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T11:00:00Z",
  "calendarId": 1
}

Response: 201 Created
{
  "id": 1,
  "title": "Team Meeting",
  "description": "Weekly team sync",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T11:00:00Z",
  "calendarId": 1,
  "createdAt": "2024-01-15T09:00:00Z"
}

# Get specific event
GET /api/events/{eventId}
Authorization: Bearer {sessionToken}

Response: 200 OK
{
  "id": 1,
  "title": "Team Meeting",
  "description": "Weekly team sync",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T11:00:00Z",
  "calendarId": 1,
  "createdAt": "2024-01-15T09:00:00Z"
}

# Update event
PUT /api/events/{eventId}
Content-Type: application/json
Authorization: Bearer {sessionToken}

{
  "title": "Updated Team Meeting",
  "description": "Weekly team sync - updated agenda",
  "startTime": "2024-01-15T10:30:00Z",
  "endTime": "2024-01-15T11:30:00Z"
}

Response: 200 OK
{
  "id": 1,
  "title": "Updated Team Meeting",
  "description": "Weekly team sync - updated agenda",
  "startTime": "2024-01-15T10:30:00Z",
  "endTime": "2024-01-15T11:30:00Z",
  "calendarId": 1,
  "updatedAt": "2024-01-15T11:00:00Z"
}

# Delete event
DELETE /api/events/{eventId}
Authorization: Bearer {sessionToken}

Response: 204 No Content

# Search events across user's calendars
GET /api/events/search
Authorization: Bearer {sessionToken}
Query Parameters:
  - q: Search term
  - userId: User ID
  - start (optional): Start date filter
  - end (optional): End date filter

Response: 200 OK
[
  {
    "id": 1,
    "title": "Team Meeting",
    "description": "Weekly team sync",
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T11:00:00Z",
    "calendarId": 1,
    "calendarName": "Work Calendar"
  }
]
```

#### Error Response Format
```http
# All error responses follow this format
{
  "timestamp": "2024-01-15T10:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for field 'email': must be a valid email address",
  "path": "/api/users/register"
}

# Common HTTP Status Codes:
# 200 OK - Success
# 201 Created - Resource created successfully
# 204 No Content - Success with no response body
# 400 Bad Request - Invalid request data
# 401 Unauthorized - Invalid or missing authentication
# 403 Forbidden - User doesn't have permission
# 404 Not Found - Resource not found
# 409 Conflict - Resource already exists or conflict
# 500 Internal Server Error - Server error
```

**Simple Frontend Implementation (Week 1):**
```html
<!-- index.html - Enhanced for monolithic application -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SimpleCal - Calendar App</title>
    <style>
        /* Same styling as before, plus authentication styles */
        .auth-container {
            max-width: 400px;
            margin: 100px auto;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .auth-form {
            display: none;
        }
        .auth-form.active {
            display: block;
        }
        .tab-buttons {
            display: flex;
            margin-bottom: 20px;
        }
        .tab-button {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            background: #f5f5f5;
            cursor: pointer;
        }
        .tab-button.active {
            background: #2196F3;
            color: white;
        }
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <!-- Authentication Section -->
    <div id="auth-section" class="auth-container">
        <div class="tab-buttons">
            <button class="tab-button active" onclick="showLogin()">Login</button>
            <button class="tab-button" onclick="showRegister()">Register</button>
        </div>

        <!-- Login Form -->
        <form id="login-form" class="auth-form active">
            <h2>Login to SimpleCal</h2>
            <div class="form-group">
                <label for="login-email">Email:</label>
                <input type="email" id="login-email" required>
            </div>
            <div class="form-group">
                <label for="login-password">Password:</label>
                <input type="password" id="login-password" required>
            </div>
            <button type="submit" class="btn">Login</button>
        </form>

        <!-- Register Form -->
        <form id="register-form" class="auth-form">
            <h2>Register for SimpleCal</h2>
            <div class="form-group">
                <label for="register-name">Full Name:</label>
                <input type="text" id="register-name" required>
            </div>
            <div class="form-group">
                <label for="register-email">Email:</label>
                <input type="email" id="register-email" required>
            </div>
            <div class="form-group">
                <label for="register-password">Password:</label>
                <input type="password" id="register-password" required>
            </div>
            <div class="form-group">
                <label for="register-timezone">Timezone:</label>
                <select id="register-timezone">
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                </select>
            </div>
            <button type="submit" class="btn">Register</button>
        </form>
    </div>

    <!-- Main Application (hidden until authenticated) -->
    <div id="main-app" class="hidden">
        <div class="header">
            <h1>SimpleCal</h1>
            <p>Welcome, <span id="user-name"></span>! 
               <button onclick="logout()" class="btn btn-secondary">Logout</button></p>
        </div>

        <!-- Rest of the calendar interface as before -->
        <div class="container">
            <!-- Sidebar and main content as previously defined -->
        </div>
    </div>

    <script>
        // Enhanced JavaScript with authentication
        const API_BASE_URL = 'http://localhost:8080/api';
        let currentUser = null;
        let authToken = null;

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
                    const error = await response.json();
                    throw new Error(error.message || `HTTP error! status: ${response.status}`);
                }
                
                return response.status === 204 ? null : await response.json();
            } catch (error) {
                console.error('API call failed:', error);
                showMessage(`Error: ${error.message}`, 'error');
                throw error;
            }
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

        // Rest of calendar functions remain the same but now use authenticated API calls
    </script>
</body>
</html>
```

**Entities to Create:**
```java
// User entity
@Entity
public class User {
    @Id @GeneratedValue
    private Long id;
    private String email;
    private String name;
    private String password;
    private String timezone;
    // getters, setters, constructors
}

// Calendar entity  
@Entity
public class Calendar {
    @Id @GeneratedValue
    private Long id;
    private String name;
    private String color;
    @ManyToOne
    private User owner;
    // getters, setters, constructors
}

// Event entity
@Entity
public class Event {
    @Id @GeneratedValue
    private Long id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    @ManyToOne
    private Calendar calendar;
    // getters, setters, constructors
}
```

### Week 1 Deliverables
- Working Spring Boot application with user authentication
- User registration and login functionality
- Basic calendar and event CRUD operations
- Complete REST API with proper HTTP status codes
- Simple HTML/JavaScript frontend with authentication
- In-memory H2 database with sample data

### Self-Assessment Questions
1. Can users register and log in successfully through the web interface?
2. Can authenticated users create calendars and events via the UI?
3. Are all REST endpoints working correctly with proper authentication?
4. Do you understand the complete request/response flow from UI to database?
5. Can you navigate between login/register and the main calendar interface?

---

## Week 2: Database Design & Unit Testing

### Learning Objectives
- Implement proper database relationships
- Learn REST API best practices
- Add comprehensive error handling and validation
- Master unit testing strategies with JUnit and Mockito

### Topics Covered
- Advanced JPA associations and cascade operations
- REST API design principles and HTTP status codes
- Input validation with Bean Validation
- Exception handling in Spring Boot
- Unit testing with JUnit 5 and Mockito
- API documentation with OpenAPI/Swagger
- Spring Boot profiles and external configuration

### Required Reading
- **"Effective Java"** (Joshua Bloch) - Items 72-77 (Exceptions)
- **"REST API Design Rulebook"** (Mark Masse) - Chapters 1-4
- **Spring Boot Reference Documentation** - Testing section
- **OpenAPI 3.0 Specification** - Basic concepts

### Practical Exercise: Enhance the Calendar Application

**Day 1: Database Relationships and Unit Testing Setup**
- Add proper JPA relationships with cascade operations
- Implement input validation using Bean Validation annotations
- Set up comprehensive unit testing framework
- Write unit tests for service layer using Mockito
- Practice test-driven development for new features

**Day 2: Testing Strategies and Error Handling**
- Implement global exception handler with proper error responses
- Create repository layer tests with @DataJpaTest
- Add controller layer tests with @WebMvcTest
- Implement proper HTTP status codes for all endpoints
- Add test coverage reporting with JaCoCo

**Testing Examples to Implement:**
```java
// Service layer unit test
@ExtendWith(MockitoExtension.class)
class CalendarServiceTest {
    
    @Mock
    private CalendarRepository calendarRepository;
    
    @InjectMocks
    private CalendarService calendarService;
    
    @Test
    @DisplayName("Should create calendar when valid request provided")
    void shouldCreateCalendarWhenValidRequest() {
        // Given
        CreateCalendarRequest request = new CreateCalendarRequest("Work Calendar", "#FF5733", 1L);
        Calendar savedCalendar = new Calendar("Work Calendar", "#FF5733", 1L);
        when(calendarRepository.save(any(Calendar.class))).thenReturn(savedCalendar);
        
        // When
        CalendarDto result = calendarService.createCalendar(request);
        
        // Then
        assertThat(result.getName()).isEqualTo("Work Calendar");
        verify(calendarRepository).save(any(Calendar.class));
    }
}

// Repository layer test
@DataJpaTest
class CalendarRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private CalendarRepository calendarRepository;
    
    @Test
    @DisplayName("Should find calendars by owner id")
    void shouldFindCalendarsByOwnerId() {
        // Given
        User owner = new User("test@example.com", "Test User");
        entityManager.persistAndFlush(owner);
        
        Calendar calendar = new Calendar("Test Calendar", "#FF0000", owner.getId());
        entityManager.persistAndFlush(calendar);
        
        // When
        List<Calendar> calendars = calendarRepository.findByOwnerId(owner.getId());
        
        // Then
        assertThat(calendars).hasSize(1);
        assertThat(calendars.get(0).getName()).isEqualTo("Test Calendar");
    }
}

// Controller layer test
@WebMvcTest(CalendarController.class)
class CalendarControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private CalendarService calendarService;
    
    @Test
    @DisplayName("Should return 400 when invalid calendar data provided")
    void shouldReturn400WhenInvalidCalendarData() throws Exception {
        // Given
        String invalidRequest = """
            {
                "name": "",
                "color": "invalid-color"
            }
            """;
        
        // When & Then
        mockMvc.perform(post("/api/calendars")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidRequest))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors").exists());
    }
}
```

**New Features to Add:**
- Event conflict detection
- Recurring events (basic implementation)
- Event search functionality
- Calendar sharing permissions
- Time zone conversion utilities

**Enhanced APIs:**
```java
// Calendar Controller with proper error handling
@RestController
@RequestMapping("/api/calendars")
public class CalendarController {
    
    @PostMapping
    public ResponseEntity<CalendarDto> createCalendar(@Valid @RequestBody CreateCalendarRequest request) {
        // Implementation with proper validation and error handling
    }
    
    @GetMapping("/{id}/events")
    public ResponseEntity<List<EventDto>> getEvents(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        // Implementation with date range filtering
    }
}
```

### Week 2 Deliverables
- Enhanced data model with proper relationships
- Comprehensive input validation and error handling
- Complete unit test suite for all service methods
- OpenAPI/Swagger documentation for all endpoints
- Spring Boot profiles configuration (dev, test, prod)
- External configuration setup
- Enhanced UI with better error handling and user feedback

### Self-Assessment Questions
1. Can you access and navigate the Swagger UI for your API?
2. Can you switch between different profiles and see configuration changes?
3. Do your unit tests cover both success and failure scenarios?
4. Are your API responses properly documented with examples?
5. Does the UI properly handle errors and show user-friendly messages?
6. Can you test all functionality through both the UI and Swagger?

---

## Week 3: Introduction to Microservices

### Learning Objectives
- Understand microservices architecture principles
- Learn provided service decomposition rationale
- Implement your first service extraction
- Set up local development environment with Docker Compose

### Topics Covered
- Microservices vs monolithic architecture trade-offs
- Understanding service boundaries (provided decomposition)
- Service-to-service HTTP communication
- Docker and Docker Compose for local development
- Database per service pattern
- Local development workflow

### Required Reading
- **"Microservices Patterns"** (Chris Richardson) - Chapters 1-2
- **"Building Microservices"** (Sam Newman) - Chapters 1-3
- **Martin Fowler's "Microservices" article** - https://martinfowler.com/articles/microservices.html
- **Docker Compose Documentation** - Getting Started guide

### Service Decomposition (Provided)

You'll extract services based on these business capabilities:

1. **Calendar Service** - Manages calendars and events (extract first - clearest boundaries)
2. **User Service** - Handles user management and authentication  
3. **Notification Service** - Manages reminders and notifications
4. **Payment Service** - Handles premium features and event payments

**Why these boundaries:**
- **Calendar Service**: Core domain logic, high change frequency, clear data ownership
- **User Service**: Authentication concerns, different scaling needs, security focus
- **Notification Service**: Asynchronous processing, different infrastructure needs
- **Payment Service**: External integrations, compliance requirements, separate team expertise

### Practical Exercise: Extract Calendar Service and Setup Local Development

**Day 1: Service Extraction and Docker Setup**
- Extract Calendar and Event entities to new Calendar Service
- Create separate Spring Boot project for Calendar Service
- Set up Docker Compose for local development environment
- Configure service-to-service communication

**Day 2: Implement Service Communication**
- Update User Service to call Calendar Service
- Add proper error handling for service communication
- Test the multi-service setup locally

**Docker Compose Setup:**
```yaml
# docker-compose.yml
version: '3.8'
services:
  user-db:
    image: postgres:14
    environment:
      POSTGRES_DB: userdb
      POSTGRES_USER: user_service
      POSTGRES_PASSWORD: password
    ports:
      - "5433:5432"
    volumes:
      - user_data:/var/lib/postgresql/data

  calendar-db:
    image: postgres:14
    environment:
      POSTGRES_DB: calendardb
      POSTGRES_USER: calendar_service
      POSTGRES_PASSWORD: password
    ports:
      - "5434:5432"
    volumes:
      - calendar_data:/var/lib/postgresql/data

  user-service:
    build: ./user-service
    ports:
      - "8081:8081"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - DATABASE_URL=jdbc:postgresql://user-db:5432/userdb
      - DATABASE_USERNAME=user_service
      - DATABASE_PASSWORD=password
    depends_on:
      - user-db

  calendar-service:
    build: ./calendar-service
    ports:
      - "8082:8082"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - DATABASE_URL=jdbc:postgresql://calendar-db:5432/calendardb
      - DATABASE_USERNAME=calendar_service
      - DATABASE_PASSWORD=password
      - USER_SERVICE_URL=http://user-service:8081
    depends_on:
      - calendar-db
      - user-service

volumes:
  user_data:
  calendar_data:
```

**Service Communication Implementation:**
```java
// Calendar Service - HTTP Client Configuration
@Configuration
public class ServiceClientConfig {
    
    @Value("${user.service.url:http://localhost:8081}")
    private String userServiceUrl;
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
    @Bean
    public UserServiceClient userServiceClient(RestTemplate restTemplate) {
        return new UserServiceClient(restTemplate, userServiceUrl);
    }
}

// User Service Client
@Component
public class UserServiceClient {
    
    private final RestTemplate restTemplate;
    private final String userServiceUrl;
    
    public UserServiceClient(RestTemplate restTemplate, String userServiceUrl) {
        this.restTemplate = restTemplate;
        this.userServiceUrl = userServiceUrl;
    }
    
    public UserDto getUser(Long userId) {
        try {
            return restTemplate.getForObject(
                userServiceUrl + "/api/users/" + userId, 
                UserDto.class
            );
        } catch (Exception e) {
            throw new UserServiceException("Failed to fetch user: " + userId, e);
        }
    }
    
    public boolean userExists(Long userId) {
        try {
            UserDto user = getUser(userId);
            return user != null;
        } catch (Exception e) {
            return false;
        }
    }
}
```

### Week 3 Deliverables
- Separate Calendar Service project with own database
- Docker Compose setup for local development
- Service-to-service HTTP communication
- Local development workflow established
- Understanding of provided service boundaries and rationale

### Self-Assessment Questions
1. Can you start all services with a single `docker-compose up` command?
2. Can the Calendar Service successfully call the User Service?
3. Do both services have separate databases?
4. Can you explain why the services were decomposed this way?

---

## Week 4: Service Communication & Contract Testing

### Learning Objectives
- Implement various communication patterns between services
- Master contract testing with Spring Cloud Contract
- Handle service integration challenges
- Integrate with external services using real APIs

### Topics Covered
- Synchronous vs asynchronous communication
- HTTP client libraries (RestTemplate, WebClient)
- Consumer-driven contract testing
- Spring Cloud Contract implementation
- External service integration patterns
- API key management and configuration

### Required Reading
- **"Enterprise Integration Patterns"** (Hohpe & Woolf) - Messaging chapters
- **"Microservices Patterns"** (Chris Richardson) - Chapter 3 (Inter-service communication)
- **Spring Cloud Contract Documentation** - Complete guide
- **Stripe API Documentation** - Events API (or chosen external API)

### Practical Exercise: Add User Service and Event-Driven Communication

**Day 1: Extract User Service with Contract Testing**
- Create separate User Service
- Implement basic authentication service
- Set up contract testing between Calendar and User services
- Write provider contracts for User Service APIs

**Day 2: External Service Integration**
- Integrate with Stripe API for event payments (or alternative free API)
- Create Payment Service for handling premium event features
- Implement proper external API error handling and testing
- Add API key configuration management

**External Service Integration Example:**
```java
// External API Configuration
@Configuration
@ConfigurationProperties(prefix = "external.stripe")
@Data
public class StripeConfig {
    private String apiKey;
    private String webhookSecret;
    private String baseUrl = "https://api.stripe.com/v1";
}

// Payment Service with Stripe Integration
@Service
public class PaymentService {
    
    private final RestTemplate restTemplate;
    private final StripeConfig stripeConfig;
    
    public PaymentService(RestTemplate restTemplate, StripeConfig stripeConfig) {
        this.restTemplate = restTemplate;
        this.restTemplate.getInterceptors().add(new StripeAuthInterceptor(stripeConfig.getApiKey()));
    }
    
    public PaymentIntentDto createPaymentIntent(CreatePaymentRequest request) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("amount", String.valueOf(request.getAmount()));
            body.add("currency", request.getCurrency());
            body.add("metadata[event_id]", request.getEventId().toString());
            
            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(
                stripeConfig.getBaseUrl() + "/payment_intents",
                entity,
                Map.class
            );
            
            return mapToPaymentIntentDto(response.getBody());
        } catch (Exception e) {
            throw new PaymentServiceException("Failed to create payment intent", e);
        }
    }
}

// Alternative: Integration with JSONPlaceholder (free API)
@Service
public class ExternalEventService {
    
    private final RestTemplate restTemplate;
    private final String baseUrl = "https://jsonplaceholder.typicode.com";
    
    public ExternalEventDto createExternalEvent(CreateEventRequest request) {
        try {
            HttpEntity<CreateEventRequest> entity = new HttpEntity<>(request);
            
            ResponseEntity<ExternalEventDto> response = restTemplate.postForEntity(
                baseUrl + "/posts",
                entity,
                ExternalEventDto.class
            );
            
            return response.getBody();
        } catch (Exception e) {
            throw new ExternalServiceException("Failed to create external event", e);
        }
    }
    
    public List<ExternalEventDto> getExternalEvents() {
        try {
            ResponseEntity<ExternalEventDto[]> response = restTemplate.getForEntity(
                baseUrl + "/posts",
                ExternalEventDto[].class
            );
            
            return Arrays.asList(response.getBody());
        } catch (Exception e) {
            throw new ExternalServiceException("Failed to fetch external events", e);
        }
    }
}

// Testing External Service Integration
@SpringBootTest
class PaymentServiceIntegrationTest {
    
    @Autowired
    private PaymentService paymentService;
    
    @RegisterExtension
    static WireMockExtension wireMock = WireMockExtension.newInstance()
        .options(wireMockConfig().port(8089))
        .build();
    
    @Test
    @DisplayName("Should create payment intent successfully")
    void shouldCreatePaymentIntentSuccessfully() {
        // Given - Mock Stripe API response
        wireMock.stubFor(post(urlPathEqualTo("/v1/payment_intents"))
            .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody("""
                    {
                        "id": "pi_test_123456",
                        "amount": 2000,
                        "currency": "usd",
                        "status": "requires_payment_method",
                        "client_secret": "pi_test_123456_secret"
                    }
                    """)));
        
        CreatePaymentRequest request = new CreatePaymentRequest(2000, "usd", 1L);
        
        // When
        PaymentIntentDto result = paymentService.createPaymentIntent(request);
        
        // Then
        assertThat(result.getId()).isEqualTo("pi_test_123456");
        assertThat(result.getAmount()).isEqualTo(2000);
        assertThat(result.getStatus()).isEqualTo("requires_payment_method");
    }
    
    @Test
    @DisplayName("Should handle external service failure gracefully")
    void shouldHandleExternalServiceFailureGracefully() {
        // Given - Mock service failure
        wireMock.stubFor(post(urlPathEqualTo("/v1/payment_intents"))
            .willReturn(aResponse()
                .withStatus(500)
                .withBody("Internal Server Error")));
        
        CreatePaymentRequest request = new CreatePaymentRequest(2000, "usd", 1L);
        
        // When & Then
        assertThatThrownBy(() -> paymentService.createPaymentIntent(request))
            .isInstanceOf(PaymentServiceException.class)
            .hasMessageContaining("Failed to create payment intent");
    }
}
```

**Configuration for External Services:**
```yaml
# application-dev.yml
external:
  stripe:
    api-key: sk_test_your_test_key_here
    webhook-secret: whsec_test_secret
    base-url: https://api.stripe.com/v1

# application-test.yml  
external:
  stripe:
    api-key: sk_test_fake_key
    base-url: http://localhost:8089/v1  # WireMock URL
```
        assertThat(event.getEmail()).isEqualTo("test@example.com");
        assertThat(event.getName()).isEqualTo("Test User");
        assertThat(event.getTimestamp()).isNotNull();
    }
}
```

**Testing Patterns to Implement:**
1. **Provider Contract Tests**: Verify User Service API contracts
2. **Consumer Contract Tests**: Test Calendar Service's usage of User Service
3. **Message Contract Tests**: Verify event schema and structure
4. **Integration Tests**: End-to-end service communication
5. **Stub Testing**: Use WireMock for isolated testing

### Week 4 Deliverables
- Separate User Service with clear API contracts
- Contract testing suite (provider and consumer tests)
- External service integration (Stripe or alternative API)
- Payment Service for handling external API calls
- Proper API key configuration and error handling
- WireMock integration for external service testing

### Self-Assessment Questions
1. Do your contract tests catch API breaking changes?
2. Can you successfully integrate with the external payment API?
3. How do you handle external service failures gracefully?
4. Can you test external service integration without hitting real APIs?

---

## Week 5: Integration Testing & Notification Service

### Learning Objectives
- Implement comprehensive integration testing strategies
- Build Notification Service with proper testing
- Handle asynchronous processing testing
- Master testcontainers for realistic testing environments

### Topics Covered
- Integration testing with Testcontainers
- Testing asynchronous message processing
- Database integration testing
- End-to-end testing strategies
- Performance testing basics
- Test data management

### Required Reading
- **"Growing Object-Oriented Software, Guided by Tests"** (Freeman & Pryce) - Integration testing chapters
- **Testcontainers Documentation** - Complete guide
- **Spring Boot Test Documentation** - Integration testing section
- **RabbitMQ Documentation** - Testing guide

### Practical Exercise: Add Notification Service and Resilience Patterns

**Day 1: Implement Notification Service with Integration Testing**
- Create Notification Service for email/SMS reminders
- Set up Testcontainers for realistic testing environment
- Implement integration tests with real databases and message brokers
- Add performance testing for notification processing

**Day 2: End-to-End Testing and Test Data Management**
- Create comprehensive end-to-end test scenarios
- Implement test data builders and factories
- Add database cleanup and test isolation strategies
- Performance testing for multi-service workflows

**Integration Testing with Testcontainers:**
```java
@SpringBootTest
@Testcontainers
class NotificationServiceIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:14")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");
    
    @Container
    static RabbitMQContainer rabbitmq = new RabbitMQContainer("rabbitmq:3.8-management");
    
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.rabbitmq.host", rabbitmq::getHost);
        registry.add("spring.rabbitmq.port", rabbitmq::getAmqpPort);
    }
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Test
    @DisplayName("Should process notification and store in database")
    void shouldProcessNotificationAndStoreInDatabase() {
        // Given
        NotificationRequest request = NotificationRequestBuilder.builder()
                .recipient("test@example.com")
                .subject("Test Subject")
                .body("Test Body")
                .type(NotificationType.EMAIL)
                .build();
        
        // When
        notificationService.sendNotification(request);
        
        // Then
        await().atMost(Duration.ofSeconds(5)).untilAsserted(() -> {
            List<Notification> notifications = notificationRepository.findAll();
            assertThat(notifications).hasSize(1);
            assertThat(notifications.get(0).getStatus()).isEqualTo(NotificationStatus.SENT);
        });
    }
}

// End-to-End Testing
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class CalendarSystemE2ETest {
    
    @Container
    static Network network = Network.newNetwork();
    
    @Container
    static PostgreSQLContainer<?> userDb = new PostgreSQLContainer<>("postgres:14")
            .withNetwork(network)
            .withNetworkAliases("user-db");
    
    @Container
    static PostgreSQLContainer<?> calendarDb = new PostgreSQLContainer<>("postgres:14")
            .withNetwork(network)
            .withNetworkAliases("calendar-db");
    
    @Container
    static RabbitMQContainer rabbitmq = new RabbitMQContainer("rabbitmq:3.8")
            .withNetwork(network)
            .withNetworkAliases("rabbitmq");
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    @DisplayName("Should create user, calendar, and send notification end-to-end")
    void shouldCreateUserCalendarAndSendNotificationE2E() {
        // Given - Create user
        CreateUserRequest userRequest = new CreateUserRequest("test@example.com", "Test User", "password");
        ResponseEntity<UserDto> userResponse = restTemplate.postForEntity("/api/users", userRequest, UserDto.class);
        Long userId = userResponse.getBody().getId();
        
        // When - Create calendar
        CreateCalendarRequest calendarRequest = new CreateCalendarRequest("Work Calendar", "#FF0000", userId);
        ResponseEntity<CalendarDto> calendarResponse = restTemplate.postForEntity("/api/calendars", calendarRequest, CalendarDto.class);
        
        // Then - Verify calendar created and notification sent
        assertThat(calendarResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        
        // Verify notification was triggered
        await().atMost(Duration.ofSeconds(10)).untilAsserted(() -> {
            ResponseEntity<List> notifications = restTemplate.getForEntity("/api/notifications/user/" + userId, List.class);
            assertThat(notifications.getBody()).isNotEmpty();
        });
    }
}

// Test Data Builders
public class CalendarTestDataBuilder {
    
    private String name = "Test Calendar";
    private String color = "#FF0000";
    private Long ownerId = 1L;
    
    public static CalendarTestDataBuilder builder() {
        return new CalendarTestDataBuilder();
    }
    
    public CalendarTestDataBuilder withName(String name) {
        this.name = name;
        return this;
    }
    
    public CalendarTestDataBuilder withColor(String color) {
        this.color = color;
        return this;
    }
    
    public CalendarTestDataBuilder withOwnerId(Long ownerId) {
        this.ownerId = ownerId;
        return this;
    }
    
    public Calendar build() {
        Calendar calendar = new Calendar();
        calendar.setName(name);
        calendar.setColor(color);
        calendar.setOwnerId(ownerId);
        return calendar;
    }
    
    public CreateCalendarRequest buildRequest() {
        return new CreateCalendarRequest(name, color, ownerId);
    }
}

// Performance Testing
@SpringBootTest
class NotificationServicePerformanceTest {
    
    @Autowired
    private NotificationService notificationService;
    
    @Test
    @DisplayName("Should process 100 notifications within 5 seconds")
    void shouldProcess100NotificationsWithin5Seconds() {
        // Given
        List<NotificationRequest> requests = IntStream.range(0, 100)
                .mapToObj(i -> NotificationRequestBuilder.builder()
                        .recipient("user" + i + "@example.com")
                        .subject("Test " + i)
                        .body("Test notification " + i)
                        .build())
                .collect(Collectors.toList());
        
        // When
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        
        requests.parallelStream().forEach(notificationService::sendNotification);
        
        stopWatch.stop();
        
        // Then
        assertThat(stopWatch.getTotalTimeMillis()).isLessThan(5000);
    }
}
```

### Week 5 Deliverables
- Notification Service with comprehensive integration tests
- Testcontainers setup for realistic testing environments
- End-to-end test scenarios covering multiple services
- Performance testing framework and benchmarks
- Test data builders and factories for maintainable tests
- Database cleanup and test isolation strategies

### Self-Assessment Questions
1. Can your tests run reliably in isolation and in parallel?
2. Do your integration tests catch real-world deployment issues?
3. How do you handle test data cleanup between tests?
4. Can you identify performance bottlenecks through testing?

---

## Week 6: Data Management & System Completion

### Learning Objectives
- Understand distributed data management challenges
- Implement data consistency patterns with proper testing
- Complete the microservices system
- Document the final architecture and lessons learned

### Topics Covered
- Database per service pattern implications
- Data consistency across microservices
- Event sourcing fundamentals with testing
- Testing data consistency across services
- System documentation and architecture diagrams
- Deployment considerations

### Required Reading
- **"Microservices Patterns"** (Chris Richardson) - Chapters 5-6
- **"Designing Data-Intensive Applications"** (Martin Kleppmann) - Consistency chapters
- **"Building Microservices"** (Sam Newman) - Chapter 5 (Splitting the Monolith)
- **"Clean Architecture"** (Robert Martin) - Documentation chapters

### Practical Exercise: Complete the Microservices System

**Day 1: Implement Sharing Service and Data Consistency**
- Create Sharing Service for calendar permissions
- Implement eventual consistency patterns
- Add comprehensive testing for data consistency
- Handle cross-service data scenarios

**Day 2: System Completion, UI Enhancement, and Documentation**
- Complete integration between all services
- Enhance the frontend to work with all microservices
- Add calendar sharing functionality to the UI
- Create comprehensive system documentation
- Add final round of end-to-end testing
- Document architecture decisions and lessons learned

**Enhanced Frontend for Multiple Services:**
```html
<!-- Add to the existing HTML - Enhanced sidebar section -->
<div class="sidebar">
    <h3>My Calendars</h3>
    <ul id="calendar-list" class="calendar-list">
        <li class="loading">Loading calendars...</li>
    </ul>
    
    <hr>
    
    <!-- Calendar Sharing Section -->
    <h4>Share Calendar</h4>
    <form id="sharing-form">
        <div class="form-group">
            <label for="share-email">Share with (email):</label>
            <input type="email" id="share-email" required>
        </div>
        <div class="form-group">
            <label for="permission-level">Permission:</label>
            <select id="permission-level">
                <option value="READ">Read Only</option>
                <option value="WRITE">Read & Write</option>
            </select>
        </div>
        <button type="submit" class="btn">Share Calendar</button>
    </form>
    
    <hr>
    
    <h4>Create New Calendar</h4>
    <form id="calendar-form">
        <div class="form-group">
            <label for="calendar-name">Calendar Name:</label>
            <input type="text" id="calendar-name" required>
        </div>
        <div class="form-group">
            <label for="calendar-color">Color:</label>
            <input type="color" id="calendar-color" value="#2196F3">
        </div>
        <button type="submit" class="btn">Create Calendar</button>
    </form>
</div>
```

```javascript
// Enhanced JavaScript with microservices integration
// Add these functions to the existing script

// Payment Integration
async function createPremiumEvent(title, description, startTime, endTime, amount) {
    try {
        // First create payment intent
        const paymentIntent = await apiCall('/payments/create-intent', {
            method: 'POST',
            body: JSON.stringify({
                amount: amount,
                currency: 'usd',
                eventId: null // Will be set after event creation
            })
        });

        // Create the premium event
        const event = await apiCall('/events', {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                description: description,
                startTime: startTime,
                endTime: endTime,
                calendarId: selectedCalendarId,
                premium: true,
                paymentIntentId: paymentIntent.id
            })
        });

        showMessage('Premium event created! Payment required to confirm.', 'success');
        return event;
    } catch (error) {
        showMessage('Failed to create premium event', 'error');
        throw error;
    }
}

// Calendar Sharing
async function shareCalendar(email, permissionLevel) {
    if (!selectedCalendarId) {
        showMessage('Please select a calendar to share', 'error');
        return;
    }

    try {
        await apiCall('/sharing', {
            method: 'POST',
            body: JSON.stringify({
                calendarId: selectedCalendarId,
                ownerId: CURRENT_USER_ID,
                targetEmail: email,
                permissionLevel: permissionLevel
            })
        });

        showMessage(`Calendar shared with ${email}!`, 'success');
    } catch (error) {
        showMessage('Failed to share calendar', 'error');
    }
}

// Notification checking
async function checkNotifications() {
    try {
        const notifications = await apiCall(`/notifications/user/${CURRENT_USER_ID}`);
        if (notifications.length > 0) {
            const unread = notifications.filter(n => !n.read).length;
            if (unread > 0) {
                showMessage(`You have ${unread} new notifications`, 'info');
            }
        }
    } catch (error) {
        console.error('Failed to check notifications:', error);
    }
}

// Add sharing form handler
document.getElementById('sharing-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('share-email').value;
    const permission = document.getElementById('permission-level').value;
    
    await shareCalendar(email, permission);
    e.target.reset();
});

// Enhanced event form with premium option
document.getElementById('event-form').innerHTML += `
    <div class="form-group">
        <label>
            <input type="checkbox" id="premium-event"> Premium Event ($5.00)
        </label>
    </div>
`;

// Update event creation handler
document.getElementById('event-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('event-title').value;
    const description = document.getElementById('event-description').value;
    const startTime = document.getElementById('event-start').value;
    const endTime = document.getElementById('event-end').value;
    const isPremium = document.getElementById('premium-event').checked;
    
    if (isPremium) {
        await createPremiumEvent(title, description, startTime, endTime, 500); // $5.00 in cents
    } else {
        await createEvent(title, description, startTime, endTime);
    }
    
    e.target.reset();
});

// Check notifications periodically
setInterval(checkNotifications, 30000); // Every 30 seconds
```

**UI Architecture Sketch:**
```
┌─────────────────────────────────────────────────────────────┐
│                    SimpleCal Header                         │
└─────────────────────────────────────────────────────────────┘
┌─────────────────┐ ┌─────────────────────────────────────────┐
│   Sidebar       │ │           Main Content                  │
│                 │ │                                         │
│ My Calendars:   │ │ Events for Selected Calendar:          │
│ • Work Calendar │ │ ┌─────────────────────────────────────┐ │
│ • Personal      │ │ │ Team Meeting                        │ │
│ • Shared Cal    │ │ │ 2024-01-15 10:00 - 11:00           │ │
│                 │ │ │ Conference Room A                   │ │
│ Share Calendar: │ │ └─────────────────────────────────────┘ │
│ [email input]   │ │ ┌─────────────────────────────────────┐ │
│ [Read/Write]    │ │ │ Lunch with Client (Premium)         │ │
│ [Share Button]  │ │ │ 2024-01-15 12:00 - 13:00           │ │
│                 │ │ │ Downtown Restaurant                 │ │
│ New Calendar:   │ │ └─────────────────────────────────────┘ │
│ [name input]    │ │                                         │
│ [color picker]  │ │ Create New Event:                       │
│ [Create Button] │ │ Title: [________________]               │
│                 │ │ Description: [__________]               │
│                 │ │ Start: [datetime picker]                │
│                 │ │ End: [datetime picker]                  │
│                 │ │ ☐ Premium Event ($5.00)                │
│                 │ │ [Create Event Button]                   │
└─────────────────┘ └─────────────────────────────────────────┘
```

**Sharing Service Implementation:**
```java
@Service
public class SharingService {
    
    private final SharingRepository sharingRepository;
    private final UserServiceClient userServiceClient;
    private final CalendarServiceClient calendarServiceClient;
    private final NotificationService notificationService;
    
    @Transactional
    public SharingDto shareCalendar(ShareCalendarRequest request) {
        // 1. Validate user exists
        UserDto owner = userServiceClient.getUser(request.getOwnerId());
        UserDto targetUser = userServiceClient.getUserByEmail(request.getTargetEmail());
        
        // 2. Validate calendar exists and user has permission
        CalendarDto calendar = calendarServiceClient.getCalendar(request.getCalendarId());
        if (!calendar.getOwnerId().equals(owner.getId())) {
            throw new UnauthorizedException("User does not own this calendar");
        }
        
        // 3. Create sharing record
        Sharing sharing = new Sharing(
            request.getCalendarId(), 
            targetUser.getId(), 
            request.getPermissionLevel()
        );
        sharing = sharingRepository.save(sharing);
        
        // 4. Send notification (async)
        notificationService.sendSharingNotification(targetUser.getEmail(), calendar.getName(), owner.getName());
        
        return mapToDto(sharing);
    }
}

// Testing Data Consistency
@SpringBootTest
@Testcontainers
class SharingServiceDataConsistencyTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:14");
    
    @Autowired
    private SharingService sharingService;
    
    @MockBean
    private UserServiceClient userServiceClient;
    
    @MockBean
    private CalendarServiceClient calendarServiceClient;
    
    @Test
    @DisplayName("Should handle user service failure gracefully")
    void shouldHandleUserServiceFailureGracefully() {
        // Given
        when(userServiceClient.getUser(1L)).thenThrow(new UserServiceException("Service unavailable"));
        ShareCalendarRequest request = new ShareCalendarRequest(1L, 1L, "user@example.com", PermissionLevel.READ);
        
        // When & Then
        assertThatThrownBy(() -> sharingService.shareCalendar(request))
            .isInstanceOf(UserServiceException.class);
        
        // Verify no sharing record was created
        List<Sharing> sharings = sharingRepository.findAll();
        assertThat(sharings).isEmpty();
    }
}

// Final System Documentation
@Component
public class SystemDocumentationGenerator {
    
    public void generateArchitectureDocumentation() {
        // Generate service dependency graph
        // Document API contracts
        // Create deployment guide
        // Document testing strategy
    }
}

// Complete End-to-End Test
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class CompleteSystemE2ETest {
    
    @Container
    static Network network = Network.newNetwork();
    
    @Container
    static PostgreSQLContainer<?> userDb = new PostgreSQLContainer<>("postgres:14")
            .withNetwork(network);
    
    @Container
    static PostgreSQLContainer<?> calendarDb = new PostgreSQLContainer<>("postgres:14")
            .withNetwork(network);
    
    @Container
    static PostgreSQLContainer<?> sharingDb = new PostgreSQLContainer<>("postgres:14")
            .withNetwork(network);
    
    @Container
    static RabbitMQContainer rabbitmq = new RabbitMQContainer("rabbitmq:3.8")
            .withNetwork(network);
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    @DisplayName("Complete workflow: Create user, calendar, share calendar, process payment")
    void completeWorkflowTest() {
        // 1. Create user
        CreateUserRequest userRequest = new CreateUserRequest("test@example.com", "Test User", "password");
        ResponseEntity<UserDto> userResponse = restTemplate.postForEntity("/api/users", userRequest, UserDto.class);
        Long userId = userResponse.getBody().getId();
        
        // 2. Create calendar
        CreateCalendarRequest calendarRequest = new CreateCalendarRequest("Work Calendar", "#FF0000", userId);
        ResponseEntity<CalendarDto> calendarResponse = restTemplate.postForEntity("/api/calendars", calendarRequest, CalendarDto.class);
        Long calendarId = calendarResponse.getBody().getId();
        
        // 3. Create premium event with payment
        CreateEventRequest eventRequest = new CreateEventRequest(
            "Premium Meeting", 
            "Important meeting", 
            LocalDateTime.now().plusDays(1),
            LocalDateTime.now().plusDays(1).plusHours(1),
            calendarId,
            true // Premium event
        );
        ResponseEntity<EventDto> eventResponse = restTemplate.postForEntity("/api/events", eventRequest, EventDto.class);
        
        // 4. Share calendar
        ShareCalendarRequest shareRequest = new ShareCalendarRequest(calendarId, userId, "friend@example.com", PermissionLevel.READ);
        ResponseEntity<SharingDto> shareResponse = restTemplate.postForEntity("/api/sharing", shareRequest, SharingDto.class);
        
        // 5. Verify all operations completed successfully
        assertThat(userResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(calendarResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(eventResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(shareResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        
        // 6. Verify notifications were sent
        await().atMost(Duration.ofSeconds(10)).untilAsserted(() -> {
            ResponseEntity<List> notifications = restTemplate.getForEntity("/api/notifications/user/" + userId, List.class);
            assertThat(notifications.getBody()).isNotEmpty();
        });
    }
}
```

### Week 6 Deliverables
- Complete microservices system with 4+ services
- Sharing Service with data consistency patterns
- Enhanced frontend that integrates with all microservices
- Calendar sharing, premium events, and notifications in UI
- Comprehensive end-to-end testing of complete system
- Complete system documentation and architecture diagrams
- Lessons learned document and reflection

### Self-Assessment Questions
1. Can you explain the data flow between all services?
2. How do you ensure data consistency across the system?
3. Does your frontend successfully interact with all microservices?
4. Can users share calendars and create premium events through the UI?
5. What would you do differently if starting over?

### Final System Architecture
```
Frontend (HTML/JS)
       │
       ▼
┌─────────────────┐
│   API Gateway   │  (Optional - or direct service calls)
│   (Port 8080)   │
└─────────┬───────┘
          │
    ┌─────┴─────┐
    │           │
┌───▼────┐  ┌───▼────┐  ┌──────────┐  ┌──────────────┐
│ User   │  │Calendar│  │ Sharing  │  │ Notification │
│Service │  │Service │  │ Service  │  │   Service    │
│:8081   │  │:8082   │  │  :8083   │  │    :8084     │
└───┬────┘  └───┬────┘  └─────┬────┘  └──────┬───────┘
    │           │             │              │
    └───────────┼─────────────┼──────────────┘
                │             │
           ┌────▼─────────────▼────┐
           │     Message Queue     │
           │      (RabbitMQ)       │
           └───────────────────────┘
                       │
              ┌────────▼────────┐
              │  Payment API    │
              │ (Stripe/External)│
              └─────────────────┘

Testing Layers:
- Unit Tests (JUnit + Mockito)
- Contract Tests (Spring Cloud Contract)
- Integration Tests (Testcontainers)
- End-to-End Tests (Full System + UI)
```

### Self-Assessment Questions
1. Can your system handle complex business workflows?
2. How do you ensure data consistency across services?
3. What's your strategy for handling service failures?
4. How would you scale individual services?

---

## Assessment and Evaluation

### Weekly Checkpoints
- **Week 2**: Functional monolithic calendar application with simple UI
- **Week 4**: Successfully extracted and communicating microservices with frontend integration
- **Week 6**: Complete microservices system with full-featured web interface

### Final Project Evaluation Criteria
1. **Architecture Quality (25%)**
   - Proper service decomposition
   - Clear service boundaries
   - Appropriate communication patterns

2. **Code Quality (20%)**
   - Clean, maintainable code
   - Proper error handling
   - Good separation of concerns

3. **Testing Quality (30%)**
   - Comprehensive unit test coverage
   - Effective contract testing implementation
   - Realistic integration testing with Testcontainers
   - End-to-end testing scenarios

4. **User Interface (15%)**
   - Functional web interface
   - Integration with all microservices
   - User-friendly calendar management
   - Error handling in the UI

5. **Documentation (10%)**
   - API documentation with OpenAPI/Swagger
   - System architecture documentation
   - Clear setup and deployment instructions

### Capstone Project Presentation
Prepare a 20-minute presentation covering:
- System architecture overview
- Key design decisions and trade-offs
- Testing strategy and implementation approach
- Challenges faced and solutions implemented
- Test automation and CI/CD integration
- Lessons learned about microservices testing

---

## Additional Resources

### Books
- **"Microservices Patterns"** by Chris Richardson - Comprehensive patterns catalog
- **"Building Microservices"** by Sam Newman - Practical implementation guide
- **"Release It!"** by Michael Nygard - Production-ready system design
- **"Designing Data-Intensive Applications"** by Martin Kleppmann - Data architecture

### Online Resources
- **Spring Cloud Documentation** - https://spring.io/projects/spring-cloud
- **Microservices.io** - https://microservices.io - Pattern catalog
- **Martin Fowler's Blog** - https://martinfowler.com - Architecture articles
- **DZone Microservices Zone** - https://dzone.com/microservices-news-tutorials-tools

### Tools and Technologies
- **Spring Boot** - Microservice framework
- **Spring Cloud** - Distributed system patterns
- **Spring Cloud Contract** - Contract testing
- **JUnit 5** - Unit testing framework
- **Mockito** - Mocking framework
- **Testcontainers** - Integration testing
- **RabbitMQ** - Message broker
- **PostgreSQL** - Database
- **WireMock** - Service stubbing

### Community and Support
- **Stack Overflow** - Technical questions
- **Spring Community** - Framework support
- **GitHub** - Code examples and samples
- **Medium/Dev.to** - Architecture articles and tutorials

---

## Mentor Interaction Guidelines

### Weekly Meeting Structure (Weeks 4-6)
1. **Progress Review (10 minutes)**
   - What was accomplished this week?
   - What challenges were encountered?

2. **Code Review (15 minutes)**
   - Review key implementations
   - Discuss design decisions
   - Identify improvements

3. **Architecture Discussion (10 minutes)**
   - Validate service boundaries
   - Discuss communication patterns
   - Plan next steps

4. **Q&A and Troubleshooting (15 minutes)**
   - Address specific issues
   - Clarify concepts
   - Provide guidance

### Common Questions and Discussion Topics
- When should I extract a service vs keep it in the monolith?
- How do I handle data consistency across services?
- What's the best approach to testing microservices?
- How do I implement effective contract testing?
- What testing strategies work best for distributed systems?
- How do I balance test coverage with execution time?

### Success Metrics
- Can explain microservices trade-offs vs monoliths
- Can identify appropriate service boundaries
- Can implement comprehensive testing strategies
- Can write effective unit and contract tests
- Can set up integration testing with realistic environments
- Can design for testability and maintainability

---

*This curriculum is designed to provide hands-on experience with microservices architecture while building a realistic application. Focus on understanding the concepts through implementation rather than memorizing patterns. The goal is to be prepared for real-world microservices development in your future career.*
