
**Success Criteria**:
- [ ] Frontend can create premium events with payment processing
- [ ] Premium events are visually distinguished from regular events
- [ ] Payment flow works end-to-end (even if simulated)
- [ ] Error handling works for payment failures
- [ ] UI provides clear feedback during payment processing

---

## Testing Your Contract Testing and External API Implementation

### Contract Testing Verification

**Provider Contract Testing (User Service)**:
```bash
# Run contract verification tests
cd user-service
mvn clean test

# Should generate and run tests like:
# - ContractVerifierTest.validate_shouldReturnUserWhenValidId()
# - ContractVerifierTest.validate_shouldReturn404WhenUserNotFound()

# Install stubs for consumers
mvn clean install -DskipTests
```

**Consumer Contract Testing (Calendar Service)**:
```bash
# Run consumer contract tests
cd calendar-service
mvn test -Dtest=*ContractTest

# Tests should use WireMock stubs based on contracts
# Verify Calendar Service expectations are met
```

**Contract Evolution Testing**:
1. **Modify User Service API** (e.g., add required field to user response)
2. **Run contract tests** - should fail if breaking change
3. **Update contracts** if change is intentional
4. **Verify consumer can handle** the change gracefully

### External API Integration Testing

**End-to-End Payment Flow**:
```bash
# Start all services
docker-compose up

# Test complete payment flow:
# 1. Register user
curl -X POST http://localhost:8081/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"premium@test.com","name":"Premium User","password":"password123","timezone":"UTC"}'

# 2. Login to get token
TOKEN=$(curl -s -X POST http://localhost:8081/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"premium@test.com","password":"password123"}' | jq -r '.sessionToken')

# 3. Create calendar
CALENDAR=$(curl -s -X POST http://localhost:8082/api/calendars \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Premium Calendar","color":"#FFD700","ownerId":1}')

# 4. Create payment intent
PAYMENT=$(curl -s -X POST http://localhost:8083/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"userId":1,"amount":500,"currency":"usd"}')

echo "Payment Intent: $PAYMENT"
```

**External API Failure Testing**:
1. **Stop external API mock** (WireMock)
2. **Attempt payment creation** - should fail gracefully
3. **Verify error handling** provides useful messages
4. **Test retry mechanisms** work correctly

### Performance and Reliability Testing

**Contract Test Performance**:
- Contract tests should run in <30 seconds
- Provider verification should be part of CI pipeline
- Consumer tests should use cached stubs when possible

**External API Performance**:
- Payment creation should complete in <5 seconds
- Handle external API timeouts gracefully (test with delays)
- Test concurrent payment processing (10+ simultaneous requests)

**Service Communication Testing**:
```bash
# Test service dependencies
# Stop Payment Service and verify Calendar Service handles gracefully
docker-compose stop payment-service

# Try to create premium event - should fail with appropriate error
curl -X POST http://localhost:8082/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Premium Event","premium":true,"calendarId":1}'
```

---

## Troubleshooting Guide

### Contract Testing Issues

**Contract Verification Fails**:
- **Check Base Test Class**: Ensure `ContractVerifierBase` properly mocks dependencies
- **Verify Contract Syntax**: Groovy DSL syntax errors will cause test generation failures
- **Mock Setup**: Ensure mocked service responses match contract expectations exactly
- **HTTP Status Codes**: Verify response status codes match between contract and implementation

**Consumer Tests Fail**:
- **WireMock Port Conflicts**: Ensure WireMock uses unique ports for each test
- **Stub Loading**: Verify contract stubs are generated and accessible
- **HTTP Client Configuration**: Check that test HTTP client points to WireMock
- **Request Matching**: Ensure actual requests match contract expectations

**Generated Tests Don't Compile**:
```bash
# Check generated test classes
ls target/generated-test-sources/contracts/
# Verify base class package and imports are correct
```

### External API Integration Issues

**Stripe API Connection Failures**:
- **API Key Issues**: Verify test API key is valid and properly configured
- **Network Issues**: Check internet connectivity and firewall settings
- **Rate Limiting**: Stripe has rate limits even for test mode
- **Request Format**: Verify request body format matches Stripe API expectations

**WireMock Test Issues**:
- **Port Conflicts**: Use dynamic ports or unique port assignments
- **Stub Matching**: Verify request patterns match exactly
- **Response Format**: Ensure mock responses match actual API response structure
- **Test Isolation**: Reset WireMock between tests

**Payment Service Errors**:
```bash
# Check Payment Service logs
docker-compose logs payment-service

# Common issues:
# - External API configuration missing
# - Database connection failures
# - Service-to-service communication timeouts
```

### Docker Compose and Multi-Service Issues

