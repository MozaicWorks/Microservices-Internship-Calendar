
1. **Multi-Service Integration Test Setup**:
   Create integration tests that run multiple services in containers using Testcontainers. Set up a Docker network to allow services to communicate and test complete workflows.

2. **Build Docker Images for Testing**:
   Create test-specific Dockerfiles for each service and build images that can be used in integration tests.

**Success Criteria**:
- [ ] Multi-service tests run with isolated container environments
- [ ] Services can communicate through Docker networks
- [ ] Tests verify end-to-end business workflows
- [ ] Container cleanup happens automatically after tests

---

## Day 2: Notification Service and Asynchronous Testing

### Step 5: Design Notification Service Architecture (30 minutes)

**Objective**: Plan an asynchronous notification service that handles email and SMS reminders.

**Notification Service Responsibilities**:
- Process notification requests asynchronously
- Handle email and SMS delivery
- Manage notification preferences and templates
- Retry failed notifications with exponential backoff
- Track delivery status and analytics

**Asynchronous Processing Pattern**:
Event Triggered → Message Queue → Notification Service → External API → Delivery Confirmation

**Tasks**:
1. Plan message-driven architecture with RabbitMQ
2. Design notification types (event reminders, calendar sharing, payment confirmations)
3. Plan external service integration (email SMTP, SMS API)
4. Design retry and error handling mechanisms

**Success Criteria**:
- [ ] Clear understanding of notification service architecture
- [ ] Message-driven design planned
- [ ] External service integration strategy defined
- [ ] Async processing patterns identified

### Step 6: Implement Notification Service (75 minutes)

**Objective**: Create a notification service with asynchronous message processing.

**Tasks**:

1. **Create Notification Service Project**:
   - Set up new Spring Boot project for notifications
   - Add dependencies: Spring AMQP, Mail, WebClient, JPA
   - Configure to run on port 8084

2. **Create Core Entities**:
   ```java
   @Entity
   public class Notification {
       private Long id;
       private Long userId;
       private NotificationType type; // EMAIL, SMS
       private String recipient;
       private String subject;
       private String content;
       private NotificationStatus status; // PENDING, SENT, FAILED
       private Integer retryCount;
       private LocalDateTime scheduledAt;
       // getters, setters, timestamps
   }
   ```

3. **Implement Message Listeners**:
   ```java
   @RabbitListener(queues = "notification.events")
   public class NotificationEventListener {
       
       @RabbitHandler
       public void handleCalendarSharedEvent(CalendarSharedEvent event) {
           // Create notification request
           // Schedule for immediate processing
       }
       
       @RabbitHandler
       public void handleEventReminderEvent(EventReminderEvent event) {
           // Create notification request
           // Schedule for 15 minutes before event
       }
   }
   ```

4. **Implement Notification Processing**:
   ```java
   @Service
   public class NotificationService {
       
       @Async
       public void processNotificationAsync(Long notificationId) {
           // Process notification based on type
           // Handle failures with retry logic
           // Update status in database
       }
       
       @Scheduled(fixedDelay = 60000)
       public void processScheduledNotifications() {
           // Find pending notifications due for processing
           // Process each notification asynchronously
       }
   }
   ```

5. **Add External Service Clients**:
   - EmailService: Use JavaMailSender for email delivery
   - SmsService: Use WebClient for SMS API integration
   - Implement proper error handling and timeouts

6. **Configure Docker Compose**:
   Add notification service and database to docker-compose.yml

**Success Criteria**:
- [ ] Notification Service processes messages asynchronously
- [ ] Email and SMS delivery work with external services
- [ ] Failed notifications are retried with exponential backoff
- [ ] Service integrates with message queue properly

### Step 7: Create Comprehensive Async Testing (60 minutes)

**Objective**: Test asynchronous message processing with Testcontainers.

**Tasks**:

1. **Set Up Async Testing Infrastructure**:
   ```java
   @SpringBootTest
   @Testcontainers
   class NotificationServiceAsyncTest {
       
       @Container
       static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:14");
       
       @Container
       static RabbitMQContainer rabbitmq = new RabbitMQContainer("rabbitmq:3.8-management");
       
       @MockBean
       private EmailService emailService;
   }
   ```

2. **Test Message Processing**:
   - Publish events to RabbitMQ
   - Verify notifications are created in database
   - Use Awaitility to wait for async processing
   - Mock external services (email, SMS)

3. **Test Retry Logic**:
   - Mock service failures
   - Verify retry count increases
   - Test permanent failure after max retries

4. **Performance Testing**:
   - Test processing 100+ notifications
   - Verify processing completes within time limits
   - Check no memory leaks or resource issues

**Key Testing Patterns**:
- Use `@Testcontainers` for realistic environments
- Use `await().atMost(Duration.ofSeconds(10))` for async testing
- Mock external services to avoid real API calls
- Test both success and failure scenarios

**Success Criteria**:
- [ ] Async message processing tests pass reliably
- [ ] Notification retry logic is thoroughly tested
- [ ] Performance tests validate system can handle load
- [ ] Message queue integration works correctly

---

## Testing Your Implementation

