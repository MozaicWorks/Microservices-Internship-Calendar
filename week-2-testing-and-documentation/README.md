# Week 2: Testing and Documentation - Detailed Instructions

## Overview
This week you'll enhance your monolithic application with comprehensive testing, API documentation, and proper configuration management. You'll transform your basic application into a production-ready system with professional documentation and testing practices.

## Learning Goals
By the end of this week, you should be able to:
- Write effective unit tests using JUnit 5 and Mockito
- Document APIs professionally with OpenAPI/Swagger
- Configure applications for different environments
- Implement comprehensive error handling
- Create user-friendly error messages in the UI

---

## Day 1: API Documentation and Configuration

### Step 1: Add OpenAPI/Swagger Dependencies (30 minutes)

**Objective**: Add API documentation capabilities to your application.

**Tasks**:
1. Open your `pom.xml` file from Week 1
2. Add the following dependencies in the `<dependencies>` section:
   ```xml
   <!-- OpenAPI/Swagger Documentation -->
   <dependency>
       <groupId>org.springdoc</groupId>
       <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
       <version>2.2.0</version>
   </dependency>
   ```

3. Run `mvn clean install` to download dependencies
4. Start your application with `mvn spring-boot:run`
5. Visit `http://localhost:8080/swagger-ui.html` to see the auto-generated API documentation

**Success Criteria**:
- [ ] Swagger UI loads without errors
- [ ] You can see all your REST endpoints listed
- [ ] You can expand endpoints to see request/response schemas

**Troubleshooting**:
- If Swagger UI doesn't load, check the console for errors
- Ensure your application is running on port 8080
- Try accessing `http://localhost:8080/v3/api-docs` for raw OpenAPI JSON

### Step 2: Configure OpenAPI Documentation (45 minutes)

**Objective**: Customize your API documentation with proper titles, descriptions, and examples.

**Tasks**:
1. Create a new configuration class `OpenApiConfig.java` in the `config` package
2. Add the following annotations and configuration:
   - `@Configuration`
   - `@OpenAPIDefinition` with info about your API
   - Configure security schemes if you have authentication

3. Enhance your controller classes with OpenAPI annotations:
   - Add `@Tag` to each controller class
   - Add `@Operation` to each endpoint method
   - Add `@ApiResponse` annotations for different response codes
   - Add `@Parameter` descriptions for request parameters

4. Update your DTO classes with validation annotations:
   - `@Schema` for property descriptions
   - `@NotNull`, `@Email`, `@Size` for validation

**Example Structure**:
```java
@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "APIs for user registration and authentication")
public class UserController {
    
    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Creates a new user account")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "User created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "409", description = "User already exists")
    })
    public ResponseEntity<UserDto> register(@Valid @RequestBody CreateUserRequest request) {
        // Implementation
    }
}
```

**Success Criteria**:
- [ ] API documentation shows custom titles and descriptions
- [ ] Each endpoint has clear operation summaries
- [ ] Request/response schemas show validation rules
- [ ] Error responses are documented

### Step 3: Set Up Spring Boot Profiles (45 minutes)

**Objective**: Configure your application to work in different environments (development, testing, production).

**Tasks**:
1. Rename your `application.yml` to `application-dev.yml`
2. Create new profile-specific configuration files:
   - `application.yml` (default/common config)
   - `application-test.yml` (for testing)
   - `application-prod.yml` (for production)

3. Configure each profile with appropriate settings:
   - **Development**: H2 database, detailed logging, dev tools enabled
   - **Test**: H2 database, minimal logging, fast startup
   - **Production**: PostgreSQL placeholders, security settings, performance tuning

4. Add external configuration support using environment variables
5. Test switching between profiles using:
   - Command line: `mvn spring-boot:run -Dspring.profiles.active=test`
   - IDE configuration
   - Environment variables

**Profile Configuration Examples**:

**application.yml (common)**:
```yaml
spring:
  application:
    name: simplecal
    
app:
  jwt:
    secret: ${JWT_SECRET:defaultSecretKey}
    expiration: ${JWT_EXPIRATION:86400000}
```

**application-dev.yml**:
```yaml
spring:
  profiles:
    active: dev
  datasource:
    url: jdbc:h2:mem:devdb
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: create-drop
  h2:
    console:
      enabled: true

logging:
  level:
    com.simplecal: DEBUG
```

**application-test.yml**:
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: false

logging:
  level:
    com.simplecal: WARN