**Service Startup Failures**:
```bash
# Check service dependencies
docker-compose ps
docker-compose logs service-name

# Verify environment variables are set correctly
docker-compose config
```

**Database Connection Issues**:
```bash
# Test database connectivity
docker exec -it payment-service ping payment-db
docker exec -it payment-db psql -U payment_service -d paymentdb -c "\dt"
```

**Service Communication Failures**:
```bash
# Test inter-service connectivity
docker exec -it payment-service curl http://calendar-service:8082/actuator/health
docker exec -it calendar-service curl http://user-service:8081/actuator/health
```

### Frontend Integration Issues

**API Endpoint Errors**:
- Verify service URLs are correct for each environment
- Check CORS configuration allows frontend domain
- Verify authentication tokens are included in requests
- Test each service endpoint individually

**Payment UI Issues**:
- Mock payment processing for development/testing
- Handle payment loading states properly
- Test error scenarios (declined cards, network failures)
- Verify premium event styling appears correctly

---

## Success Criteria

By the end of Week 4, you should have:

### Technical Achievements
- ✅ **Contract Testing Implementation**: Spring Cloud Contract between User and Calendar services
- ✅ **External API Integration**: Payment Service with Stripe (or alternative) API integration
- ✅ **Payment Processing**: Complete premium event creation with payment flow
- ✅ **Comprehensive Testing**: Contract tests, external API tests, and integration tests
- ✅ **Enhanced Frontend**: UI supports premium features and payment processing

### Architecture Understanding
- ✅ **Contract Testing Benefits**: Understanding of how contracts prevent integration issues
- ✅ **External API Patterns**: Knowledge of reliable external service integration
- ✅ **Error Handling**: Graceful handling of external service failures
- ✅ **Service Communication**: Multiple communication patterns (HTTP, contracts, external APIs)

### Development Skills
- ✅ **Spring Cloud Contract**: Ability to write and maintain service contracts
- ✅ **External API Integration**: Skills to integrate with third-party services securely
- ✅ **Testing Strategies**: Comprehensive testing approach for distributed systems
- ✅ **Error Handling**: Robust error handling across service boundaries

### Quality Practices
- ✅ **Test Automation**: Automated contract verification in build pipeline
- ✅ **API Documentation**: Clear documentation of service interactions
- ✅ **Monitoring**: Basic understanding of external service monitoring needs
- ✅ **Security**: Secure handling of API keys and payment information

---

## Reflection Questions

Take some time to think about this week's enhancements:

1. **Contract Testing Value**:
   - How do contracts help with independent service development?
   - What happens when you need to change a service API?
   - How would you handle contract evolution in a team environment?

2. **External API Integration**:
   - What challenges arise when depending on external services?
   - How do you balance reliability with functionality?
   - What strategies help handle external service outages?

3. **Testing Strategy**:
   - How do contract tests compare to integration tests?
   - What's the right balance between different types of tests?
   - How do you test external API integrations effectively?

4. **System Complexity**:
   - How has system complexity changed with external dependencies?
   - What new failure modes were introduced this week?
   - How do you monitor and debug distributed payment flows?

---

## Next Week Preview

In Week 5, you'll focus on advanced testing strategies and system reliability:

- **Integration Testing with Testcontainers**: Realistic testing environments
- **Notification Service**: Asynchronous processing and message queues
- **End-to-End Testing**: Complete system testing strategies
- **Performance Testing**: Load testing and performance optimization

The contract testing and external API integration skills you've developed this week will be essential for testing these more complex scenarios.

**Preparation for Week 5**:
- Ensure all contract tests are passing and reliable
- Verify external API integration works consistently
- Review asynchronous processing concepts
- Make sure your Docker Compose environment is stable

Excellent work on implementing professional testing practices and external API integration! You're building a production-ready microservices system. 🎉

## Additional Resources

### Contract Testing Resources
- **Spring Cloud Contract Documentation**: Complete reference guide
- **Consumer-Driven Contracts**: Martin Fowler's article on CDC patterns
- **Contract Testing Best Practices**: Industry patterns and practices
- **Pact vs Spring Cloud Contract**: Comparison of contract testing tools

### External API Integration
- **Stripe API Documentation**: Complete payment processing guide
- **HTTP Client Best Practices**: Timeouts, retries, and error handling
- **API Security**: Secure handling of API keys and sensitive data
- **External Service Monitoring**: Observability for third-party dependencies

### Testing Strategies
- **Testing Microservices**: Comprehensive testing approaches
- **WireMock Documentation**: API mocking and testing strategies
- **Integration Testing Patterns**: Effective integration testing strategies
- **Test Pyramid for Microservices**: Balancing different types of tests

