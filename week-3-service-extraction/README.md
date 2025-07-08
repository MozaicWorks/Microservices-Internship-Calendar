
   - Copy Calendar and Event entities from your monolithic application
   - Remove User entity references (replace with userId as Long)
   - Copy CalendarController and EventController
   - Copy CalendarService and EventService
   - Copy CalendarRepository and EventRepository
   - Copy related DTOs and exception classes

4. **Adapt Entity Relationships**:
   - Change Calendar entity: Remove `@ManyToOne User owner` → Add `private Long ownerId`
   - Update all queries and logic to use ownerId instead of User references
   - Ensure Event entity relates to Calendar properly
   - Update database relationships accordingly

5. **Configure Calendar Service**:
   - Create `application.yml` with PostgreSQL configuration
   - Set up different profiles (docker, dev, test)
   - Configure service to run on port 8082
   - Add OpenAPI configuration

**Calendar Service Configuration Example**:
```yaml
# application.yml
spring:
  application:
    name: calendar-service
  profiles:
    active: dev

server:
  port: 8082

# application-docker.yml
spring:
  datasource:
    url: ${DATABASE_URL:jdbc:postgresql://localhost:5434/calendardb}
    username: ${DATABASE_USERNAME:calendar_service}
    password: ${DATABASE_PASSWORD:password}
  jpa:
    hibernate:
      ddl-auto: update
    database-platform: org.hibernate.dialect.PostgreSQLDialect

# External service URLs
external:
  user-service:
    url: ${USER_SERVICE_URL:http://localhost:8081}
```

**Success Criteria**:
- [ ] Calendar service project compiles successfully
- [ ] Entities are adapted to work without direct User references
- [ ] Configuration supports both local and Docker environments
- [ ] Service can start independently (even without User service running)

### Step 4: Create User Service Client (45 minutes)

**Objective**: Implement HTTP client to communicate with User Service from Calendar Service.

**Tasks**:
1. **Create User Service Client Interface**:
   - Define methods that Calendar Service needs from User Service
   - Focus on user validation and basic user information retrieval
   - Design for potential failures and timeouts

2. **Implement HTTP Client**:
   - Use `RestTemplate` or `WebClient` for HTTP communication
   - Configure timeouts and error handling
   - Add retry logic for transient failures
   - Create appropriate exception handling

3. **User Service Client Structure**:
   ```java
   @Component
   public class UserServiceClient {
       
       private final RestTemplate restTemplate;
       private final String userServiceUrl;
       
       public UserServiceClient(RestTemplate restTemplate, 
                               @Value("${external.user-service.url}") String userServiceUrl) {
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
               return false; // Assume user doesn't exist if service is down
           }
       }
   }
   ```

4. **Configure HTTP Client**:
   - Create `@Configuration` class for RestTemplate/WebClient
   - Configure connection timeouts, read timeouts
   - Add error handling and logging
   - Consider circuit breaker patterns (basic implementation)

5. **Update Calendar Service Logic**:
   - Modify CalendarService to validate user ownership through UserServiceClient
   - Update calendar creation to verify user exists
   - Handle scenarios where User Service is unavailable

**Error Handling Strategies**:
- **Fail Fast**: Reject requests if User Service is down
- **Graceful Degradation**: Allow some operations even if User Service is unavailable
- **Caching**: Cache user information for short periods to reduce service calls

**Success Criteria**:
- [ ] HTTP client can successfully call User Service endpoints
- [ ] Error handling works when User Service is unavailable
- [ ] Calendar operations validate user ownership properly
- [ ] Appropriate timeouts and retry logic are configured

---

## Day 2: Create User Service and Local Development Setup

### Step 5: Create User Service (60 minutes)

**Objective**: Extract user-related functionality into a separate User Service.

**Tasks**:
1. **Create User Service Project**:
   - Create `user-service/` directory with Maven structure
   - Set up `pom.xml` similar to Calendar Service but focused on user functionality
   - Configure to run on port 8081