```

**Success Criteria**:
- [ ] Application starts successfully with different profiles
- [ ] Configuration changes are applied correctly for each profile
- [ ] External configuration via environment variables works
- [ ] H2 console is available in dev but not in prod profile

**Testing Your Profiles**:
1. Run with dev profile: Check H2 console access and debug logging
2. Run with test profile: Verify minimal logging and test database
3. Set environment variables and verify they override default values

---

## Day 2: Unit Testing and Error Handling

### Step 4: Set Up Testing Framework (30 minutes)

**Objective**: Configure comprehensive testing capabilities for your application.

**Tasks**:
1. Add testing dependencies to your `pom.xml`:
   ```xml
   <!-- Enhanced Testing Dependencies -->
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-test</artifactId>
       <scope>test</scope>
   </dependency>
   <dependency>
       <groupId>org.testcontainers</groupId>
       <artifactId>junit-jupiter</artifactId>
       <scope>test</scope>
   </dependency>
   <!-- Test coverage reporting -->
   <dependency>
       <groupId>org.jacoco</groupId>
       <artifactId>jacoco-maven-plugin</artifactId>
       <version>0.8.8</version>
   </dependency>
   ```

2. Configure JaCoCo plugin for test coverage in your `pom.xml`:
   ```xml
   <plugin>
       <groupId>org.jacoco</groupId>
       <artifactId>jacoco-maven-plugin</artifactId>
       <version>0.8.8</version>
       <executions>
           <execution>
               <goals>
                   <goal>prepare-agent</goal>
               </goals>
           </execution>
           <execution>
               <id>report</id>
               <phase>test</phase>
               <goals>
                   <goal>report</goal>
               </goals>
           </execution>
       </executions>
   </plugin>
   ```

3. Create test directory structure if not already present
4. Configure test application properties

**Success Criteria**:
- [ ] `mvn test` runs without errors
- [ ] Test coverage reports are generated in `target/site/jacoco/index.html`
- [ ] Test configuration is properly isolated from main application

### Step 5: Write Service Layer Unit Tests (60 minutes)

**Objective**: Create comprehensive unit tests for your service classes using Mockito.

**Tasks**:
1. Create test classes for each service:
   - `UserServiceTest.java`
   - `CalendarServiceTest.java`
   - `EventServiceTest.java`

2. For each service test, implement:
   - **Setup**: Use `@ExtendWith(MockitoExtension.class)` and `@Mock` annotations
   - **Happy path tests**: Test successful operations
   - **Error path tests**: Test exception scenarios
   - **Edge cases**: Test boundary conditions and null inputs
   - **Validation tests**: Test input validation logic

3. Use Mockito features:
   - `@Mock` for dependencies
   - `@InjectMocks` for the service under test
   - `when().thenReturn()` for stubbing
   - `verify()` for interaction verification
   - `ArgumentCaptor` for capturing method arguments

**Test Structure Example**:
```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    @DisplayName("Should register user when valid request provided")
    void shouldRegisterUserWhenValidRequest() {
        // Given (Arrange)
        CreateUserRequest request = new CreateUserRequest("test@example.com", "Test User", "password", "UTC");
        User savedUser = new User("test@example.com", "Test User", "encodedPassword", "UTC");
        
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        
        // When (Act)
        UserDto result = userService.register(request);
        
        // Then (Assert)
        assertThat(result.getEmail()).isEqualTo("test@example.com");
        assertThat(result.getName()).isEqualTo("Test User");
        verify(userRepository).existsByEmail("test@example.com");
        verify(passwordEncoder).encode("password");
        verify(userRepository).save(any(User.class));
    }
    
    @Test
    @DisplayName("Should throw exception when user already exists")
    void shouldThrowExceptionWhenUserAlreadyExists() {
        // Given
        CreateUserRequest request = new CreateUserRequest("test@example.com", "Test User", "password", "UTC");
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);
        
        // When & Then
        assertThatThrownBy(() -> userService.register(request))
            .isInstanceOf(UserAlreadyExistsException.class)
            .hasMessageContaining("User with email already exists");
        
        verify(userRepository, never()).save(any(User.class));
    }
}
```

**Test Coverage Goals**:
- Service methods: >90% coverage
- Happy paths: 100% covered
- Error scenarios: All major exception paths covered
- Edge cases: Null inputs, empty collections, boundary values

**Success Criteria**:
- [ ] All service methods have unit tests
- [ ] Tests use proper Given-When-Then structure
- [ ] Mocks are used correctly to isolate the service under test
- [ ] Both positive and negative test cases are covered
- [ ] Test coverage report shows >80% overall coverage

### Step 6: Write Repository and Controller Tests (45 minutes)

**Objective**: Add integration tests for repositories and controller layer tests.

**Tasks**:

**Repository Tests** (using `@DataJpaTest`):
1. Create repository test classes with `@DataJpaTest` annotation
2. Use `TestEntityManager` for setting up test data
3. Test custom query methods and relationships
4. Verify database constraints and validations

**Controller Tests** (using `@WebMvcTest`):
1. Create controller test classes with `@WebMvcTest` annotation
2. Mock service dependencies with `@MockBean`
3. Use `MockMvc` to test HTTP endpoints
4. Test request/response serialization
5. Verify HTTP status codes and response headers
6. Test validation error scenarios

**Repository Test Example Structure**:
```java
@DataJpaTest
@TestPropertySource(properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class UserRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    @DisplayName("Should find user by email when user exists")
    void shouldFindUserByEmailWhenUserExists() {
        // Given
        User user = new User("test@example.com", "Test User", "password", "UTC");
        entityManager.persistAndFlush(user);
        
        // When
        Optional<User> found = userRepository.findByEmail("test@example.com");
        
        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Test User");
    }
}
```

**Controller Test Example Structure**:
```java
@WebMvcTest(UserController.class)
class UserControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private UserService userService;
    
    @Test
    @DisplayName("Should return 201 when valid user registration request")
    void shouldReturn201WhenValidUserRegistrationRequest() throws Exception {
        // Given
        CreateUserRequest request = new CreateUserRequest("test@example.com", "Test User", "password", "UTC");
        UserDto response = new UserDto(1L, "test@example.com", "Test User", "UTC");
        
        when(userService.register(any(CreateUserRequest.class))).thenReturn(response);
        
        // When & Then
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.name").value("Test User"));
        
        verify(userService).register(any(CreateUserRequest.class));
    }
}
```

**Success Criteria**:
- [ ] Repository tests verify custom queries and relationships
- [ ] Controller tests cover all endpoints with various scenarios
- [ ] HTTP status codes are tested correctly
- [ ] Request/response JSON serialization is verified

### Step 7: Implement Global Exception Handling (30 minutes)

**Objective**: Create centralized error handling with user-friendly error messages.

**Tasks**:
1. Create a global exception handler class with `@ControllerAdvice`
2. Define custom exception classes for your domain
3. Map exceptions to appropriate HTTP status codes
4. Create standardized error response format
5. Add validation error handling
6. Test exception scenarios

**Exception Handling Structure**:
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUserAlreadyExists(UserAlreadyExistsException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.CONFLICT.value(),
            "User Already Exists",
            ex.getMessage(),
            "/api/users/register"
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        // Handle validation errors
    }
}
```

