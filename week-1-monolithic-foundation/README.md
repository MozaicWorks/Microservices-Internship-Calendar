# Week 1: Monolithic Foundation

## 🎯 Learning Objectives
- Build a complete monolithic Spring Boot application
- Implement user authentication and authorization
- Create REST APIs for calendar and event management
- Build a simple web interface
- Understand JPA relationships and database design

## 📋 What You'll Build
A complete calendar application with:
- User registration and login
- Calendar creation and management
- Event scheduling and management
- Simple web interface
- H2 in-memory database

## 🚀 Getting Started

### 1. Prerequisites Check
Ensure you have:
- Java 17+
- Maven 3.6+
- Your favorite IDE

### 2. Project Setup
```bash
# Navigate to week 1 directory
cd week-1-monolithic-foundation

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

3. Access the Application

Web Interface: http://localhost:8080
H2 Console: http://localhost:8080/h2-console
API Documentation: http://localhost:8080/swagger-ui.html (Week 2)

📚 Day-by-Day Instructions
Day 1: Project Setup and User Management

Create Spring Boot project structure
Implement User entity and repository
Create user registration and login endpoints
Add basic authentication
Test with Postman or curl

Day 2: Calendar and Event Management + UI

Implement Calendar and Event entities
Create REST endpoints for calendar operations
Build simple HTML/JavaScript frontend
Test complete application flow
Add sample data

🧪 Testing Your Implementation
Manual Testing Checklist

 User can register through API
 User can login and receive session token
 User can create calendars
 User can create events in calendars
 Web interface works for all operations
 H2 console shows proper data

API Testing Examples
bash# Register user
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123","timezone":"America/New_York"}'

# Login
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create calendar (use token from login)
curl -X POST http://localhost:8080/api/calendars \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Work Calendar","color":"#FF5733","ownerId":1}'
📝 Key Files to Implement
Core Entities

User.java - User entity with email, name, password, timezone
Calendar.java - Calendar entity with name, color, owner
Event.java - Event entity with title, description, times

Controllers

UserController.java - Registration and login endpoints
CalendarController.java - Calendar CRUD operations
EventController.java - Event CRUD operations

Services

UserService.java - User business logic and authentication
CalendarService.java - Calendar business logic
EventService.java - Event business logic

Frontend

index.html - Main web interface
app.js - JavaScript for API interactions
styles.css - Basic styling

🎯 Success Criteria
By the end of Week 1, you should have:

✅ Working Spring Boot application
✅ User registration and authentication
✅ Calendar and event CRUD operations
✅ Functional web interface
✅ All APIs tested and working

🆘 Troubleshooting
Common Issues

Port already in use: Change port in application.yml
Database connection issues: Check H2 configuration
CORS errors: Ensure CORS is configured for frontend
Authentication failures: Verify token generation and validation

Getting Help

Check the Setup Guide
Review API Specifications
See starter-template/ for boilerplate code

➡️ Next Week
