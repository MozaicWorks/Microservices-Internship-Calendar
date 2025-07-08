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
```

### 3. Access the Application
- **Web Interface**: http://localhost:8080
- **H2 Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: (leave empty)

## 📚 Day-by-Day Instructions

### Day 1: Project Setup and User Management
1. Create Spring Boot project structure
2. Implement User entity and repository
3. Create user registration and login endpoints
4. Add basic authentication
5. Test with Postman or curl

### Day 2: Calendar and Event Management + UI
1. Implement Calendar and Event entities
2. Create REST endpoints for calendar operations
3. Build simple HTML/JavaScript frontend
4. Test complete application flow
5. Add sample data

## 🧪 Testing Your Implementation

### Manual Testing Checklist
- [ ] User can register through API
- [ ] User can login and receive session token
- [ ] User can create calendars
- [ ] User can create events in calendars
- [ ] Web interface works for all operations
- [ ] H2 console shows proper data

### API Testing Examples
```bash
# Register user
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
```

## 🎯 Success Criteria
By the end of Week 1, you should have:
- ✅ Working Spring Boot application
- ✅ User registration and authentication
- ✅ Calendar and event CRUD operations
- ✅ Functional web interface
- ✅ All APIs tested and working

## 🆘 Troubleshooting

### Common Issues
1. **Port already in use**: Change port in `application.yml`
2. **Database connection issues**: Check H2 configuration
3. **CORS errors**: Ensure CORS is configured for frontend
4. **Authentication failures**: Verify token generation and validation

### Getting Help
- Check the [Setup Guide](../docs/setup-guide.md)
- Review [API Specifications](../docs/api-specifications.md)
- See `starter-template/` for boilerplate code

## ➡️ Next Week
[Week 2: Testing and Documentation](../week-2-testing-and-documentation/)