**Custom Exceptions to Create**:
- `UserAlreadyExistsException`
- `UserNotFoundException`
- `CalendarNotFoundException`
- `EventNotFoundException`
- `UnauthorizedException`

**Success Criteria**:
- [ ] Global exception handler catches all custom exceptions
- [ ] Validation errors return structured error responses
- [ ] HTTP status codes are appropriate for each error type
- [ ] Error responses include helpful messages for debugging

### Step 8: Enhance UI Error Handling (30 minutes)

**Objective**: Improve the frontend to handle errors gracefully and show user-friendly messages.

**Tasks**:
1. Update your JavaScript error handling to parse structured error responses
2. Show appropriate error messages for different scenarios:
   - Network errors
   - Validation errors
   - Authentication errors
   - Server errors

3. Add loading states and better user feedback
4. Implement retry mechanisms for failed requests
5. Add form validation on the frontend

**UI Error Handling Improvements**:
- Better error message display
- Form validation feedback
- Loading spinners during API calls
- Retry buttons for failed operations
- Success confirmations for completed actions

**Success Criteria**:
- [ ] Error messages are user-friendly and actionable
- [ ] Loading states provide good user feedback
- [ ] Form validation works on both frontend and backend
- [ ] Users can recover from error scenarios

---

## Testing Your Implementation

### Comprehensive Testing Checklist

**API Documentation Testing**:
- [ ] Swagger UI loads at `http://localhost:8080/swagger-ui.html`
- [ ] All endpoints are documented with descriptions
- [ ] Request/response schemas are accurate
- [ ] You can test API calls directly from Swagger UI