### Service-Level Integration Testing
```bash
# Run individual service integration tests
cd notification-service && mvn test -Dtest=*IntegrationTest
```

### Cross-Service Integration Testing
```bash
# Build Docker images for testing
docker build -t notification-service:test notification-service/

# Run multi-service integration tests
mvn test -Dtest=MultiServiceIntegrationTest
```

### End-to-End Workflow Testing
1. Start all services with `docker-compose up`
2. Execute complete workflow tests
3. Verify async processing works end-to-end

---

## Troubleshooting Guide

### Testcontainers Issues
- **Container startup failures**: Check Docker memory limits
- **Port conflicts**: Use dynamic ports in tests
- **Slow tests**: Enable container reuse with `testcontainers.reuse.enable=true`

### Async Processing Issues
- **Messages not processed**: Check queue configuration and bindings
- **Notification failures**: Verify external service connectivity
- **Performance issues**: Monitor database connections and thread pools

### Integration Test Debugging
- **Multi-service failures**: Check container logs with `docker logs`
- **Connectivity issues**: Test with `docker exec container ping other-container`
- **Test data cleanup**: Ensure proper isolation between tests

---

## Success Criteria

By the end of Week 5, you should have:

### Technical Achievements
- ✅ **Testcontainers Integration**: Realistic testing with actual databases and message queues
- ✅ **Notification Service**: Complete asynchronous notification processing system
- ✅ **Message-Driven Architecture**: Event-driven communication between services
- ✅ **Comprehensive Testing**: Integration tests covering all services and interactions

### Architecture Understanding
- ✅ **Integration Testing Strategies**: Multiple approaches for testing distributed systems
- ✅ **Asynchronous Processing**: Understanding of message queues and async patterns
- ✅ **Event-Driven Design**: Knowledge of event-driven architecture principles
- ✅ **System Reliability**: Handling failures in distributed systems

### Development Skills
- ✅ **Testcontainers Expertise**: Ability to create realistic test environments
- ✅ **Async Programming**: Skills in building and testing asynchronous systems
- ✅ **Message Queue Integration**: Experience with RabbitMQ and message-driven patterns
- ✅ **Performance Testing**: Understanding of load testing and performance optimization

---

## Reflection Questions

1. **Testing Strategy Evolution**:
   - How has your testing approach changed as the system became more complex?
   - What are the trade-offs between different types of tests?

2. **Asynchronous Architecture**:
   - What challenges arise when processing becomes asynchronous?
   - How do you ensure message delivery reliability?

3. **System Complexity**:
   - How do you manage the increased complexity of a distributed system?
   - What strategies help with debugging across multiple services?

4. **Production Readiness**:
   - What additional considerations are needed for production deployment?
   - How would you monitor and alert on system health?

---

## Next Week Preview

In Week 6, you'll complete your microservices journey:
- **System Completion**: Adding the final Sharing Service
- **Enhanced Frontend**: Full-featured UI working with all microservices
- **Documentation**: Comprehensive system documentation
- **Deployment Preparation**: Readying for production

**Preparation for Week 6**:
- Ensure all integration tests pass consistently
- Review system architecture for any gaps
- Think about user experience improvements
- Consider documentation needs

Outstanding work on implementing advanced testing strategies! 🎉

## Additional Resources

### Integration Testing
- **Testcontainers Documentation**: Complete guide to container-based testing
- **Spring Boot Test Documentation**: Comprehensive testing approaches

### Asynchronous Processing
- **RabbitMQ Documentation**: Message queue best practices
- **Spring AMQP Reference**: Spring integration with message queues

### Performance Testing
- **JMeter User Manual**: Performance testing strategies
- **Gatling Documentation**: Load testing for web applications

### Useful Commands

**Testcontainers Management**:
```bash
# Clean up test containers
docker container prune -f

# Speed up tests with container reuse
echo "testcontainers.reuse.enable=true" >> ~/.testcontainers.properties
```

**Message Queue Operations**:
```bash
# Check RabbitMQ management interface
open http://localhost:15672

# Monitor queue depths
rabbitmqctl list_queues
```

**Development Workflow**:
```bash
# Run all integration tests
./scripts/run-integration-tests.sh

# Start test environment
./scripts/start-test-environment.sh
```

---

## Week 5 Final Checklist

Before proceeding to Week 6, ensure you have:

### **Integration Testing Foundation**:
- [ ] Testcontainers configured for all services
- [ ] Service-to-service integration tests working
- [ ] Multi-service workflow tests passing

### **Notification Service**:
- [ ] Asynchronous message processing implemented
- [ ] Email and SMS delivery functional
- [ ] Retry logic and error handling working
- [ ] Message queue integration complete

### **Testing Strategy**:
- [ ] Comprehensive test suite covering integration points
- [ ] Async processing thoroughly tested
- [ ] Performance tests validate capabilities
- [ ] Error scenarios tested

### **System Reliability**:
- [ ] Services handle failures gracefully
- [ ] Message delivery guarantees implemented
- [ ] Data consistency maintained across services

Congratulations on building a sophisticated, well-tested microservices system! 🚀