2. **Extract User-Related Code**:
   - Copy User entity (keep as-is, no major changes needed)
   - Copy UserController, UserService, UserRepository
   - Copy authentication and security configuration
   - Copy user-related DTOs and exceptions
   - Remove Calendar and Event related code

3. **Update User Service Configuration**:
   - Configure PostgreSQL for user database
   - Set up security configuration for authentication
   - Configure JWT token generation and validation
   - Add OpenAPI documentation

4. **Adapt User Controller**:
   - Keep all existing user endpoints (`/api/users/register`, `/api/users/login`, etc.)
   - Add new endpoint for user validation: `GET /api/users/{userId}`
   - Add endpoint for user existence check: `GET /api/users/{userId}/exists`
   - Ensure proper error handling for not found scenarios

5. **User Service Specific Configuration**:
   ```yaml
   # application.yml
   spring:
     application:
       name: user-service
   
   server:
     port: 8081
   
   # JWT configuration
   app:
     jwt:
       secret: ${JWT_SECRET:mySecretKey}
       expiration: ${JWT_EXPIRATION:86400000}
   
   # application-docker.yml
   spring:
     datasource:
       url: ${DATABASE_URL:jdbc:postgresql://localhost:5433/userdb}
       username: ${DATABASE_USERNAME:user_service}
       password: ${DATABASE_PASSWORD:password}
   ```

**Success Criteria**:
- [ ] User Service compiles and starts successfully
- [ ] All user-related endpoints work correctly
- [ ] Authentication and JWT generation work
- [ ] New endpoints for user validation are implemented

### Step 6: Test Services Individually (30 minutes)

**Objective**: Verify each service works correctly in isolation before integrating.

**Tasks**:
1. **Test User Service Standalone**:
   - Start only User Service with its database
   - Test user registration through API
   - Test user login and JWT generation
   - Test user profile retrieval
   - Verify Swagger UI at `http://localhost:8081/swagger-ui.html`

2. **Test Calendar Service Standalone**:
   - Start only Calendar Service with its database
   - Test calendar creation (with hardcoded valid user ID)
   - Test event creation
   - Test calendar and event retrieval
   - Verify Swagger UI at `http://localhost:8082/swagger-ui.html`

**Testing Commands**:
```bash
# Test User Service
curl -X POST http://localhost:8081/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123","timezone":"UTC"}'

# Test Calendar Service (use valid user ID from User Service)
curl -X POST http://localhost:8082/api/calendars \
  -H "Content-Type: application/json" \
  -d '{"name":"Work Calendar","color":"#FF5733","ownerId":1}'
```

**Success Criteria**:
- [ ] User Service handles all user operations correctly
- [ ] Calendar Service handles calendar/event operations correctly
- [ ] Both services have working Swagger documentation
- [ ] Services can run independently without errors

### Step 7: Set Up Local Development Workflow (45 minutes)

**Objective**: Create an efficient development workflow for working with multiple services.

**Tasks**:
1. **Complete Docker Compose Setup**:
   - Add Dockerfiles for both services
   - Test complete Docker Compose startup
   - Verify service-to-service communication works
   - Add health checks and dependency management

2. **Create Development Scripts**:
   - `start-all.sh`: Script to start all services and databases
   - `stop-all.sh`: Script to stop all services
   - `rebuild.sh`: Script to rebuild and restart services
   - `logs.sh`: Script to view logs from all services

3. **Dockerfile Examples**:
   ```dockerfile
   # user-service/Dockerfile
   FROM openjdk:17-jdk-slim
   VOLUME /tmp
   COPY target/user-service-1.0.0.jar app.jar
   ENTRYPOINT ["java","-jar","/app.jar"]
   EXPOSE 8081
   
   # calendar-service/Dockerfile  
   FROM openjdk:17-jdk-slim
   VOLUME /tmp
   COPY target/calendar-service-1.0.0.jar app.jar
   ENTRYPOINT ["java","-jar","/app.jar"]
   EXPOSE 8082
   ```