### Payment Processing
- **PCI Compliance Basics**: Security requirements for payment data
- **Webhook Implementation**: Handling payment confirmations
- **Idempotency in Payments**: Preventing duplicate charges
- **Error Handling in Payments**: Graceful failure recovery

### Useful Commands Reference

**Contract Testing Commands**:
```bash
# Generate contracts from tests
mvn org.springframework.cloud:spring-cloud-contract-maven-plugin:convert

# Generate and run contract tests
mvn org.springframework.cloud:spring-cloud-contract-maven-plugin:generateTests
mvn clean test -Dtest=*ContractTest

# Install contract stubs for consumers
mvn clean install -DskipTests

# Run only contract verification tests
mvn test -Dtest=*ContractVerifierTest
```

**External API Testing Commands**:
```bash
# Test Stripe API directly (use test keys)
curl -X POST https://api.stripe.com/v1/payment_intents \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "amount=2000&currency=usd"

# Test local Payment Service
curl -X POST http://localhost:8083/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"userId":1,"amount":500,"currency":"usd"}'

# Health check all services
curl http://localhost:8081/actuator/health  # User Service
curl http://localhost:8082/actuator/health  # Calendar Service
curl http://localhost:8083/actuator/health  # Payment Service
```

**Docker and Service Management**:
```bash
# Start specific services for testing
docker-compose up user-db calendar-db user-service calendar-service

# View logs for payment service
docker-compose logs -f payment-service

# Restart services after code changes
docker-compose restart payment-service

# Check service connectivity
docker-compose exec payment-service curl http://user-service:8081/actuator/health
```

**Development Workflow Commands**:
```bash
# Build and test all services
./scripts/build-all.sh

# Run all contract tests
./scripts/test-contracts.sh

# Deploy to local environment
./scripts/deploy-local.sh

# Clean up test data
./scripts/cleanup-test-data.sh
```

### Performance Testing Tools
- **Apache Bench (ab)**: Simple HTTP load testing
- **JMeter**: Comprehensive performance testing
- **Gatling**: Scala-based load testing tool
- **k6**: Modern load testing tool

### Monitoring and Observability
- **Spring Boot Actuator**: Health checks and metrics
- **Micrometer**: Application metrics collection
- **ELK Stack**: Centralized logging (Elasticsearch, Logstash, Kibana)
- **Prometheus + Grafana**: Metrics monitoring and visualization

### Security Best Practices
- **API Key Rotation**: Regular rotation of external service keys
- **Secrets Management**: Secure storage of sensitive configuration
- **Request Signing**: Verifying requests from external services
- **Rate Limiting**: Protecting against abuse and overuse

---

## Week 4 Final Checklist

Before moving to Week 5, ensure you have completed:

### **Contract Testing**:
- [ ] Spring Cloud Contract configured in User Service (provider)
- [ ] Contract tests implemented in Calendar Service (consumer)
- [ ] Contract verification tests pass consistently
- [ ] Contract stubs are generated and usable
- [ ] Both services can develop independently using contracts

### **External API Integration**:
- [ ] Payment Service successfully integrates with external API
- [ ] WireMock tests simulate external API behavior
- [ ] Error handling works for external service failures
- [ ] Payment processing completes end-to-end
- [ ] External API timeouts and retries are configured

### **System Integration**:
- [ ] All services work together in Docker Compose
- [ ] Frontend can create premium events with payments
- [ ] Service-to-service communication is reliable
- [ ] Database per service pattern is maintained
- [ ] Authentication works across all services

### **Quality Assurance**:
- [ ] Contract tests run in <30 seconds
- [ ] External API integration tests are reliable
- [ ] Error scenarios are properly tested
- [ ] Payment flows are thoroughly validated
- [ ] System performs well under normal load

### **Documentation and Monitoring**:
- [ ] API documentation is updated for all services
- [ ] Service health checks are implemented
- [ ] Logging provides useful debugging information
- [ ] External service dependencies are documented
- [ ] Troubleshooting guides are accessible

Congratulations on implementing advanced microservices patterns! You now have a sophisticated system with contract testing and external API integration. This foundation will serve you well as you tackle even more complex scenarios in Week 5. 🚀

## Looking Ahead: Week 5 Preparation

To prepare for Week 5's focus on integration testing and asynchronous processing:

1. **Review Testcontainers Concepts**: Understand container-based testing
2. **Study Message Queues**: Basic understanding of RabbitMQ and async processing
3. **Plan Notification Scenarios**: Think about email/SMS notification requirements
4. **Consider Performance Testing**: How would you test system performance?
5. **Organize Your Codebase**: Ensure all Week 4 code is clean and well-organized

The robust testing practices you've implemented this week will be crucial for validating the more complex asynchronous systems you'll build next week.