**Profile Configuration Testing**:
- [ ] Application starts with dev profile (`mvn spring-boot:run -Dspring.profiles.active=dev`)
- [ ] Application starts with test profile (`mvn spring-boot:run -Dspring.profiles.active=test`)
- [ ] H2 console is accessible in dev profile but not in others
- [ ] Environment variables override default configuration

**Unit Testing**:
- [ ] All tests pass: `mvn test`
- [ ] Test coverage is >80%: Check `target/site/jacoco/index.html`
- [ ] Service layer has comprehensive test coverage
- [ ] Repository tests verify data operations
- [ ] Controller tests verify HTTP behavior

**Error Handling**:
- [ ] Try to register with duplicate email (should show user-friendly error)
- [ ] Try to login with wrong credentials (should show appropriate error)
- [ ] Submit forms with invalid data (should show validation errors)
- [ ] Network errors are handled gracefully in UI

### Performance Testing
- [ ] Application starts in under 10 seconds
- [ ] Tests run in under 30 seconds
- [ ] API responses are under 500ms for simple operations

### Code Quality Checks
- [ ] No compiler warnings
- [ ] Consistent code formatting
- [ ] Meaningful test names using `@DisplayName`
- [ ] Proper exception handling throughout the application

---

## Troubleshooting Guide

### Common Issues and Solutions

**Swagger UI Not Loading**:
- Check if `springdoc-openapi-starter-webmvc-ui` dependency is added
- Verify application is running on correct port
- Try accessing `/v3/api-docs` endpoint directly
- Check console for security configuration issues

**Profile Configuration Not Working**:
- Verify YAML indentation (spaces, not tabs)
- Check that profile-specific files are named correctly
- Ensure `spring.profiles.active` is set correctly
- Verify environment variables are exported correctly

**Test Failures**:
- Check test database configuration in `application-test.yml`
- Verify mock setup in unit tests
- Ensure test data doesn't conflict between tests
- Check that `@Transactional` is used where needed

**Low Test Coverage**:
- Add tests for exception scenarios
- Test edge cases and boundary conditions
- Ensure all public methods are tested
- Check if there are untested conditional branches

**Error Handling Issues**:
- Verify `@ControllerAdvice` is in component scan path
- Check exception hierarchy and handler specificity
- Ensure custom exceptions extend appropriate base classes
- Test error scenarios manually to verify handler behavior

### Getting Help
- Review the [Setup Guide](../docs/setup-guide.md) for environment issues
- Check [API Specifications](../docs/api-specifications.md) for endpoint details
- Look at test examples in the `solutions/` folder
- Create an issue in the repository for persistent problems

---

## Success Criteria

By the end of Week 2, you should have:

### Technical Achievements
- ✅ **Complete API Documentation**: Professional Swagger UI with detailed endpoint descriptions
- ✅ **Comprehensive Test Suite**: >80% test coverage with unit, integration, and controller tests
- ✅ **Multi-Environment Configuration**: Working dev, test, and prod profiles
- ✅ **Robust Error Handling**: Global exception handling with user-friendly error messages
- ✅ **Enhanced UI**: Better error handling and user feedback

### Skills Developed
- ✅ **Testing Expertise**: Ability to write effective unit tests with Mockito
- ✅ **API Documentation**: Skills to create professional API documentation
- ✅ **Configuration Management**: Understanding of Spring Boot profiles and external configuration
- ✅ **Error Handling**: Knowledge of exception handling patterns in web applications
- ✅ **Code Quality**: Understanding of test coverage and code quality metrics

### Deliverables
- ✅ **Working Application**: Enhanced monolithic application with all Week 2 features
- ✅ **Test Reports**: Generated test coverage reports showing >80% coverage
- ✅ **API Documentation**: Accessible Swagger UI with complete API documentation
- ✅ **Configuration Files**: Profile-specific configuration for different environments

---

## Next Week Preview

In Week 3, you'll take your well-tested, documented monolithic application and begin the exciting journey of breaking it apart into microservices. You'll:

- Extract your first microservice (Calendar Service)
- Set up Docker Compose for local development
- Implement service-to-service communication
- Learn about service boundaries and data ownership

The solid foundation you've built this week with testing and documentation will make the transition to microservices much smoother and more reliable.

**Preparation for Week 3**: 
- Ensure all Week 2 tests are passing
- Familiarize yourself with Docker basics
- Review your current application architecture to understand the components

Great job on completing Week 2! You've transformed your basic application into a production-ready system with professional testing and documentation practices. 🎉