4. **Development Scripts**:
   ```bash
   #!/bin/bash
   # start-all.sh
   echo "Starting all services..."
   docker-compose up --build -d
   echo "Services starting up..."
   echo "User Service: http://localhost:8081"
   echo "Calendar Service: http://localhost:8082"
   echo "User DB: localhost:5433"
   echo "Calendar DB: localhost:5434"
   ```

5. **Configure IDE for Multi-Service Development**:
   - Set up run configurations for each service
   - Configure debugging for multiple services
   - Set up environment variables for local development
   - Configure hot reload for faster development

**Success Criteria**:
- [ ] `docker-compose up` starts all services successfully
- [ ] Services can communicate with each other
- [ ] Development scripts work correctly
- [ ] IDE is configured for efficient multi-service development

### Step 8: Update Frontend for Multiple Services (30 minutes)

**Objective**: Modify your frontend to work with the new microservices architecture.

**Tasks**:
1. **Update API Configuration**:
   - Change API base URLs to point to appropriate services
   - User operations → `http://localhost:8081/api`
   - Calendar/Event operations → `http://localhost:8082/api`

2. **Modify JavaScript API Client**:
   ```javascript
   // Updated API configuration
   const API_CONFIG = {
       USER_SERVICE: 'http://localhost:8081/api',
       CALENDAR_SERVICE: 'http://localhost:8082/api'
   };
   
   // Update API calls to use appropriate service
   async function login(email, password) {
       const response = await apiCall(`${API_CONFIG.USER_SERVICE}/users/login`, {
           method: 'POST',
           body: JSON.stringify({ email, password })
       });
       // ... rest of login logic
   }
   
   async function createCalendar(name, color) {
       const calendar = await apiCall(`${API_CONFIG.CALENDAR_SERVICE}/calendars`, {
           method: 'POST',
           body: JSON.stringify({
               name: name,
               color: color,
               ownerId: currentUser.userId
           })
       });
       // ... rest of calendar creation logic
   }
   ```

3. **Handle Cross-Service Operations**:
   - Update calendar loading to use Calendar Service
   - Ensure authentication tokens work across services
   - Handle scenarios where one service might be down
   - Add error handling for service communication failures

4. **Test Complete User Flow**:
   - Register user through User Service
   - Login and get authentication token
   - Create calendar through Calendar Service
   - Create events in the calendar
   - Verify all operations work end-to-end

**Success Criteria**:
- [ ] Frontend successfully communicates with both services
- [ ] Complete user workflow works (register → login → create calendar → create events)
- [ ] Error handling works when services are unavailable
- [ ] Authentication works across both services

---

## Testing Your Microservices Implementation

### Comprehensive Testing Strategy

**Individual Service Testing**:
1. **User Service Testing**:
   ```bash
   # Start only User Service and its database
   docker-compose up user-db user-service
   
   # Test user registration
   curl -X POST http://localhost:8081/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","name":"Test User","password":"password123","timezone":"UTC"}'
   
   # Test login
   curl -X POST http://localhost:8081/api/users/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

2. **Calendar Service Testing**:
   ```bash
   # Start Calendar Service and its database
   docker-compose up calendar-db calendar-service
   
   # Test calendar creation (use valid user ID)
   curl -X POST http://localhost:8082/api/calendars \
     -H "Content-Type: application/json" \
     -d '{"name":"Work Calendar","color":"#FF5733","ownerId":1}'
   ```

**Integration Testing**:
1. **Service Communication Testing**:
   ```bash
   # Start all services
   docker-compose up
   
   # Create user in User Service
   USER_RESPONSE=$(curl -s -X POST http://localhost:8081/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"email":"integration@test.com","name":"Integration Test","password":"password123","timezone":"UTC"}')
   
   # Extract user ID and create calendar
   USER_ID=$(echo $USER_RESPONSE | jq -r '.id')
   curl -X POST http://localhost:8082/api/calendars \
     -H "Content-Type: application/json" \
     -d "{\"name\":\"Integration Calendar\",\"color\":\"#00FF00\",\"ownerId\":$USER_ID}"
   ```

2. **Frontend Integration Testing**:
   - Open `http://localhost:8080` (serve your frontend)
   - Register a new user
   - Login with the user
   - Create a calendar
   - Create events in the calendar
   - Verify all operations work smoothly

**Service Communication Testing**:
- Test Calendar Service when User Service is down
- Test User Service when Calendar Service is down
- Verify appropriate error handling in both scenarios
- Test service startup order dependencies

### Performance Testing

**Service Startup Time**:
- Individual services should start in <30 seconds
- Full system startup should complete in <60 seconds
- Database connections should be established within 10 seconds

**API Response Times**:
- User registration/login: <500ms
- Calendar operations: <300ms
- Service-to-service calls: <200ms

**Resource Usage**:
- Each service should use <512MB RAM
- Database connections should be properly pooled
- No memory leaks during normal operations

### Error Scenario Testing

**Network Failures**:
1. **Stop User Service**: Calendar Service should handle gracefully
   ```bash
   docker-compose stop user-service
   # Try to create calendar - should fail with appropriate error
   ```

2. **Stop Calendar Service**: User Service should continue working
   ```bash
   docker-compose stop calendar-service
   # User operations should still work
   ```

3. **Database Failures**: Test service behavior when databases are unavailable
   ```bash
   docker-compose stop user-db
   # User Service should handle database connection failures
   ```

**Data Consistency Testing**:
- Create calendar with non-existent user ID
- Verify proper validation and error responses
- Test concurrent operations on the same resources

---

## Troubleshooting Guide

### Common Issues and Solutions

**Services Won't Start**:
- **Port Conflicts**: Check if ports 8081, 8082, 5433, 5434 are available
  ```bash
  netstat -tulpn | grep :8081
  # Kill processes using required ports
  ```
- **Database Connection Issues**: Verify PostgreSQL containers are running
  ```bash
  docker-compose logs user-db
  docker-compose logs calendar-db
  ```
- **Configuration Issues**: Check application.yml files for syntax errors
- **Dependency Issues**: Verify Maven dependencies are correctly specified

**Service Communication Failures**:
- **Network Issues**: Verify Docker network configuration
  ```bash
  docker network ls
  docker network inspect week-3-service-extraction_default
  ```
- **Service Discovery**: Check if services can reach each other
  ```bash
  docker exec -it calendar-service ping user-service
  ```
- **Configuration**: Verify `USER_SERVICE_URL` environment variable
- **Timeouts**: Check if HTTP client timeouts are appropriate

**Docker Compose Issues**:
- **Build Failures**: Check Dockerfile syntax and build context
  ```bash
  docker-compose build --no-cache user-service
  ```
- **Volume Issues**: Clear Docker volumes if data is corrupted
  ```bash
  docker-compose down -v
  docker volume prune
  ```
- **Memory Issues**: Increase Docker memory allocation if services crash

**Database Issues**:
- **Connection Failures**: Verify database credentials and URLs
- **Migration Issues**: Check Hibernate DDL settings
- **Data Persistence**: Verify volume mounts are working correctly
  ```bash
  docker volume inspect week-3-service-extraction_user_data
  ```

**Frontend Integration Issues**:
- **CORS Errors**: Configure CORS in both services
  ```java
  @CrossOrigin(origins = "http://localhost:8080")
  ```
- **Authentication Issues**: Verify JWT tokens work across services
- **API Endpoint Changes**: Update frontend API calls for new service URLs

### Development Workflow Issues

**Hot Reload Not Working**:
- Configure Spring Boot DevTools properly
- Verify file watchers in IDE are working
- Consider using Docker volume mounts for development

**Debugging Multiple Services**:
- Use IDE's remote debugging features
- Configure different debug ports for each service
- Use Docker Compose override files for development

**Log Management**:
- Use centralized logging if available
- Configure appropriate log levels for development
- Use Docker Compose logs effectively:
  ```bash
  docker-compose logs -f user-service
  docker-compose logs -f calendar-service
  ```

---

## Success Criteria

By the end of Week 3, you should have:

### Technical Achievements
- ✅ **Extracted Calendar Service**: Working microservice with own database
- ✅ **Extracted User Service**: Separate authentication and user management service
- ✅ **Service Communication**: HTTP-based communication between services
- ✅ **Local Development Environment**: Docker Compose setup for multi-service development
- ✅ **Data Separation**: Each service owns its data with separate databases
- ✅ **Updated Frontend**: Web interface works with microservices architecture

### Architecture Understanding
- ✅ **Service Boundaries**: Clear understanding of why services were decomposed this way
- ✅ **Data Ownership**: Each service owns and manages its own data
- ✅ **Communication Patterns**: HTTP-based synchronous communication between services
- ✅ **Service Dependencies**: Understanding of service startup order and dependencies

### Development Skills
- ✅ **Multi-Service Development**: Ability to develop and debug multiple services locally
- ✅ **Docker Compose**: Skills to manage local development environment with containers
- ✅ **Service Integration**: Experience with inter-service communication and error handling
- ✅ **Configuration Management**: Understanding of service-specific configuration

### Operational Capabilities
- ✅ **Local Development Workflow**: Efficient workflow for multi-service development
- ✅ **Service Monitoring**: Basic understanding of monitoring multiple services
- ✅ **Error Handling**: Graceful handling of service communication failures
- ✅ **Testing Strategy**: Approach for testing individual services and their integration

---

## Reflection Questions

Take some time to reflect on this week's transformation:

1. **Architecture Impact**:
   - How did breaking apart the monolith change your understanding of the application?
   - What challenges did you encounter with service boundaries?
   - How does data separation affect your development workflow?

2. **Complexity Trade-offs**:
   - What complexity was added by moving to microservices?
   - What benefits do you see from the service separation?
   - How does local development compare to the monolithic approach?

3. **Communication Patterns**:
   - What happens when the User Service is unavailable?
   - How would you improve the reliability of service communication?
   - What alternatives to HTTP communication can you think of?

4. **Future Considerations**:
   - How would you add a third service to this architecture?
   - What would happen as the number of services grows?
   - How would you handle service versioning and API changes?

---

## Next Week Preview

In Week 4, you'll enhance your microservices with more sophisticated patterns:

- **Contract Testing**: Ensure service compatibility with Spring Cloud Contract
- **External API Integration**: Add Payment Service with real external API integration
- **Advanced Communication**: Implement message-based communication patterns
- **Service Testing**: Advanced testing strategies for distributed systems

The foundation you've built this week with basic microservices communication will be essential for the more advanced patterns you'll learn next week.

**Preparation for Week 4**:
- Ensure both services are working reliably
- Familiarize yourself with contract testing concepts
- Review external API integration patterns
- Make sure your Docker Compose environment is stable

Congratulations on successfully decomposing your monolith into microservices! You've taken a major step towards understanding distributed systems architecture. 🎉

## Additional Resources

### Recommended Reading
- **"Building Microservices" by Sam Newman** - Chapters 3-4 on service decomposition
- **"Microservices Patterns" by Chris Richardson** - Service decomposition patterns
- **Docker Compose Documentation** - Advanced compose file features

### Useful Commands Reference
```bash
# Development workflow commands
docker-compose up --build        # Build and start all services
docker-compose down -v          # Stop and remove volumes
docker-compose logs -f service  # Follow logs for specific service
docker-compose exec service bash # Shell into running service

# Service testing commands
curl -X GET http://localhost:8081/actuator/health  # Check service health
docker-compose ps                                  # List running services
docker network inspect $(docker-compose ps -q)    # Inspect network
```

### Next Steps
- Review your service extraction and ensure clean boundaries
- Practice the development workflow until it's comfortable
- Experiment with different failure scenarios
- Consider how you would add monitoring and observability
